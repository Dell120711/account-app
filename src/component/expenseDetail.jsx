import { useState } from 'react';

const DetailElement = ({e, editingId, setEditingId, setExpenses}) => {
    const [editDescription, setEditDescription] = useState('');
    const [editAmount, setEditAmount] = useState('');
    const [editCategory, setEditCategory] = useState('');


    const startEdit = (expense) => {
        setEditingId(expense.id);
        setEditDescription(expense.description);
        setEditAmount(expense.amount.toString());
        setEditCategory(expense.category);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditDescription('');
        setEditAmount('');
        setEditCategory('');
    };

    const saveEdit = async () => {
        if (!editDescription || !editAmount || !editCategory || parseFloat(editAmount) <= 0) {
            alert('請輸入完整且正確的資料（描述、正整數金額、分類）');
            return;
        }
        try {
            const res = await fetch('/api/expenses', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingId,
                    description: editDescription,
                    amount: parseFloat(editAmount),
                    category: editCategory,
                }),
            });
            if (res.ok) {
                const updated = await res.json();
                setExpenses(prev => prev.map(e => (e.id === updated.id ? updated : e)));
                cancelEdit();
            } else {
                alert('更新失敗');
            }
        } catch {
            alert('更新失敗');
        }
    };

    const deleteExpense = async (id) => {
        if (!confirm('確定要刪除此筆支出嗎？')) return;
        try {
            const res = await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setExpenses(prev => prev.filter(e => e.id !== id));
            } else {
                alert('刪除失敗');
            }
        } catch {
            alert('刪除失敗');
        }
    };

    return (
        <li
            key={e.id}
            className="flex justify-between border-b border-gray-200 py-1 last:border-none hover:bg-gray-50 transition text-black"
        >
            {editingId === e.id ? (
                <>
                    <input
                        type="text"
                        value={editDescription}
                        onChange={e => setEditDescription(e.target.value)}
                        className="w-40 px-2 py-1 border border-gray-300 rounded"
                    />
                    <input
                        type="number"
                        value={editAmount}
                        onChange={e => setEditAmount(e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded mx-2"
                    />
                    <select
                        value={editCategory}
                        onChange={e => setEditCategory(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded"
                    >
                        <option value="餐飲">餐飲</option>
                        <option value="交通">交通</option>
                        <option value="娛樂">娛樂</option>
                        <option value="購物">購物</option>
                        <option value="其他">其他</option>
                    </select>
                    <button
                        onClick={saveEdit}
                        className="ml-2 text-green-600 hover:underline"
                        title="儲存"
                    >
                        💾
                    </button>
                    <button
                        onClick={cancelEdit}
                        className="ml-2 text-red-600 hover:underline"
                        title="取消"
                    >
                        ❌
                    </button>
                </>
            ) : (
                <>
                    <div>
                        <span className="font-medium">{e.description}</span>{' '}
                        <small className="italic text-gray-500">{e.category}</small>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="font-semibold">${e.amount.toFixed(2)}</div>
                        <button
                            onClick={() => startEdit(e)}
                            className="text-blue-600 hover:underline"
                            title="編輯"
                        >
                            ✏️
                        </button>
                        <button
                            onClick={() => deleteExpense(e.id)}
                            className="text-red-600 hover:underline"
                            title="刪除"
                        >
                            🗑️
                        </button>
                    </div>
                </>
            )}
        </li>
    )
}

const ExpensesDetail = ({ setExpenses, filterMonth, expenses }) => {
    const [editingId, setEditingId] = useState(null);
    
    const filteredExpenses = filterMonth
        ? expenses.filter(e => e.created_at.slice(0, 7) === filterMonth)
        : expenses;
    const expensesByMonth = filteredExpenses.reduce((acc, cur) => {
        const date = new Date(cur.created_at);
        const month = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
        if (!acc[month]) acc[month] = [];
        acc[month].push(cur);
        return acc;
    }, {});
    const expensesByMonthArray = Object.entries(expensesByMonth).sort((a, b) => a[0].localeCompare(b[0]));

    return (
        <>
            <h2 className="text-xl font-bold mt-10 mb-4 text-center text-gray-800">
                {filterMonth ? `${filterMonth} 月支出明細` : '所有月份支出明細'}
            </h2>
            {expensesByMonthArray.length === 0 ? (
                <p className="text-center text-gray-500">目前沒有支出紀錄</p>
            ) : (
                expensesByMonthArray.map(([month, exps]) => (
                    <div key={month} className="mb-6 border border-gray-300 rounded-md p-4">
                        <h3 className="text-lg font-semibold mb-2 text-black">{month}</h3>
                        <ul>
                            {exps.map(e => (
                                <DetailElement 
                                    e={e} 
                                    setExpenses={setExpenses}
                                    editingId={editingId}
                                    setEditingId={setEditingId}
                                ></DetailElement>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </>
    )
}

export default ExpensesDetail