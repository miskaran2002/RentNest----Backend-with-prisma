import { prisma } from '../src/lib/prisma'; 
import bcrypt from 'bcryptjs';

async function main() {
  console.log('⏳ Seeding database...');

  
  const categories = [
    { name: 'Apartment' },
    { name: 'House' },
    { name: 'Studio' },
    { name: 'Duplex' },
  ];

  console.log('🌱 Seeding property categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }
  console.log('✅ Categories seeded.');

  
  const adminEmail = 'admin@rentnest.com';
  const hashedPassword = await bcrypt.hash('admin123', 12);

  console.log('🌱 Seeding admin user...');
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Platform Admin',
      password: hashedPassword,
      role: 'ADMIN',
      isBanned: false,
    },
  });

  console.log('✅ Admin user seeded.');
  console.log('-----------------------------------------');
  console.log(`🔑 Admin Email   : ${adminEmail}`);
  console.log(`🔑 Admin Password: admin123`);
  console.log('-----------------------------------------');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error while seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });