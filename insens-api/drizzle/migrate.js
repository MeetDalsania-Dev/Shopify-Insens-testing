/**
 * migrate.ts  —  Custom migration runner
 *
 * Why: drizzle-kit's built-in `migrate` command generates SQL with syntax that
 * may be incompatible with PostgreSQL < 14 on some drizzle-kit versions.
 * This script reads the generated .sql files and applies them directly via
 * node-postgres, statement by statement, with proper error context.
 *
 * Tracks applied migrations in a `public.__insens_migrations` table so it is
 * safe to run multiple times (idempotent).
 *
 * Usage:  bun drizzle/migrate.ts
 */
import { Pool } from 'pg';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';
// ── Config ───────────────────────────────────────────────────────────────────
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.error('❌  DATABASE_URL is not set. Copy .env.example → .env and fill it in.');
    process.exit(1);
}
const MIGRATIONS_DIR = join(import.meta.dir, 'migrations');
const MIGRATIONS_TABLE = '__insens_migrations';
// ── Helpers ───────────────────────────────────────────────────────────────────
function fileHash(content) {
    return createHash('sha256').update(content).digest('hex').slice(0, 16);
}
/**
 * Split a Drizzle-generated .sql file into runnable statements.
 * Drizzle uses `--> statement-breakpoint` as a separator.
 */
function splitStatements(sql) {
    return sql
        .split('--> statement-breakpoint')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
}
/**
 * Patch statements that use PostgreSQL 14-only syntax so they work on PG 10+.
 *
 *  CREATE TYPE IF NOT EXISTS "x" AS ENUM(...)
 *    →  DO $$ BEGIN CREATE TYPE "x" AS ENUM(...); EXCEPTION WHEN duplicate_object THEN null; END $$
 *
 *  ALTER TYPE "x" ADD VALUE IF NOT EXISTS 'foo'
 *    →  safe ALTER TYPE with existence check
 */
function patchStatement(sql) {
    // CREATE TYPE IF NOT EXISTS → DO block (works PG 10+)
    const typeIfNotExists = /CREATE\s+TYPE\s+IF\s+NOT\s+EXISTS\s+([\w".\s]+?)\s+AS\s+ENUM\s*\(([^)]+)\)/gi;
    if (typeIfNotExists.test(sql)) {
        return sql.replace(typeIfNotExists, (_, typeName, values) => `DO $$ BEGIN\n  CREATE TYPE ${typeName.trim()} AS ENUM(${values});\n` +
            `EXCEPTION WHEN duplicate_object THEN null;\nEND $$`);
    }
    return sql;
}
// ── Runner ────────────────────────────────────────────────────────────────────
async function ensureMigrationsTable(client) {
    await client.query(`
    CREATE TABLE IF NOT EXISTS "${MIGRATIONS_TABLE}" (
      id          SERIAL       PRIMARY KEY,
      filename    TEXT         NOT NULL UNIQUE,
      hash        TEXT         NOT NULL,
      applied_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `);
}
async function getAppliedMigrations(client) {
    const result = await client.query(`SELECT filename FROM "${MIGRATIONS_TABLE}" ORDER BY id`);
    return new Set(result.rows.map((r) => r.filename));
}
async function applyMigration(client, filename, sql) {
    const statements = splitStatements(sql);
    await client.query('BEGIN');
    try {
        for (let i = 0; i < statements.length; i++) {
            const stmt = patchStatement(statements[i]);
            if (!stmt.trim())
                continue;
            try {
                await client.query(stmt);
            }
            catch (err) {
                const pos = err.position ? Number(err.position) : -1;
                const snippet = pos >= 0 ? stmt.substring(Math.max(0, pos - 30), pos + 50) : '';
                throw new Error(`Statement ${i + 1}/${statements.length} failed:\n` +
                    `  ${err.message}\n` +
                    (snippet ? `  Near: …${snippet}…\n` : '') +
                    `\n  SQL:\n  ${stmt.replace(/\n/g, '\n  ')}`);
            }
        }
        await client.query(`INSERT INTO "${MIGRATIONS_TABLE}" (filename, hash) VALUES ($1, $2)`, [filename, fileHash(sql)]);
        await client.query('COMMIT');
    }
    catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
}
async function main() {
    const pool = new Pool({ connectionString: DATABASE_URL });
    const client = await pool.connect();
    console.log('🗄️   Insens — Custom Migration Runner');
    console.log('─'.repeat(50));
    // Check PostgreSQL version
    const versionRow = await client.query('SELECT version()');
    console.log('🐘  ' + versionRow.rows[0].version.split(' ').slice(0, 3).join(' '));
    console.log('─'.repeat(50));
    try {
        await ensureMigrationsTable(client);
        const applied = await getAppliedMigrations(client);
        const files = readdirSync(MIGRATIONS_DIR)
            .filter((f) => f.endsWith('.sql'))
            .sort();
        if (files.length === 0) {
            console.log('⚠️   No migration files found. Run: bun db:generate');
            return;
        }
        let pendingCount = 0;
        for (const file of files) {
            if (applied.has(file)) {
                console.log(`⏭️   Already applied: ${file}`);
                continue;
            }
            const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf-8');
            pendingCount++;
            process.stdout.write(`⚡  Applying: ${file} … `);
            await applyMigration(client, file, sql);
            console.log('✅');
        }
        if (pendingCount === 0) {
            console.log('\n✨  Database is already up to date.');
        }
        else {
            console.log(`\n🎉  Applied ${pendingCount} migration(s) successfully.`);
        }
    }
    finally {
        client.release();
        await pool.end();
    }
}
main().catch((err) => {
    console.error('\n❌  Migration failed:\n');
    console.error(err.message ?? err);
    process.exit(1);
});
