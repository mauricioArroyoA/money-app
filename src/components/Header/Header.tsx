import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Expense Tracker</h1>
      <p className={styles.subtitle}>
        Track your spending and get AI-powered financial advice.
      </p>
    </header>
  )
}
