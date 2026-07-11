import db from '@/lib/db';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const expenses = db.prepare('SELECT * FROM expenses ORDER BY created_at DESC').all();
    res.status(200).json(expenses);

  } else if (req.method === 'POST') {
    const { description, amount, category } = req.body;
    if (!description || !amount || !category || amount <= 0) {
      return res.status(400).json({ error: '描述、金額（正數）和分類皆為必填' });
    }
    const stmt = db.prepare('INSERT INTO expenses (description, amount, category) VALUES (?, ?, ?)');
    const info = stmt.run(description, amount, category);
    const newExpense = db.prepare('SELECT * FROM expenses WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newExpense);

  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: '缺少 id' });
    const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
    const info = stmt.run(id);
    if (info.changes === 0) return res.status(404).json({ error: '找不到該筆支出' });
    res.status(200).json({ message: '刪除成功' });

  } else if (req.method === 'PUT') {
    const { id, description, amount, category } = req.body;
    if (!id || !description || !amount || !category || amount <= 0) {
      return res.status(400).json({ error: '請提供完整且正確的 id、描述、金額和分類' });
    }
    const stmt = db.prepare('UPDATE expenses SET description = ?, amount = ?, category = ? WHERE id = ?');
    const info = stmt.run(description, amount, category, id);
    if (info.changes === 0) return res.status(404).json({ error: '找不到該筆支出' });
    const updatedExpense = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
    res.status(200).json(updatedExpense);

  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}