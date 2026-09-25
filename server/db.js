import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'sahakar_seva.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to persistent SQLite database at:', dbPath);
  }
});

// Helper wrapper for async database queries
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Database Schema Initialization & Seeding
export const initDB = async () => {
  // Users Authentication Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      aadhaarNo TEXT,
      societyId TEXT,
      kycVerified INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL
    );
  `);

  // Societies Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS societies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      registrationNo TEXT NOT NULL,
      federation TEXT NOT NULL,
      location TEXT NOT NULL,
      memberWorkers INTEGER DEFAULT 0,
      wageFloor REAL DEFAULT 350,
      welfareFundBalance TEXT DEFAULT '₹ 0',
      complianceScore INTEGER DEFAULT 100,
      status TEXT DEFAULT 'Verified NCCT Partner'
    );
  `);

  // Workers Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS workers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      photo TEXT,
      category TEXT NOT NULL,
      societyId TEXT NOT NULL,
      societyName TEXT NOT NULL,
      rating REAL DEFAULT 5.0,
      reviewsCount INTEGER DEFAULT 0,
      jobsCompleted INTEGER DEFAULT 0,
      experienceYears INTEGER DEFAULT 1,
      hourlyRate REAL NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      ncctLevel TEXT NOT NULL,
      kycStatus TEXT DEFAULT 'Pending Verification',
      policeVerification TEXT DEFAULT 'Clear',
      ayushmanCard TEXT,
      pfAccountNumber TEXT,
      onDuty INTEGER DEFAULT 1,
      skills TEXT NOT NULL,
      phone TEXT NOT NULL,
      FOREIGN KEY (societyId) REFERENCES societies(id)
    );
  `);

  // Bookings Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      workerId TEXT NOT NULL,
      workerName TEXT NOT NULL,
      workerPhone TEXT NOT NULL,
      category TEXT NOT NULL,
      customerName TEXT NOT NULL,
      customerPhone TEXT NOT NULL,
      address TEXT NOT NULL,
      scheduledTime TEXT NOT NULL,
      status TEXT DEFAULT 'Pending Payment',
      isEmergency INTEGER DEFAULT 0,
      baseWage REAL NOT NULL,
      welfareContribution REAL NOT NULL,
      healthInsurance REAL NOT NULL,
      platformFee REAL NOT NULL,
      totalAmount REAL NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (workerId) REFERENCES workers(id)
    );
  `);

  // Seed Admin Users if empty (no fake customers or workers)
  const userCount = await dbGet('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    console.log('Seeding initial system administrator users into SQLite...');
    await dbRun(`
      INSERT INTO users (id, name, phone, email, password, role, aadhaarNo, societyId, kycVerified, createdAt)
      VALUES 
      ('usr_soc_1', 'Delhi Coop Admin', '+91 98000 11122', 'society@sahakar.in', 'admin123', 'society_admin', NULL, 'soc_delhi_1', 1, '2026-08-01 10:00'),
      ('usr_fed_1', 'Northern Federation Officer', '+91 98000 33344', 'federation@sahakar.in', 'admin123', 'federation_admin', NULL, NULL, 1, '2026-08-01 10:00'),
      ('usr_sup_1', 'NCCT National Director', '+91 98000 55566', 'superadmin@sahakar.in', 'admin123', 'super_admin', NULL, NULL, 1, '2026-08-01 10:00')
    `);
  }

  // Seed Initial Societies if empty
  const societyCount = await dbGet('SELECT COUNT(*) as count FROM societies');
  if (societyCount.count === 0) {
    await dbRun(`
      INSERT INTO societies (id, name, registrationNo, federation, location, memberWorkers, wageFloor, welfareFundBalance, complianceScore, status)
      VALUES 
      ('soc_delhi_1', 'Delhi NCR Shramik Sahakari Samiti Ltd.', 'MSCS/CR/2018/842', 'Northern India Labour Cooperative Federation', 'New Delhi', 420, 350, '₹ 18,45,000', 98, 'Verified NCCT Partner'),
      ('soc_mh_1', 'Maharashtra Household & Skilled Workers Coop Society', 'MAH/BOM/COOP/9921', 'Western Zone Cooperative Federation', 'Mumbai / Thane', 680, 380, '₹ 32,10,000', 99, 'Verified NCCT Partner'),
      ('soc_ka_1', 'Karnataka Rural & Urban Labour Coop Union', 'KAR/BLR/2020/551', 'Southern Cooperative Guild', 'Bengaluru', 510, 360, '₹ 22,80,000', 96, 'Verified NCCT Partner')
    `);
  }

  // Workers table starts 100% clean and empty (0 workers until real workers register)
  // Bookings are 100% clean and empty by default (0 transactions)
};
