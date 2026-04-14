import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool }    from 'pg';
import { hash }    from 'bcryptjs';
import { eq }      from 'drizzle-orm';
import * as schema from './schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db   = drizzle(pool, { schema });

// ─── Admin credentials ────────────────────────────────────────────────────────
const ADMIN_EMAIL      = process.env.ADMIN_EMAIL      ?? 'admin@insens.com';
const ADMIN_PASSWORD   = process.env.ADMIN_PASSWORD   ?? 'AdminPass123!';
const ADMIN_FIRST_NAME = process.env.ADMIN_FIRST_NAME ?? 'Insens';
const ADMIN_LAST_NAME  = process.env.ADMIN_LAST_NAME  ?? 'Admin';

// ─── Role codes ───────────────────────────────────────────────────────────────
const ROLE_CODES = ['super_admin', 'admin', 'vendor_owner', 'vendor_staff', 'customer'] as const;

// ─── Root categories (level 1) ────────────────────────────────────────────────
const rootCategories = [
  { name: 'Floral',   slug: 'floral',   level: 1, path: 'floral'   },
  { name: 'Woody',    slug: 'woody',    level: 1, path: 'woody'    },
  { name: 'Oriental', slug: 'oriental', level: 1, path: 'oriental' },
  { name: 'Fresh',    slug: 'fresh',    level: 1, path: 'fresh'    },
  { name: 'Citrus',   slug: 'citrus',   level: 1, path: 'citrus'   },
  { name: 'Aquatic',  slug: 'aquatic',  level: 1, path: 'aquatic'  },
  { name: 'Gourmand', slug: 'gourmand', level: 1, path: 'gourmand' },
];

// ─── Sample brands ────────────────────────────────────────────────────────────
const sampleBrands = [
  { name: 'Chanel',     slug: 'chanel',     description: 'French luxury fashion house' },
  { name: 'Dior',       slug: 'dior',       description: 'French luxury goods company' },
  { name: "Yves Saint Laurent", slug: 'ysl', description: 'French luxury fashion brand' },
  { name: 'Versace',    slug: 'versace',    description: 'Italian luxury fashion company' },
  { name: 'Tom Ford',   slug: 'tom-ford',   description: 'American luxury fashion brand' },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Starting seed...\n');

  // ── 1. Roles ─────────────────────────────────────────────────────────────────
  console.log('🔐 Seeding roles...');
  for (const code of ROLE_CODES) {
    await db
      .insert(schema.roles)
      .values({ code })
      .onConflictDoNothing({ target: schema.roles.code });
  }
  console.log(`✅ Seeded ${ROLE_CODES.length} roles.\n`);

  // Fetch role ids by code
  const allRoles = await db.select().from(schema.roles);
  const roleMap  = Object.fromEntries(allRoles.map((r) => [r.code, r.id]));

  // ── 2. Admin user ────────────────────────────────────────────────────────────
  console.log('👤 Seeding admin user...');

  const passwordHash = await hash(ADMIN_PASSWORD, 12);

  const [admin] = await db
    .insert(schema.users)
    .values({
      email:           ADMIN_EMAIL,
      passwordHash,
      authProvider:    'local',
      status:          'active',
      isEmailVerified: true,
      isPhoneVerified: false,
    })
    .onConflictDoUpdate({
      target: schema.users.email,
      set: {
        passwordHash,
        status:          'active',
        isEmailVerified: true,
        updatedAt:       new Date(),
      },
    })
    .returning({ id: schema.users.id, email: schema.users.email });

  console.log(`✅ Admin user ready: ${admin.email} (${admin.id})\n`);

  // ── 3. Admin profile ─────────────────────────────────────────────────────────
  console.log('📝 Seeding admin profile...');
  await db
    .insert(schema.userProfiles)
    .values({
      userId:    admin.id,
      firstName: ADMIN_FIRST_NAME,
      lastName:  ADMIN_LAST_NAME,
      displayName: `${ADMIN_FIRST_NAME} ${ADMIN_LAST_NAME}`,
    })
    .onConflictDoUpdate({
      target: schema.userProfiles.userId,
      set: {
        firstName:   ADMIN_FIRST_NAME,
        lastName:    ADMIN_LAST_NAME,
        displayName: `${ADMIN_FIRST_NAME} ${ADMIN_LAST_NAME}`,
        updatedAt:   new Date(),
      },
    });
  console.log('✅ Admin profile ready.\n');

  // ── 4. Assign admin role ──────────────────────────────────────────────────────
  console.log('🎭 Assigning admin role...');
  const adminRoleId = roleMap['admin'];
  if (adminRoleId) {
    await db
      .insert(schema.userRoles)
      .values({ userId: admin.id, roleId: adminRoleId })
      .onConflictDoNothing();
    console.log('✅ Admin role assigned.\n');
  } else {
    console.warn('⚠️  Could not find admin role, skipping role assignment.\n');
  }

  // ── 5. Perfume categories ─────────────────────────────────────────────────────
  console.log('🏷️  Seeding categories...');
  for (const cat of rootCategories) {
    await db
      .insert(schema.categories)
      .values(cat)
      .onConflictDoNothing({ target: schema.categories.slug });
  }
  console.log(`✅ Seeded ${rootCategories.length} root categories.\n`);

  // ── 6. Sample brands ──────────────────────────────────────────────────────────
  console.log('🏭 Seeding brands...');
  for (const brand of sampleBrands) {
    await db
      .insert(schema.brands)
      .values(brand)
      .onConflictDoNothing({ target: schema.brands.slug });
  }
  console.log(`✅ Seeded ${sampleBrands.length} brands.\n`);

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
