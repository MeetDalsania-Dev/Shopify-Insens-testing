import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool }    from 'pg';
import { hash }    from 'bcryptjs';
import * as schema from './schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db   = drizzle(pool, { schema });

// ─── Admin credentials ────────────────────────────────────────────────────────
// Override via environment variables in production:
//   ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_FIRST_NAME / ADMIN_LAST_NAME
const ADMIN_EMAIL      = process.env.ADMIN_EMAIL      ?? 'admin@insens.com';
const ADMIN_PASSWORD   = process.env.ADMIN_PASSWORD   ?? 'AdminPass123!';
const ADMIN_FIRST_NAME = process.env.ADMIN_FIRST_NAME ?? 'Insens';
const ADMIN_LAST_NAME  = process.env.ADMIN_LAST_NAME  ?? 'Admin';

// ─── Perfume categories ───────────────────────────────────────────────────────
const seedCategories = [
  { name: 'Floral',   slug: 'floral'   },
  { name: 'Woody',    slug: 'woody'    },
  { name: 'Oriental', slug: 'oriental' },
  { name: 'Fresh',    slug: 'fresh'    },
  { name: 'Citrus',   slug: 'citrus'   },
  { name: 'Aquatic',  slug: 'aquatic'  },
  { name: 'Gourmand', slug: 'gourmand' },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Starting seed...\n');

  // ── 1. Admin user ────────────────────────────────────────────────────────────
  console.log('👤 Seeding admin user...');

  const passwordHash = await hash(ADMIN_PASSWORD, 12);

  const [admin] = await db
    .insert(schema.users)
    .values({
      email:     ADMIN_EMAIL,
      password:  passwordHash,
      role:      'INSENS_ADMIN',
      firstName: ADMIN_FIRST_NAME,
      lastName:  ADMIN_LAST_NAME,
      isActive:  true,
    })
    .onConflictDoUpdate({
      target: schema.users.email,
      set: {
        // Re-hash and update password + names on re-seed, leave role untouched
        password:  passwordHash,
        firstName: ADMIN_FIRST_NAME,
        lastName:  ADMIN_LAST_NAME,
        isActive:  true,
        updatedAt: new Date(),
      },
    })
    .returning({
      id:        schema.users.id,
      email:     schema.users.email,
      role:      schema.users.role,
      firstName: schema.users.firstName,
      lastName:  schema.users.lastName,
    });

  console.log('✅ Admin user ready:');
  console.log(`   ID        : ${admin.id}`);
  console.log(`   Email     : ${admin.email}`);
  console.log(`   Name      : ${admin.firstName} ${admin.lastName}`);
  console.log(`   Role      : ${admin.role}`);
  console.log(`   Password  : ${ADMIN_PASSWORD}  ← change this in production!\n`);

  // ── 2. Perfume categories ─────────────────────────────────────────────────────
  console.log('🏷️  Seeding categories...');

  for (const cat of seedCategories) {
    await db
      .insert(schema.categories)
      .values(cat)
      .onConflictDoNothing({ target: schema.categories.slug });
  }

  console.log(`✅ Seeded ${seedCategories.length} categories.\n`);

  // ── Summary ───────────────────────────────────────────────────────────────────
  console.log('─────────────────────────────────────────');
  console.log('🚀 Seed complete! Login credentials:');
  console.log(`   Email    : ${ADMIN_EMAIL}`);
  console.log(`   Password : ${ADMIN_PASSWORD}`);
  console.log('─────────────────────────────────────────');

  await pool.end();
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
