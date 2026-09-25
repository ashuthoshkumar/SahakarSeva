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

  // Seed Initial Workers if empty
  const workerCount = await dbGet('SELECT COUNT(*) as count FROM workers');
  if (workerCount.count === 0) {
    const seedWorkers = [
      ['wrk_101', 'Ramesh Sharma', 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=250', 'electrician', 'soc_delhi_1', 'Delhi NCR Shramik Sahakari Samiti', 4.9, 142, 310, 8, 350, 28.6139, 77.2090, 'Level 3 Master Craftsman', 'Aadhaar Verified', 'Clear (Verified by Delhi Police)', 'AB-8829-1029-4411', 'DL/CPM/88219/101', 1, JSON.stringify(['MCB Wiring', 'Inverter Repair', 'Smart Switches', 'Industrial Solar Panels']), '+91 98765 43210'],
      ['wrk_102', 'Sunita Devi', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250', 'caregiver', 'soc_delhi_1', 'Delhi NCR Shramik Sahakari Samiti', 4.95, 98, 215, 6, 320, 28.6250, 77.2180, 'Level 2 Certified Nursing Assistant', 'Aadhaar Verified', 'Clear', 'AB-4410-9921-1029', 'DL/CPM/88219/102', 1, JSON.stringify(['Elderly Care', 'Blood Pressure & Sugar Monitor', 'Physiotherapy Assist', 'Post-Op Care']), '+91 98111 22334'],
      ['wrk_103', 'Vikram Singh', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250', 'plumber', 'soc_delhi_1', 'Delhi NCR Shramik Sahakari Samiti', 4.8, 110, 190, 7, 350, 28.6080, 77.2300, 'Level 2 Hydro Technician', 'Aadhaar Verified', 'Clear', 'AB-7711-3092-8812', 'DL/CPM/88219/103', 1, JSON.stringify(['High Pressure Leak Fix', 'CPVC Fitting', 'Geyser Installation', 'Motor Pump Overhaul']), '+91 97123 45678'],
      ['wrk_104', 'Mohammed Mansoor', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250', 'carpenter', 'soc_delhi_1', 'Delhi NCR Shramik Sahakari Samiti', 4.85, 76, 145, 9, 380, 28.6300, 77.2000, 'Level 3 Wood Craftsman', 'Aadhaar Verified', 'Clear', 'AB-5590-1120-7733', 'DL/CPM/88219/104', 1, JSON.stringify(['Modular Kitchen Repair', 'Custom Shelving', 'Door Frame Realignment', 'Furniture Polishing']), '+91 99887 76655'],
      ['wrk_105', 'Pooja Patil', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250', 'domestic_helper', 'soc_mh_1', 'Maharashtra Household & Skilled Workers Coop', 4.9, 160, 340, 5, 300, 19.0760, 72.8777, 'Level 2 Sanitation Specialist', 'Aadhaar Verified', 'Clear (Mumbai Police)', 'AB-3392-8819-0012', 'MH/BOM/55120/105', 1, JSON.stringify(['Nutritious Meal Prep', 'Utensil Washing Machine', 'Floor Sanitization', 'Laundry Care']), '+91 98222 33445'],
      ['wrk_106', 'Ganesh Shinde', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250', 'technician', 'soc_mh_1', 'Maharashtra Household & Skilled Workers Coop', 4.75, 88, 175, 6, 400, 19.0820, 72.8900, 'Level 2 HVAC & Electronics', 'Aadhaar Verified', 'Clear', 'AB-9921-4412-5501', 'MH/BOM/55120/106', 0, JSON.stringify(['Inverter AC Gas Refill', 'PCB Washing Machine Fix', 'Double Door Fridge Repair']), '+91 97654 32109']
    ];

    for (const w of seedWorkers) {
      await dbRun(`
        INSERT INTO workers (id, name, photo, category, societyId, societyName, rating, reviewsCount, jobsCompleted, experienceYears, hourlyRate, lat, lng, ncctLevel, kycStatus, policeVerification, ayushmanCard, pfAccountNumber, onDuty, skills, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, w);
    }
  }

  // Bookings are 100% clean and empty by default (0 transactions)
};
