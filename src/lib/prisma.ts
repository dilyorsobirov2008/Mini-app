import { PrismaClient } from './prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  const sqlite = require('better-sqlite3');
  const db = new sqlite('dev.db');
  const adapter = new PrismaBetterSqlite3(db);
  prisma = new PrismaClient({ adapter });
} else {
  // @ts-ignore
  if (!global.prisma) {
    const sqlite = require('better-sqlite3');
    const db = new sqlite('dev.db');
    const adapter = new PrismaBetterSqlite3(db);
    // @ts-ignore
    global.prisma = new PrismaClient({ adapter });
  }
  // @ts-ignore
  prisma = global.prisma;
}

export default prisma;
