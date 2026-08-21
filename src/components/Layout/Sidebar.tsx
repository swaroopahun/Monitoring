import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

const navItems = [
  { label: 'Dashboard', path: '/', icon: '▦' },
  { label: 'Project Details', path: '/projects', icon: '◫' },
  { label: 'Battery', path: '/battery', icon: '🔋' },
]

interface SidebarProps {
  isCollapsed: boolean
  onCollapseChange: (isCollapsed: boolean) => void
}

const Sidebar = ({ isCollapsed, onCollapseChange }: SidebarProps) => {

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`} style={{ width: isCollapsed ? 76 : 220 }}>
      <div className={styles.brand}>
        <div className={styles.brandText}>Array Monitoring</div>
        <button
          type="button"
          className={styles.collapseToggle}
          onClick={() => onCollapseChange(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '>' : '<'}
        </button>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            end={item.path === '/'}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.userCard}>
        <div className={styles.avatar}>OC</div>
        {!isCollapsed && (
          <div>
            <div className={styles.userName}>Operations</div>
            <div className={styles.userMeta}>Control Center</div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
