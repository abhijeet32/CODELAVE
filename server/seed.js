const { PrismaClient } = require('./src/generated/prisma');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function seed() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('Checking and seeding templates...');
  
  const pythonTemplate = await prisma.template.upsert({
    where: { name: 'python3' },
    update: {},
    create: {
      name: 'python3',
      dockerImage: 'python:3.11-slim',
      hasInternet: true,
      description: 'Python 3.11 Environment',
    },
  });
  console.log('✓ Python template:', pythonTemplate.name);

  const nodeTemplate = await prisma.template.upsert({
    where: { name: 'node' },
    update: {},
    create: {
      name: 'node',
      dockerImage: 'node:20-slim',
      hasInternet: true,
      description: 'Node.js 20 Environment',
    },
  });
  console.log('✓ Node template:', nodeTemplate.name);

  await prisma.$disconnect();
  await pool.end();
  console.log('Seeding completed successfully!');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
