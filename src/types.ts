export type ExpenseCategory = 'Food' | 'Entertainment' | 'Transportation'

export interface Expense {
  id: string
  amount: number
  category: ExpenseCategory
  description: string
  date: string
}

export const CATEGORIES: ExpenseCategory[] = ['Food', 'Entertainment', 'Transportation']
