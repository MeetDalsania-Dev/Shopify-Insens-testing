/**
 * fix-migrations.ts
 *
 * drizzle-kit v0.21.x generates:
 *   CREATE TYPE IF NOT EXISTS "public"."foo" AS ENUM(...)
 *
 * The `IF NOT EXISTS` clause for CREATE TYPE was only added in PostgreSQL 14.
 * If you are on PostgreSQL 10–13, run this script once after `bun db:generate`
 * to patch the migration files so they work on any PG 10+ installation.
 *
 * Usage:
 *   bun drizzle/fix-migrations.ts
 */
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
const MIGRATIONS_DIR = join(import.meta.dir, 'migrations');
const files = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql'));
let patched = 0;
for (const file of files) {
    const filePath = join(MIGRATIONS_DIR, file);
    let sql = readFileSync(filePath, 'utf-8');
    if (!sql.includes('CREATE TYPE IF NOT EXISTS')) {
        continue;
    }
    // Replace:
    //   CREATE TYPE IF NOT EXISTS "public"."foo" AS ENUM('A', 'B');
    // With a safe DO block that works on PG 10+:
    //   DO $$ BEGIN
    //     CREATE TYPE "public"."foo" AS ENUM('A', 'B');
    //   EXCEPTION WHEN duplicate_object THEN null;
    //   END $$;
    sql = sql.replace(/CREATE TYPE IF NOT EXISTS ("[\w".]+")\s+AS ENUM\(([^)]+)\);/g, (_, typeName, values) => `DO $$ BEGIN\n  CREATE TYPE ${typeName} AS ENUM(${values});\n` +
        `EXCEPTION WHEN duplicate_object THEN null;\nEND $$;`);
    writeFileSync(filePath, sql, 'utf-8');
    console.log(`✅ Patched: ${file}`);
    patched++;
}
if (patched === 0) {
    console.log('ℹ️  No migration files needed patching (already compatible).');
}
else {
    console.log(`\n🎉 Done — patched ${patched} file(s). Now run: bun db:migrate`);
}
