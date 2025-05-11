import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data', 'petstore.db');

// Ensure directory exists
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS orders`);

  db.run(`
    CREATE TABLE orders (
      id INTEGER PRIMARY KEY,
      petId INTEGER,
      status TEXT,
      shipDate TEXT NULL,
      placed TEXT,
      accepted TEXT NULL,
      completed TEXT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Database setup complete.');
    }
    db.close();
  });
});