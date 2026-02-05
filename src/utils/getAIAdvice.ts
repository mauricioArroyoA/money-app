import type { Expense } from '../types'
import { CATEGORIES } from '../types'

export function getAIAdvice(expenses: Expense[]): string {
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
