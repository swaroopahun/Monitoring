import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatLiveTimestamp, useMonitoring, type AlarmSeverity } from '@/services/monitoringData'
import styles from './Alarms.module.css'

const severityFilters: { key: AlarmSeverity | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'critical', label: 'Critical' },
  { key: 'major', label: 'Major' },
  { key: 'warning', label: 'Warning' },
  { key: 'info', label: 'Info' },
]

const severityPillClass: Record<AlarmSeverity, string> = {
  critical: styles.pillCritical,
  major: styles.pillMajor,
  warning: styles.pillWarning,
  info: styles.pillInfo,
}

const pageSize = 10

const Alarms = () => {
  const navigate = useNavigate()
  const { alarms, projects } = useMonitoring()
  const [severity, setSeverity] = useState<AlarmSeverity | 'all'>('all')
  const [search, setSearch] = useState('')
  const [sortDesc, setSortDesc] = useState(true)
  const [page, setPage] = useState(1)

  const rows = useMemo(() => alarms.map((alarm) => {
    const project = projects.find((item) => item.id === alarm.projectId)
    return { ...alarm, projectName: project?.name ?? alarm.projectId, location: project?.location ?? '—' }
  }), [alarms, projects])

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filtered = rows.filter((row) => {
      const matchesSeverity = severity === 'all' || row.severity === severity
      const matchesSearch = !query
        || row.title.toLowerCase().includes(query)
        || row.deviceId.toLowerCase().includes(query)
        || row.projectName.toLowerCase().includes(query)
      return matchesSeverity && matchesSearch
    })
    return filtered.sort((a, b) => {
      const diff = new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
      return sortDesc ? -diff : diff
    })
  }, [rows, severity, search, sortDesc])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const updateSeverity = (value: AlarmSeverity | 'all') => {
    setSeverity(value)
    setPage(1)
  }

  const updateSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const openAlarm = (projectId: string) => navigate(`/project-details/${projectId}/alarms`)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <button type="button" className={styles.backLink} onClick={() => navigate('/')}>← Back to Dashboard</button>
          <h1>Active Alarms</h1>
          <p>{filteredRows.length} of {alarms.length} total alarms</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <input
          type="search"
          aria-label="Search alarms"
          placeholder="Search by alarm, device ID, or project..."
          value={search}
          onChange={(event) => updateSearch(event.target.value)}
        />
        <div className={styles.severityTabs}>
          {severityFilters.map((item) => (
            <button
              key={item.key}
              type="button"
              className={severity === item.key ? styles.active : ''}
              onClick={() => updateSeverity(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Severity</th>
              <th>Alarm / Description</th>
              <th>Device ID</th>
              <th>Project / Site</th>
              <th>Location</th>
              <th><button type="button" onClick={() => setSortDesc((value) => !value)}>Date {sortDesc ? '↓' : '↑'}</button></th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((alarm) => (
              <tr key={alarm.id} onClick={() => openAlarm(alarm.projectId)}>
                <td><span className={`${styles.severityPill} ${severityPillClass[alarm.severity]}`}><i />{alarm.severity}</span></td>
                <td><strong>{alarm.title}</strong></td>
                <td>{alarm.deviceId}</td>
                <td>{alarm.projectName}</td>
                <td>{alarm.location}</td>
                <td>{new Date(alarm.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td>{new Date(alarm.startedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</td>
                <td><span className={styles.statusText}>{alarm.status}</span></td>
              </tr>
            ))}
            {pageRows.length === 0 && <tr><td colSpan={8} className={styles.empty}>No alarms match these filters.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <span>Last refreshed {formatLiveTimestamp(new Date().toISOString())}</span>
        <div className={styles.pagination}>
          <button type="button" disabled={currentPage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>‹</button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              className={pageNumber === currentPage ? styles.active : ''}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          <button type="button" disabled={currentPage >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>›</button>
        </div>
      </div>
    </div>
  )
}

export default Alarms

