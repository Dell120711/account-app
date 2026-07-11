import { useState } from 'react';

const AddExpense = ({ setExpenses }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    

    const addExpense = async () => {
        if (!description || !amount || !category || parseFloat(amount) <= 0) {
            alert('請輸入完整且正確的資料（描述、正整數金額、分類）');
            return;
        }
        try {
            const res = await fetch('/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description, amount: parseFloat(amount), category }),
            });
            if (res.ok) {
                const newExp = await res.json();
                setExpenses(prev => [newExp, ...prev]);
                setDescription('');
                setAmount('');
                setCategory('');
            } else {
                const error = await res.json();
                alert(error.error || '新增失敗');
            }
        } catch {
            alert('新增失敗');
        }
    };

    return (
        <div className="flex gap-3 mb-4">
            <input
                type="text"
                placeholder="描述"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            <input
                type="number"
                placeholder="金額"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
                <option value="">選擇分類</option>
                <option value="餐飲">餐飲</option>
                <option value="交通">交通</option>
                <option value="娛樂">娛樂</option>
                <option value="購物">購物</option>
                <option value="其他">其他</option>
            </select>
            <button
                onClick={addExpense}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
                新增
            </button>
        </div>
    )
}

export default AddExpense