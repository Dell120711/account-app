import Database from 'better-sqlite3';

const db = new Database('./mydb.sqlite');

db.prepare(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

export function getAllExpenses() {
  return db.prepare('SELECT * FROM expenses ORDER BY created_at DESC').all();
}

export function addExpense({ description, amount, category }) {
  const stmt = db.prepare(`
    INSERT INTO expenses (description, amount, category) 
    VALUES (?, ?, ?)
  `);
  const info = stmt.run(description, amount, category);

  // 取得剛剛插入的資料，包括 created_at
  const inserted = db.prepare('SELECT * FROM expenses WHERE id = ?').get(info.lastInsertRowid);

  return inserted;
}

export default db;
