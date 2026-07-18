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
  const fiction = await prisma.category.create({
    data: { name: 'Fiction' },
  });
  console.log(fiction);

  const romance = await prisma.category.create({
    data: { name: 'Romance', parentId: fiction.id },
  });
  console.log(romance);

  const classic = await prisma.category.create({
    data: { name: 'Classic', parentId: romance.id },
  });
  console.log(classic);

  const historical = await prisma.category.create({
    data: { name: 'Historical', parentId: romance.id },
  });
  console.log(historical);

  const contemporary = await prisma.category.create({
    data: { name: 'Contemporary', parentId: romance.id },
  });
  console.log(contemporary);

  const nonFiction = await prisma.category.create({
    data: { name: 'Non-Fiction' },
  });
  console.log(nonFiction);

  const selfHelp = await prisma.category.create({
    data: { name: 'Self Help', parentId: nonFiction.id },
  });
  console.log(selfHelp);

  const productivity = await prisma.category.create({
    data: { name: 'Productivity', parentId: selfHelp.id },
  });
  console.log(productivity);

  console.log('✅ Categories seeded');

  // ─── Sample Books (assigned to leaf categories only) ────────────────────────
  await prisma.book.create({
    data: {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      description: 'A romantic novel of manners set in rural England in the early 19th century.',
      coverImage: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
      categoryId: classic.id,
      createdBy: adminUser.id,
    },
  });

  await prisma.book.create({
    data: {
      title: 'Outlander',
      author: 'Diana Gabaldon',
      description: 'An epic tale of historical romance spanning 18th century Scotland.',
      coverImage: 'https://covers.openlibrary.org/b/id/8225261-L.jpg',
      categoryId: historical.id,
      createdBy: adminUser.id,
    },
  });

  await prisma.book.create({
    data: {
      title: 'Atomic Habits',
      author: 'James Clear',
      description: 'Tiny changes, remarkable results — a proven framework for building good habits.',
      coverImage: 'https://covers.openlibrary.org/b/id/10388699-L.jpg',
      categoryId: productivity.id,
      createdBy: adminUser.id,
    },
  });

  await prisma.book.create({
    data: {
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
