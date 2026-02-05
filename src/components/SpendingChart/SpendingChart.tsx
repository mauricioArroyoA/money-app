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
import { CATEGORIES } from '../../types'
import type { Expense } from '../../types'
import styles from './SpendingChart.module.css'

interface SpendingChartProps {
  expenses: Expense[]
}

const BAR_COLORS = ['#1e3a5f', '#2d4a6f', '#3d5a7f']

export default function SpendingChart({ expenses }: SpendingChartProps) {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const chartData = CATEGORIES.map((cat) => ({
    name: cat,
    amount: expenses
      .filter((e) => e.category === cat)
      .reduce((s, e) => s + e.amount, 0),
  }))
  const maxBar = Math.max(...chartData.map((d) => d.amount), 1)

  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>Spending by Category</h2>
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total Spent</span>
          <span className={styles.statValue}>${totalSpent.toFixed(2)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Transactions</span>
          <span className={styles.statValue}>{expenses.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Average</span>
          <span className={styles.statValue}>
            ${expenses.length ? (totalSpent / expenses.length).toFixed(2) : '0.00'}
          </span>
        </div>
      </div>
      <div className={styles.chartWrap}>
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
                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.chartLegend}>
        <span className={styles.legendSwatch} />
        <span>Spending by Category</span>
      </div>
    </section>
  )
}
