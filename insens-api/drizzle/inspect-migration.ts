/**
 * inspect-migration.ts
 *
 * Reads the generated SQL migration file, splits it into individual statements,
 * and tries to apply each one — showing exactly which statement fails and why.
 *
 * Run: bun drizzle/inspect-migration.ts
 */

import { Pool }          from 'pg';
import { readFileSync, readdirSync } from 'fs';
import { join }          from 'path';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌  DATABASE_URL is not set. Create a .env file from .env.example first.');
  process.exit(1);
}

const MIGRATIONS_DIR = join(__dirname, 'migrations');

const files = readdirSync(MIGRATIONS_DIR)
  .filter((f) => f.endsWith('.sql'))
  .sort();

if (files.length === 0) {
  console.error('❌  No migration files found. Run: bun db:generate');
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

for (const file of files) {
  const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf-8');

  console.log(`\n📄 File: ${file}`);
  console.log('─'.repeat(60));

  const statements = sql
    .split('--> statement-breakpoint')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`   ${statements.length} statements found\n`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    process.stdout.write(`  [${i + 1}/${statements.length}] ${stmt.substring(0, 80).replace(/\n/g, ' ').trim()}…`);

    try {
      await pool.query(stmt);
      console.log('  ✅');
    } catch (err: any) {
      console.log('\n');
      console.log('  ❌  FAILED');
      console.log('  ─────────────────────────────────────');
      console.log('  Error  :', err.message);
      console.log('  Code   :', err.code);
      if (err.position) {
        const pos = Number(err.position);
        const snippet = stmt.substring(Math.max(0, pos - 20), pos + 40);
        console.log('  At pos :', pos, '→', JSON.stringify(snippet));
      }
      console.log('\n  Full statement:');
      console.log('  ' + stmt.replace(/\n/g, '\n  '));
      console.log('  ─────────────────────────────────────\n');
    }
  }
}

await pool.end();
