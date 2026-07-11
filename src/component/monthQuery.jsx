const MonthQuery = ({ expenses, filterMonth, setFilterMonth }) => {

    const availableMonths = Array.from(
        new Set(expenses.map(e => e.created_at.slice(0, 7)))
    ).sort((a, b) => a.localeCompare(b));

    return (
        <div className="mb-4 flex items-center justify-center gap-3">
            <label htmlFor="filterMonth" className="font-medium text-gray-700">查詢月份：</label>
            <select
                id="filterMonth"
                value={filterMonth}
                onChange={e => setFilterMonth(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
                <option value="">全部月份</option>
                {availableMonths.map(month => (
                    <option key={month} value={month}>
                        {month}
                    </option>
                ))}
            </select>
            {filterMonth && (
                <button
                    onClick={() => setFilterMonth('')}
                    className="text-sm text-red-500 hover:underline"
                    title="清除篩選"
                >
                    清除
                </button>
            )}
        </div>
    )
}

export default MonthQuery