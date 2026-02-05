import styles from './FinancialAdvisor.module.css'

interface FinancialAdvisorProps {
  totalSpent: number
  advice: string | null
  onGetAdvice: () => void
}

export default function FinancialAdvisor({
  totalSpent,
  advice,
  onGetAdvice,
}: FinancialAdvisorProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>Financial Advisor</h2>
      <p className={styles.totalLabel}>Total Spending</p>
      <p className={styles.totalValue}>${totalSpent.toFixed(2)}</p>
      <button
        type="button"
        className={`${styles.btn} ${styles.btnPrimary}`}
        onClick={onGetAdvice}
      >
        Get AI Advice
      </button>
      {advice !== null && (
        <div className={styles.adviceBox}>
          <p>{advice}</p>
        </div>
      )}
    </section>
  )
}
