import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


async function main() {
  console.log('🌱 Seeding database...');

  // ─── Roles ─────────────────────────────────────────────────────────────────
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user' },
  });

  console.log('✅ Roles seeded');

  // ─── Admin User ─────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Admin@123', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@bookstore.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@bookstore.com',
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  // ─── Regular User ───────────────────────────────────────────────────────────
  const userPassword = await bcrypt.hash('User@123', 12);

  await prisma.user.upsert({
    where: { email: 'user@bookstore.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'user@bookstore.com',
      password: userPassword,
      roleId: userRole.id,
    },
  });

  console.log('✅ Users seeded');

  // ─── Categories (3-level hierarchy) ─────────────────────────────────────────
  const fiction = await prisma.category.upsert({
    where: { id: 'cat-fiction-0000-0000-000000000001' },
    update: {},
    create: { id: 'cat-fiction-0000-0000-000000000001', name: 'Fiction' },
  });

  const romance = await prisma.category.upsert({
    where: { id: 'cat-romance-000-0000-000000000002' },
    update: {},
    create: { id: 'cat-romance-000-0000-000000000002', name: 'Romance', parentId: fiction.id },
  });

  const classic = await prisma.category.upsert({
    where: { id: 'cat-classic-000-0000-000000000003' },
    update: {},
    create: { id: 'cat-classic-000-0000-000000000003', name: 'Classic', parentId: romance.id },
  });

  const historical = await prisma.category.upsert({
    where: { id: 'cat-histori-000-0000-000000000004' },
    update: {},
    create: { id: 'cat-histori-000-0000-000000000004', name: 'Historical', parentId: romance.id },
  });

  const contemporary = await prisma.category.upsert({
    where: { id: 'cat-contemp-000-0000-000000000005' },
    update: {},
    create: { id: 'cat-contemp-000-0000-000000000005', name: 'Contemporary', parentId: romance.id },
  });

  const nonFiction = await prisma.category.upsert({
    where: { id: 'cat-nonfic-0000-0000-000000000006' },
    update: {},
    create: { id: 'cat-nonfic-0000-0000-000000000006', name: 'Non-Fiction' },
  });

  const selfHelp = await prisma.category.upsert({
    where: { id: 'cat-selfhel-000-0000-000000000007' },
    update: {},
    create: { id: 'cat-selfhel-000-0000-000000000007', name: 'Self Help', parentId: nonFiction.id },
  });

  const productivity = await prisma.category.upsert({
    where: { id: 'cat-product-000-0000-000000000008' },
    update: {},
    create: { id: 'cat-product-000-0000-000000000008', name: 'Productivity', parentId: selfHelp.id },
  });

  console.log('✅ Categories seeded');

  // ─── Sample Books (assigned to leaf categories only) ────────────────────────
  await prisma.book.upsert({
    where: { id: 'bk-prideprj-0000-0000-000000000001' },
    update: {},
    create: {
      id: 'bk-prideprj-0000-0000-000000000001',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      description: 'A romantic novel of manners set in rural England in the early 19th century.',
      coverImage: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
      categoryId: classic.id,
      createdBy: adminUser.id,
    },
  });

  await prisma.book.upsert({
    where: { id: 'bk-outlndrs-0000-0000-000000000002' },
    update: {},
    create: {
      id: 'bk-outlndrs-0000-0000-000000000002',
      title: 'Outlander',
      author: 'Diana Gabaldon',
      description: 'An epic tale of historical romance spanning 18th century Scotland.',
      coverImage: 'https://covers.openlibrary.org/b/id/8225261-L.jpg',
      categoryId: historical.id,
      createdBy: adminUser.id,
    },
  });

  await prisma.book.upsert({
    where: { id: 'bk-atomhab-00000-0000-000000000003' },
    update: {},
    create: {
      id: 'bk-atomhab-00000-0000-000000000003',
      title: 'Atomic Habits',
      author: 'James Clear',
      description: 'Tiny changes, remarkable results — a proven framework for building good habits.',
      coverImage: 'https://covers.openlibrary.org/b/id/10388699-L.jpg',
      categoryId: productivity.id,
      createdBy: adminUser.id,
    },
  });

  await prisma.book.upsert({
    where: { id: 'bk-mebefor-0000-0000-000000000004' },
    update: {},
    create: {
      id: 'bk-mebefor-0000-0000-000000000004',
      title: 'Me Before You',
      author: 'Jojo Moyes',
      description: 'A contemporary love story about choices, sacrifice, and living boldly.',
      coverImage: 'https://covers.openlibrary.org/b/id/7897210-L.jpg',
      categoryId: contemporary.id,
      createdBy: adminUser.id,
    },
  });

  console.log('✅ Books seeded');
  console.log('\n🎉 Seeding complete!');
  console.log('─────────────────────────────────');
  console.log('Admin → admin@bookstore.com / Admin@123');
  console.log('User  → user@bookstore.com  / User@123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
