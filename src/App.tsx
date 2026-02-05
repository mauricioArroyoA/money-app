import { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { Expense, ExpenseCategory } from './types'
import { CATEGORIES } from './types'
import './App.css'

function generateId(): string {
  return Math.random().toString(36).slice(2)
}

function getAIAdvice(expenses: Expense[]): string {
  if (expenses.length === 0) {
    return 'Add some expenses to get personalized financial advice.'
  }
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const byCategory = CATEGORIES.map((cat) => ({
    category: cat,
    total: expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter((x) => x.total > 0)
  const topCategory = byCategory.sort((a, b) => b.total - a.total)[0]
  const avg = total / expenses.length
  const tips: string[] = []
  if (topCategory) {
    const pct = Math.round((topCategory.total / total) * 100)
    tips.push(`You spend ${pct}% on ${topCategory.category}. Consider setting a budget for this category.`)
  }
  if (avg > 20) {
    tips.push(`Your average transaction is $${avg.toFixed(2)}. Look for smaller, recurring savings.`)
  }
  if (total > 50) {
    tips.push(`Total spending is $${total.toFixed(2)}. Try saving 20% of income when possible.`)
  }
  if (tips.length === 0) {
    tips.push('Your spending looks balanced. Keep tracking to spot trends over time.')
  }
  return tips.join(' ')
}

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [amount, setAmount] = useState<string>('0.00')
  const [category, setCategory] = useState<ExpenseCategory>('Food')
  const [description, setDescription] = useState('')
  const [advice, setAdvice] = useState<string | null>(null)

  const totalSpent = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  )
  const chartData = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      name: cat,
      amount: expenses
        .filter((e) => e.category === cat)
        .reduce((s, e) => s + e.amount, 0),
    }))
  }, [expenses])
  const maxBar = Math.max(...chartData.map((d) => d.amount), 1)
  const barColors = ['#1e3a5f', '#2d4a6f', '#3d5a7f']

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault()
    const value = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0
    if (value <= 0) return
    setExpenses((prev) => [
      ...prev,
      {
        id: generateId(),
        amount: value,
        category,
        description: description.trim(),
        date: new Date().toISOString().slice(0, 10),
      },
    ])
    setAmount('0.00')
    setDescription('')
    setAdvice(null)
  }

  const handleGetAdvice = () => {
    setAdvice(getAIAdvice(expenses))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Expense Tracker</h1>
        <p className="app-subtitle">
          Track your spending and get AI-powered financial advice.
        </p>
      </header>

      <main className="app-main">
        <aside className="left-panel">
          <section className="card add-expense-card">
            <h2 className="card-title">Add Expense</h2>
            <form onSubmit={handleAddExpense} className="expense-form">
              <label>
                Amount
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value || '0.00')}
                  placeholder="$ 0.00"
                />
              </label>
              <label>
                Category
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Description
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional notes..."
                />
              </label>
              <button type="submit" className="btn btn-primary">
                Add Expense
              </button>
            </form>
          </section>

          <section className="card advisor-card">
            <h2 className="card-title">Financial Advisor</h2>
            <p className="total-label">Total Spending</p>
            <p className="total-value">${totalSpent.toFixed(2)}</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleGetAdvice}
            >
              Get AI Advice
            </button>
            {advice !== null && (
              <div className="advice-box">
                <p>{advice}</p>
              </div>
            )}
          </section>
        </aside>

        <section className="right-panel card spending-card">
          <h2 className="card-title">Spending by Category</h2>
          <div className="stats-row">
            <div className="stat">
              <span className="stat-label">Total Spent</span>
              <span className="stat-value">${totalSpent.toFixed(2)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Transactions</span>
              <span className="stat-value">{expenses.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Average</span>
              <span className="stat-value">
                ${expenses.length ? (totalSpent / expenses.length).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={chartData}
                margin={{ top: 12, right: 12, left: 12, bottom: 12 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#374151', fontSize: 12 }}
                  axisLine={{ stroke: '#9ca3af' }}
                />
                <YAxis
                  tick={{ fill: '#374151', fontSize: 12 }}
                  axisLine={{ stroke: '#9ca3af' }}
                  tickFormatter={(v) => `$${v}`}
                  domain={[0, Math.ceil(maxBar * 1.2)]}
                />
                <Tooltip
                  formatter={(value: number | undefined) => [`$${(value ?? 0).toFixed(2)}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="amount" name="Spending by Category" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={barColors[i % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            <span className="legend-swatch" />
            <span>Spending by Category</span>
          </div>
        </section>
      </main>
    </div>
  )
}
