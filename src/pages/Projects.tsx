import Badge from '@/components/Badge/Badge'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCommStatus, getPlantStatusLabel, getStatusTone, useMonitoring, type Project } from '@/services/monitoringData'
import styles from './Projects.module.css'

const PAGE_SIZE = 10
const alarmTypeOptions = ['critical', 'warning', 'info'] as const

const uniqueSorted = (values: string[]) => Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))

const Projects = () => {
  const navigate = useNavigate()
  const { projects } = useMonitoring()
  const [alarmType, setAlarmType] = useState('all')
  const [customer, setCustomer] = useState('all')
  const [country, setCountry] = useState('all')
  const [region, setRegion] = useState('all')
  const [projectStatus, setProjectStatus] = useState('all')
  const [family, setFamily] = useState('all')
  const [binding, setBinding] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const customers = useMemo(() => uniqueSorted(projects.map((project) => project.customer)), [projects])
  const countries = useMemo(() => uniqueSorted(projects.map((project) => project.country)), [projects])
  const regions = useMemo(() => uniqueSorted(projects.map((project) => project.region)), [projects])
  const families = useMemo(() => uniqueSorted(projects.map((project) => project.supplier)), [projects])

  const visibleProjects = useMemo(() => projects.filter((project) => {
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || project.name.toLowerCase().includes(query) || project.id.toLowerCase().includes(query)
    const matchesAlarmType = alarmType === 'all' || (
      alarmType === 'critical' ? project.criticalAlarms > 0 || project.status === 'critical'
        : alarmType === 'warning' ? project.status === 'warning' || project.activeAlarms > 0
        : project.activeAlarms > 0
    )
    const matchesCustomer = customer === 'all' || project.customer === customer
    const matchesCountry = country === 'all' || project.country === country
    const matchesRegion = region === 'all' || project.region === region
    const matchesProjectStatus = projectStatus === 'all' || project.status === projectStatus
    const matchesFamily = family === 'all' || project.supplier === family
    const matchesBinding = binding === 'all' || (binding === 'below' ? project.blindingPercent < 50 : project.blindingPercent >= 50)
    return matchesSearch && matchesAlarmType && matchesCustomer && matchesCountry && matchesRegion && matchesProjectStatus && matchesFamily && matchesBinding
  }), [projects, search, alarmType, customer, country, region, projectStatus, family, binding])

  const totalPages = Math.max(1, Math.ceil(visibleProjects.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = visibleProjects.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const updateFilter = (setter: (value: string) => void) => (event: React.ChangeEvent<HTMLSelectElement>) => {
    setter(event.target.value)
    setPage(1)
  }

  const openProject = (project: Project) => navigate(`/project-details/${project.id}`)

  return (
    <div className={styles.projects}>
      <div className={styles.header}>
        <div>
          <h1>Projects</h1>
          <p>{projects.length} Total • {projects.filter((project) => project.status === 'healthy').length} Online</p>
        </div>
      </div>

      <div className={styles.filters}>
        <label><span>Alarm Type</span><select value={alarmType} onChange={updateFilter(setAlarmType)}><option value="all">All</option>{alarmTypeOptions.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        <label><span>Customer</span><select value={customer} onChange={updateFilter(setCustomer)}><option value="all">All</option>{customers.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        <label><span>Country</span><select value={country} onChange={updateFilter(setCountry)}><option value="all">All</option>{countries.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        <label><span>Region</span><select value={region} onChange={updateFilter(setRegion)}><option value="all">All</option>{regions.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        <label><span>Project Status</span><select value={projectStatus} onChange={updateFilter(setProjectStatus)}><option value="all">All</option><option value="healthy">{getPlantStatusLabel('healthy')}</option><option value="warning">{getPlantStatusLabel('warning')}</option><option value="critical">{getPlantStatusLabel('critical')}</option><option value="offline">{getPlantStatusLabel('offline')}</option></select></label>
        <label><span>Supplier</span><select value={family} onChange={updateFilter(setFamily)}><option value="all">All</option>{families.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        <label><span>Binding</span><select value={binding} onChange={updateFilter(setBinding)}><option value="all">All</option><option value="below">Below 50%</option><option value="above">50% and above</option></select></label>
        <label><span>Project Name / ID</span><input type="search" aria-label="Search by project name or ID" placeholder="Search..." value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} /></label>
      </div>

      <h2 className={styles.sectionTitle}>Information about the plants</h2>

      <div className={styles.tableWrap}>
        <div className={styles.tableToolbar}>
          <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
        </div>
        <table>
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Project Name</th>
              <th>Tracker Family</th>
              <th>Customer Name</th>
              <th>Country</th>
              <th>Region</th>
              <th>Gateway</th>
              <th>Tracker</th>
              <th>Repeater</th>
              <th>Weather Stations</th>
              <th>Power (MWdc)</th>
              <th>Binding %</th>
              <th>Project Status</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((project) => (
              <tr key={project.id} onClick={() => openProject(project)}>
                <td><span className={`${styles.alarmDot} ${project.activeAlarms > 3 ? styles.alarmHigh : ''}`} title={`${project.activeAlarms} active alarms`} /><button className={styles.projectLink} type="button" onClick={(event) => { event.stopPropagation(); openProject(project) }}>{project.id}</button></td>
                <td><button className={styles.projectLink} type="button" onClick={(event) => { event.stopPropagation(); openProject(project) }}><strong>{project.name}</strong></button></td>
                <td>{project.supplier}</td>
                <td>{project.customer}</td>
                <td>{project.country}</td>
                <td>{project.region}</td>
                <td>{project.concentrators}</td>
                <td>{project.devicesTotal}<div className={styles.alarmTags}>{project.activeAlarms > 0 && <span title="Active device alarms">{project.activeAlarms} active</span>}{project.criticalAlarms > 0 && <span className={styles.criticalTag} title="Critical alarms">{project.criticalAlarms} critical</span>}</div></td>
                <td>{project.meteoStations}</td>
                <td>{project.powerMWdc}</td>
                <td>{project.blindingPercent}%</td>
                <td><Badge variant={getStatusTone(project.status)}>{project.status === 'healthy' ? 'In Operation' : project.status === 'warning' ? 'Issues Detected' : getPlantStatusLabel(project.status)}</Badge></td>
              </tr>
            ))}
            {pageRows.length === 0 && <tr><td colSpan={12} className={styles.empty}>No projects match the current filters.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const Pagination = ({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) => (
  <div className={styles.pagination}>
    <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>‹ Previous</button>
    {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
      <button key={number} type="button" className={number === page ? styles.pageActive : ''} onClick={() => onChange(number)}>{number}</button>
    ))}
    <button type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next ›</button>
  </div>
)

export default Projects

