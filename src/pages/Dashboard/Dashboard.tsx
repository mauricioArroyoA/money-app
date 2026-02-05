import { useState } from 'react'
import type { Expense, ExpenseCategory } from '../../types'
import { generateId } from '../../utils/generateId'
import { getAIAdvice } from '../../utils/getAIAdvice'
import { Header, AddExpenseForm, FinancialAdvisor, SpendingChart } from '../../components'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [amount, setAmount] = useState<string>('0.00')
  const [category, setCategory] = useState<ExpenseCategory>('Food')
  const [description, setDescription] = useState('')
  const [advice, setAdvice] = useState<string | null>(null)

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)

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
    <div className={styles.app}>
      <Header />

      <main className={styles.appMain}>
        <aside className={styles.leftPanel}>
          <AddExpenseForm
            amount={amount}
            category={category}
            description={description}
            onAmountChange={setAmount}
            onCategoryChange={setCategory}
            onDescriptionChange={setDescription}
            onSubmit={handleAddExpense}
          />
          <FinancialAdvisor
            totalSpent={totalSpent}
            advice={advice}
            onGetAdvice={handleGetAdvice}
          />
        </aside>

        <SpendingChart expenses={expenses} />
      </main>
    </div>
  )
}
