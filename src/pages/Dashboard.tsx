import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Card from '@/components/Card/Card'
import GlobalProjectsMap from '@/components/GlobalProjectsMap/GlobalProjectsMap'
import { formatLiveTimestamp, useMonitoring, type AlarmSeverity } from '@/services/monitoringData'
import styles from './Dashboard.module.css'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => ({
  month,
  total: 112000 + (index % 5) * 3800,
  communicating: 101500 + (index % 6) * 2700,
  alarms: 9200 + (index % 4) * 850,
}))

const totalMonitoredDevices = 120456

const Dashboard = () => {
  const navigate = useNavigate()
  const { alarms, projects, lastUpdated } = useMonitoring()
  const [customer, setCustomer] = useState('')
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('')
  const [projectStatus, setProjectStatus] = useState('')
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [alarmSearch, setAlarmSearch] = useState('')

  const stateData = useMemo(() => [
    { name: 'Auto Mode', value: 75, color: '#20c567' },
    { name: 'Manual Mode', value: 19, color: '#3e7ee8' },
    { name: 'E-stop Active', value: 6, color: '#ef5350' },
  ], [])

  const filteredProjects = projects.filter((project) =>
    (!customer || project.customer === customer)
    && (!country || project.country === country)
    && (!region || project.region === region)
    && (!projectStatus || project.status === projectStatus),
  )

  const customers = [...new Set(projects.map((project) => project.customer))].sort()
  const countries = [...new Set(projects.map((project) => project.country))].sort()
  const regions = [...new Set(projects.map((project) => project.region))].sort()
  const hovered = hoverIndex !== null ? stateData[hoverIndex] : null
  const hoveredCount = hovered ? Math.round((totalMonitoredDevices * hovered.value) / 100) : 0
  const severityRank: Record<AlarmSeverity, number> = { critical: 4, major: 3, warning: 2, info: 1 }
  const alarmRows = projects.map((project) => {
    const projectAlarms = alarms.filter((alarm) => alarm.projectId === project.id && alarm.status !== 'resolved')
    const highestSeverity = projectAlarms.reduce<AlarmSeverity>((highest, alarm) => (
      severityRank[alarm.severity] > severityRank[highest] ? alarm.severity : highest
    ), 'info')
    return { project, count: projectAlarms.length, highestSeverity }
  }).filter(({ project, count }) => {
    const query = alarmSearch.trim().toLowerCase()
    return count > 0 && (!query || project.id.toLowerCase().includes(query) || project.name.toLowerCase().includes(query))
  }).slice(0, 6)

  return (
    <div className={styles.dashboard}>
      <header className={styles.greeting}>
        <h1>Dashboard</h1>
        <div className={styles.demoStatus}><span>● Live demo</span><small>Sample data · Updated {formatLiveTimestamp(lastUpdated)}</small></div>
      </header>

      <section className={styles.topRow} aria-label="Dashboard overview">
        <Card className={styles.distribution}>
          <h2>Device State Distribution</h2>
          <div className={styles.donutRow}>
            <div className={styles.donutWrap}>
              <div className={styles.donutChart}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stateData}
                      dataKey="value"
                      innerRadius="55%"
                      outerRadius="82%"
                      onMouseEnter={(_entry, index) => setHoverIndex(index)}
                      onMouseLeave={() => setHoverIndex(null)}
                    >
                      {stateData.map((item) => <Cell key={item.name} fill={item.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className={styles.donutCenter}>
                <span className={styles.distPercent}>75%</span>
                <span className={styles.distSub}>Automatic</span>
              </div>
            </div>
            {hovered && (
              <div className={styles.hoverPanel}>
                <strong style={{ color: hovered.color }}>{hovered.name}</strong>
                <div className={styles.hoverPanelRow}><span>Count</span><b>{hoveredCount.toLocaleString()}</b></div>
              </div>
            )}
          </div>
          <footer className={styles.distributionLegend}>
            {stateData.map((item) => (
              <span key={item.name}><i style={{ background: item.color }} />{item.name}</span>
            ))}
          </footer>
        </Card>

        <section className={styles.mapPanel} aria-label="Global projects">
          <header className={styles.mapHeader}>
            <h2>Global Projects</h2>
            <div className={styles.filters}>
              <label>Customer
                <select aria-label="Filter projects by customer" value={customer} onChange={(event) => setCustomer(event.target.value)}>
                  <option value="">All</option>
                  {customers.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label>Country
                <select aria-label="Filter projects by country" value={country} onChange={(event) => setCountry(event.target.value)}>
                  <option value="">All</option>
                  {countries.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label>Region
                <select aria-label="Filter projects by region" value={region} onChange={(event) => setRegion(event.target.value)}>
                  <option value="">All</option>
                  {regions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label>Project Status
                <select aria-label="Filter projects by status" value={projectStatus} onChange={(event) => setProjectStatus(event.target.value)}>
                  <option value="">All</option>
                  <option value="healthy">Healthy</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                  <option value="offline">Offline</option>
                </select>
              </label>
            </div>
          </header>
          <GlobalProjectsMap
            projects={filteredProjects}
            onProjectSelect={(projectId) => navigate(`/project-details/${projectId}`)}
            height={248}
          />
        </section>
      </section>

      <section className={styles.bottomRow} aria-label="Connectivity history and active alarms">
        <Card className={styles.connectivity}>
          <h2>Device Connectivity History</h2>
          <div className={styles.connectivityChart}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={months} margin={{ top: 10, right: 12, left: 0, bottom: 4 }}>
                <CartesianGrid vertical={false} stroke="#e7edf3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#718294', fontSize: 11 }} />
                <YAxis
                  domain={[0, 130000]}
                  ticks={[0, 32500, 65000, 97500, 130000]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#718294', fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #dfe5eb', borderRadius: 5, color: '#34495a' }}
                  itemStyle={{ color: '#34495a' }}
                  labelStyle={{ color: '#17476a', fontWeight: 700 }}
                />
                <Legend verticalAlign="bottom" height={28} />
                <Bar dataKey="total" name="Total Devices" fill="#4b8ee9" radius={[2, 2, 0, 0]} />
                <Bar dataKey="communicating" name="Communicating" fill="#8bbcff" radius={[2, 2, 0, 0]} />
                <Bar dataKey="alarms" name="No. of Alarms" fill="#ffbf24" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className={styles.alarms}>
          <header className={styles.alarmHeader}>
            <h2>Active Alarms</h2>
            <input
              type="search"
              aria-label="Search project name or ID"
              placeholder="Search Project Name or ID"
              value={alarmSearch}
              onChange={(event) => setAlarmSearch(event.target.value)}
            />
            <button type="button" className={styles.viewAllLink} onClick={() => navigate('/alarms')}>View All →</button>
          </header>
          <div className={styles.alarmTableWrap}>
            <table className={styles.alarmTable}>
              <thead>
                <tr><th>Project ID</th><th>Project Name</th><th>Alarms</th><th>Highest Severity</th></tr>
              </thead>
              <tbody>
                {alarmRows.map(({ project, count, highestSeverity }) => (
                  <tr key={project.id}>
                    <td><button type="button" onClick={() => navigate(`/project-details/${project.id}`)}>{project.id}</button></td>
                    <td>{project.name}</td>
                    <td>{count}</td>
                    <td><span className={`${styles.severity} ${styles[highestSeverity]}`}>{highestSeverity}</span></td>
                  </tr>
                ))}
                {alarmRows.length === 0 && <tr><td className={styles.emptyAlarms} colSpan={4}>No active alarms found.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
      <footer className={styles.footer}>©2009-2026, Array Technologies, Inc. All Rights Reserved.</footer>
    </div>
  )
}

export default Dashboard