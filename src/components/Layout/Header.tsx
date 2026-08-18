import styles from './Header.module.css'

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.kicker}>Monitoring Center</div>
          <h1 className={styles.title}>Operations Overview</h1>
        </div>

        <div className={styles.actions}>
          <button className={styles.notificationBtn} type="button" aria-label="Notifications">🔔</button>
          <button className={styles.settingsBtn} type="button" aria-label="Settings">⚙️</button>
        </div>
      </div>
    </header>
  )
}

export default Header
