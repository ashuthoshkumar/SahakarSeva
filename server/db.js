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
      customerLat REAL,
      customerLng REAL,
      workerLat REAL,
      workerLng REAL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (workerId) REFERENCES workers(id)
    );
  `);

  // Safe migrations for coordinates in case existing table was created earlier
  try {
    await dbRun('ALTER TABLE bookings ADD COLUMN customerLat REAL');
  } catch (e) {}
  try {
    await dbRun('ALTER TABLE bookings ADD COLUMN customerLng REAL');
  } catch (e) {}
  try {
    await dbRun('ALTER TABLE bookings ADD COLUMN workerLat REAL');
  } catch (e) {}
  try {
    await dbRun('ALTER TABLE bookings ADD COLUMN workerLng REAL');
  } catch (e) {}
  try {
    await dbRun('ALTER TABLE bookings ADD COLUMN completionPhoto TEXT');
  } catch (e) {}

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

  // Seed certified NCCT cooperative benchmark workers for trades without workers
  const existingCategories = await dbAll('SELECT DISTINCT LOWER(category) as cat FROM workers');
  const catSet = new Set(existingCategories.map(r => r.cat));

  const benchmarkWorkers = [
    {
      id: 'wrk_seed_elec',
      name: 'Rajesh Sharma',
      photo: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=250',
      category: 'electrician',
      societyId: 'soc_delhi_1',
      societyName: 'Delhi NCR Shramik Sahakari Samiti Ltd.',
      rating: 4.9,
      reviewsCount: 38,
      jobsCompleted: 142,
      experienceYears: 8,
      hourlyRate: 350,
      lat: 17.2150,
      lng: 78.6080,
      ncctLevel: 'Level 3 Master Craftsman',
      kycStatus: 'Aadhaar & NCCT Verified',
      policeVerification: 'Clear (Verified by Police)',
      ayushmanCard: 'AB-8821-3940-1120',
      pfAccountNumber: 'DL/CPM/09812',
      onDuty: 1,
      skills: 'Circuit Tripping, MCB Replacement, Switchboard Rewiring, Short Circuit Isolation',
      phone: '+91 98112 34567'
    },
    {
      id: 'wrk_seed_tech',
      name: 'Mohammed Arif',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
      category: 'technician',
      societyId: 'soc_delhi_1',
      societyName: 'Delhi NCR Shramik Sahakari Samiti Ltd.',
      rating: 4.9,
      reviewsCount: 45,
      jobsCompleted: 180,
      experienceYears: 7,
      hourlyRate: 450,
      lat: 17.2180,
      lng: 78.6010,
      ncctLevel: 'Level 3 Certified HVAC Specialist',
      kycStatus: 'Aadhaar & NCCT Verified',
      policeVerification: 'Clear (Verified by Police)',
      ayushmanCard: 'AB-4491-1029-4412',
      pfAccountNumber: 'DL/CPM/10928',
      onDuty: 1,
      skills: 'AC Gas Refill, Compressor Diagnostic, PCB Inverter Repair, Appliance Servicing',
      phone: '+91 98711 55678'
    },
    {
      id: 'wrk_seed_carp',
      name: 'Harpreet Singh',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      category: 'carpenter',
      societyId: 'soc_delhi_1',
      societyName: 'Delhi NCR Shramik Sahakari Samiti Ltd.',
      rating: 4.8,
      reviewsCount: 29,
      jobsCompleted: 98,
      experienceYears: 6,
      hourlyRate: 380,
      lat: 17.2110,
      lng: 78.6050,
      ncctLevel: 'Level 2 Certified Woodcraftsman',
      kycStatus: 'Aadhaar & NCCT Verified',
      policeVerification: 'Clear (Verified by Police)',
      ayushmanCard: 'AB-7762-9901-3321',
      pfAccountNumber: 'DL/CPM/08273',
      onDuty: 1,
      skills: 'Door Lock Replacement, Hinge Realignment, Modular Furniture Repair',
      phone: '+91 98223 44556'
    },
    {
      id: 'wrk_seed_clean',
      name: 'Sunita Devi',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
      category: 'cleaner',
      societyId: 'soc_delhi_1',
      societyName: 'Delhi NCR Shramik Sahakari Samiti Ltd.',
      rating: 4.9,
      reviewsCount: 52,
      jobsCompleted: 210,
      experienceYears: 5,
      hourlyRate: 300,
      lat: 17.2140,
      lng: 78.6020,
      ncctLevel: 'Level 2 Deep Sanitation Expert',
      kycStatus: 'Aadhaar & NCCT Verified',
      policeVerification: 'Clear (Verified by Police)',
      ayushmanCard: 'AB-3321-7789-5561',
      pfAccountNumber: 'DL/CPM/06519',
      onDuty: 1,
      skills: 'Post-Renovation Cleaning, Bathroom Deep Sanitization, Floor Buffing',
      phone: '+91 98334 55667'
    },
    {
      id: 'wrk_seed_paint',
      name: 'Santosh Yadav',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      category: 'painter',
      societyId: 'soc_delhi_1',
      societyName: 'Delhi NCR Shramik Sahakari Samiti Ltd.',
      rating: 4.8,
      reviewsCount: 31,
      jobsCompleted: 115,
      experienceYears: 7,
      hourlyRate: 350,
      lat: 17.2160,
      lng: 78.6090,
      ncctLevel: 'Level 2 Wall Texture Specialist',
      kycStatus: 'Aadhaar & NCCT Verified',
      policeVerification: 'Clear (Verified by Police)',
      ayushmanCard: 'AB-9981-2234-8871',
      pfAccountNumber: 'DL/CPM/07712',
      onDuty: 1,
      skills: 'Damp Proofing, Putty & Acrylic Emulsion, Water Seepage Seal',
      phone: '+91 98445 66778'
    }
  ];

  for (const bw of benchmarkWorkers) {
    if (!catSet.has(bw.category)) {
      await dbRun(`
        INSERT OR IGNORE INTO workers (
          id, name, photo, category, societyId, societyName, rating, reviewsCount,
          jobsCompleted, experienceYears, hourlyRate, lat, lng, ncctLevel,
          kycStatus, policeVerification, ayushmanCard, pfAccountNumber, onDuty, skills, phone
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        bw.id, bw.name, bw.photo, bw.category, bw.societyId, bw.societyName, bw.rating, bw.reviewsCount,
        bw.jobsCompleted, bw.experienceYears, bw.hourlyRate, bw.lat, bw.lng, bw.ncctLevel,
        bw.kycStatus, bw.policeVerification, bw.ayushmanCard, bw.pfAccountNumber, bw.onDuty, bw.skills, bw.phone
      ]);
    }
  }
};
