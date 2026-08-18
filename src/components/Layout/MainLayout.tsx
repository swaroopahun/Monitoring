import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import styles from './MainLayout.module.css'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const sidebarWidth = isSidebarCollapsed ? 76 : 220

  return (
    <div className={`${styles.layoutShell} ${isSidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
      <Sidebar isCollapsed={isSidebarCollapsed} onCollapseChange={setIsSidebarCollapsed} />
      <div className={styles.contentShell} style={{ flexBasis: `calc(100% - ${sidebarWidth}px)`, marginLeft: sidebarWidth, width: `calc(100% - ${sidebarWidth}px)` }}>
        <Header />
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  )
}

export default MainLayout
