import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'sahakar_seva.db');

const db = new sqlite3.Database(dbPath);

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

async function wipeDatabase() {
  console.log('--- Wiping All Bookings, Transactions & Test Users ---');

  // 1. Delete all bookings / transactions
  const resBookings = await dbRun('DELETE FROM bookings');
  console.log(`Deleted all bookings. Changes: ${resBookings.changes}`);

  // 2. Delete all customer and worker users
  const resUsers = await dbRun("DELETE FROM users WHERE role = 'customer' OR role = 'worker'");
  console.log(`Deleted customer and worker users. Changes: ${resUsers.changes}`);

  // 3. Delete any extra registered workers created during testing (preserve only seed worker templates 101-106)
  const resWorkers = await dbRun("DELETE FROM workers WHERE id NOT IN ('wrk_101', 'wrk_102', 'wrk_103', 'wrk_104', 'wrk_105', 'wrk_106')");
  console.log(`Cleaned registered workers. Changes: ${resWorkers.changes}`);

  // 4. Vacuum database to reclaim space and clean up journal
  await dbRun('VACUUM');
  console.log('Database vacuumed successfully.');

  // Check remaining counts
  const users = await dbAll('SELECT id, name, role, email FROM users');
  const bookings = await dbAll('SELECT * FROM bookings');
  const workers = await dbAll('SELECT id, name, category FROM workers');

  console.log('\n--- Status of Clean Database ---');
  console.log(`Remaining Users: ${users.length}`, users);
  console.log(`Remaining Bookings: ${bookings.length}`);
  console.log(`Remaining Verified Base Workers: ${workers.length}`);

  db.close();
  console.log('Database connection closed. Wipe completed successfully.');
}

wipeDatabase().catch((err) => {
  console.error('Failed to wipe database:', err);
  process.exit(1);
});
