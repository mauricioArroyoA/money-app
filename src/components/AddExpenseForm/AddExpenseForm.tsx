import type { ExpenseCategory } from '../../types'
import { CATEGORIES } from '../../types'
import styles from './AddExpenseForm.module.css'

interface AddExpenseFormProps {
  amount: string
  category: ExpenseCategory
  description: string
  onAmountChange: (value: string) => void
  onCategoryChange: (value: ExpenseCategory) => void
  onDescriptionChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export default function AddExpenseForm({
  amount,
  category,
  description,
  onAmountChange,
  onCategoryChange,
  onDescriptionChange,
  onSubmit,
}: AddExpenseFormProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>Add Expense</h2>
      <form onSubmit={onSubmit} className={styles.expenseForm}>
        <label>
          Amount
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value || '0.00')}
            placeholder="$ 0.00"
          />
        </label>
        <label>
          Category
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value as ExpenseCategory)}
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
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Optional notes..."
          />
        </label>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
          Add Expense
        </button>
      </form>
    </section>
  )
}
