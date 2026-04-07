const { PrismaClient } = require('../src/lib/prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const sqlite = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const adapter = new PrismaBetterSqlite3({ 
  url: 'file:dev.db' 
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const phone = '+998975062020';
  const password = 'dilyor1234';
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { phone },
    update: { password: hashedPassword },
    create: {
      phone,
      password: hashedPassword,
    },
  });

  console.log('Admin user created/updated:', admin.phone);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
