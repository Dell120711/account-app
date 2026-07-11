import MonthQuery from '@/component/monthQuery';
import AddExpense from '@/component/addExpense';
import ExpensesDetail from '@/component/expenseDetail'

import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7'];

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [filterMonth, setFilterMonth] = useState('');
  
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch('/api/expenses');
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      alert('讀取資料失敗');
    }
  };

  const filteredExpenses = filterMonth
    ? expenses.filter(e => e.created_at.slice(0, 7) === filterMonth)
    : expenses;

  const categoryTotals = filteredExpenses.reduce((acc, cur) => {
    acc[cur.category] = (acc[cur.category] || 0) + cur.amount;
    return acc;
  }, {});

  const pieData = Object.entries(categoryTotals).map(([key, value]) => ({
    name: key,
    value,
  }));

  const monthTotals = filteredExpenses.reduce((acc, cur) => {
    const date = new Date(cur.created_at);
    const month = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
    acc[month] = (acc[month] || 0) + cur.amount;
    return acc;
  }, {});

  const monthData = Object.entries(monthTotals).map(([key, value]) => ({
    name: key,
    value,
  })).sort((a,b) => a.name.localeCompare(b.name));

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">簡易記帳本</h1>

      {/* 月份篩選用下拉選單 */}
      <MonthQuery 
        expenses={expenses}
        filterMonth={filterMonth}
        setFilterMonth={setFilterMonth}
      ></MonthQuery>

      {/* 新增支出 */}
      <AddExpense 
        setExpenses={setExpenses}
      ></AddExpense>

      {/* 支出明細 */}
      <ExpensesDetail
        filterMonth={filterMonth}
        expenses={expenses}
        setExpenses={setExpenses}
      ></ExpensesDetail>

      {/* 分類支出圓餅圖 */}
      <h2 className="text-xl font-bold mt-10 mb-4 text-center text-gray-800">分類支出占比</h2>
      {pieData.length > 0 ? (
        <div className="flex justify-center">
          <PieChart width={350} height={250}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </div>
      ) : (
        <p className="text-center text-gray-500">還沒有分類資料喔</p>
      )}

      {/* 每月支出長條圖 */}
      {!filterMonth && (
        <>
          <h2 className="text-xl font-bold mt-10 mb-4 text-center text-gray-800">每月支出統計</h2>
          {monthData.length > 0 ? (
            <BarChart width={600} height={300} data={monthData} className="mx-auto">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          ) : (
            <p className="text-center text-gray-500">還沒有資料喔</p>
          )}
        </>
      )}
    </div>
  );
}
