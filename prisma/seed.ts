import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('⏳ Seeding database with full mock data...');

  // 1.hasing password
  const hashedAdminPassword = await bcrypt.hash('admin123', 12);
  const hashedLandlordPassword = await bcrypt.hash('landlord123', 12);
  const hashedTenantPassword = await bcrypt.hash('tenant123', 12);

  // 2. seed admin
  console.log('🌱 Seeding Admin...');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rentnest.com' },
    update: {},
    create: {
      email: 'admin@rentnest.com',
      name: 'Platform Admin',
      password: hashedAdminPassword,
      role: 'ADMIN',
      isBanned: false,
    },
  });

  // 3. seed landlord
  console.log('🌱 Seeding Landlord...');
  const landlord = await prisma.user.upsert({
    where: { email: 'landlord@rentnest.com' },
    update: {},
    create: {
      email: 'landlord@rentnest.com',
      name: 'John Landlord',
      password: hashedLandlordPassword,
      role: 'LANDLORD',
      isBanned: false,
    },
  });

  // 4. seed tenant
  console.log('🌱 Seeding Tenant...');
  const tenant = await prisma.user.upsert({
    where: { email: 'tenant@rentnest.com' },
    update: {},
    create: {
      email: 'tenant@rentnest.com',
      name: 'Sarah Tenant',
      password: hashedTenantPassword,
      role: 'TENANT',
      isBanned: false,
    },
  });

  
  // 5. seed categories
  console.log('🌱 Seeding Categories...');
  const catApartment = await prisma.category.upsert({
    where: { name: 'Apartment' },
    update: {},
    create: { name: 'Apartment', description: 'Modern self-contained residential units' },
  });

  const catHouse = await prisma.category.upsert({
    where: { name: 'House' },
    update: {},
    create: { name: 'House', description: 'Independent single or multi-family homes' },
  });

  const catStudio = await prisma.category.upsert({
    where: { name: 'Studio' },
    update: {},
    create: { name: 'Studio', description: 'Cozy single-room living spaces' },
  });

  const catDuplex = await prisma.category.upsert({
    where: { name: 'Duplex' },
    update: {},
    create: { name: 'Duplex', description: 'Spacious two-story residential units' },
  });

  // 6. seed properties
  console.log('🌱 Seeding Properties...');
  const propertyCount = await prisma.property.count();
  if (propertyCount === 0) {
    await prisma.property.createMany({
      data: [
        {
          title: 'Luxury 3BHK Apartment in Gulshan',
          description: 'Spacious 3 bedroom apartment with modern interior, balcony and lake view.',
          location: 'Gulshan, Dhaka',
          price: 45000,
          status: 'AVAILABLE',
          images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'],
          amenities: ['WiFi', 'Parking', 'Elevator', 'Security', 'Generator'],
          categoryId: catApartment.id,
          landlordId: landlord.id,
        },
        {
          title: 'Cozy Studio near Banani',
          description: 'Beautifully furnished studio apartment perfect for students or bachelors.',
          location: 'Banani, Dhaka',
          price: 18000,
          status: 'AVAILABLE',
          images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'],
          amenities: ['WiFi', 'AC', 'Security'],
          categoryId: catStudio.id,
          landlordId: landlord.id,
        },
        {
          title: 'Spacious Duplex in Uttara',
          description: 'A grand duplex house featuring 4 bedrooms, 5 bathrooms, and a private lawn.',
          location: 'Uttara, Dhaka',
          price: 75000,
          status: 'AVAILABLE',
          images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'],
          amenities: ['WiFi', 'Parking', 'Garden', 'Security', 'AC', 'Generator'],
          categoryId: catDuplex.id,
          landlordId: landlord.id,
        }
      ]
    });
    console.log('✅ Sample properties seeded successfully.');
  } else {
    console.log('ℹ️ Properties already exist in database, skipping property seed.');
  }

  console.log('✅ Seeding completed successfully.');
  console.log('--------------------------------------------------');
  console.log('🔑 Admin Account    : admin@rentnest.com / admin123');
  console.log('🔑 Landlord Account : landlord@rentnest.com / landlord123');
  console.log('🔑 Tenant Account   : tenant@rentnest.com / tenant123');
  console.log('--------------------------------------------------');
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