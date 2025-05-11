import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { timeStamp } from 'console';

interface Order {
  id: number
  petId: number
  status: 'placed' | 'accepted' | 'completed'
  shipDate?: string
  placed: {
    timestamp: string
  }
  accepted?: {
    timestamp: string
  }
  completed?: {
    timestamp: string
  }
}

interface OrderRow {
  id: number
  petId: number
  status: 'placed' | 'accepted' | 'completed'
  shipDate?: string
  placed: string
  accepted?: string
  completed?: string
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database(path.join(__dirname, 'data', 'petstore.db'));

export function insertOrder(order: Order) {
  db.run(`
    INSERT INTO orders (id, petId, status, shipDate, placed, accepted, completed)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      petId = excluded.petId,
      status = excluded.status,
      shipDate = excluded.shipDate,
      placed = excluded.placed,
      accepted = excluded.accepted,
      completed = excluded.completed;`,
    [order.id, order.petId, order.status, order.shipDate, order.placed.timestamp, order.accepted?.timestamp, order.completed?.timestamp]
  );
}

export function getOrders(callback: (err: Error | null, rows: Order[]) => void) {
  db.all<Event>('SELECT * FROM orders', (err: Error | null, rows: OrderRow[]) => {
    if (err) {
      callback(err, [])
    }else {
      const orders = rows.map(row => {
        return {
          id: row.id,
          petId: row.petId,
          status: row.status,
          shipDate: row.shipDate,
          placed: { timestamp: row.placed},
          accepted: row.accepted ? { timestamp: row.accepted } : undefined,
          completed: row.completed ? { timestamp: row.completed } : undefined
        }
      })
      callback(null, orders)
    }
  });
}