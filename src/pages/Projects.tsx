import Badge from '@/components/Badge/Badge'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCommStatus, getPlantStatusLabel, getStatusTone, useMonitoring, type Project } from '@/services/monitoringData'
import styles from './Projects.module.css'

const PAGE_SIZE = 10
const commStatusOptions = ['Strong', 'Stable', 'Weak', 'Lost'] as const

const uniqueSorted = (values: string[]) => Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))

const formatCommTimestamp = (isoDate: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(isoDate))

const Projects = () => {
  const navigate = useNavigate()
  const { projects } = useMonitoring()
  const [customer, setCustomer] = useState('all')
  const [country, setCountry] = useState('all')
  const [region, setRegion] = useState('all')
  const [plantStatus, setPlantStatus] = useState('all')
  const [commStatus, setCommStatus] = useState('all')
  const [supplier, setSupplier] = useState('all')
  const [blinding, setBlinding] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const customers = useMemo(() => uniqueSorted(projects.map((project) => project.customer)), [projects])
  const countries = useMemo(() => uniqueSorted(projects.map((project) => project.country)), [projects])
  const regions = useMemo(() => uniqueSorted(projects.map((project) => project.region)), [projects])
  const suppliers = useMemo(() => uniqueSorted(projects.map((project) => project.supplier)), [projects])
  const blindingOptions = useMemo(() => Array.from(new Set(projects.map((project) => project.blindingPercent))).sort((a, b) => b - a), [projects])

  const visibleProjects = useMemo(() => projects.filter((project) => {
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || project.name.toLowerCase().includes(query) || project.id.toLowerCase().includes(query)
    const matchesCustomer = customer === 'all' || project.customer === customer
    const matchesCountry = country === 'all' || project.country === country
    const matchesRegion = region === 'all' || project.region === region
    const matchesPlantStatus = plantStatus === 'all' || project.status === plantStatus
    const matchesCommStatus = commStatus === 'all' || getCommStatus(project.communicationHealth) === commStatus
    const matchesSupplier = supplier === 'all' || project.supplier === supplier
    const matchesBlinding = blinding === 'all' || String(project.blindingPercent) === blinding
    return matchesSearch && matchesCustomer && matchesCountry && matchesRegion && matchesPlantStatus && matchesCommStatus && matchesSupplier && matchesBlinding
  }), [projects, search, customer, country, region, plantStatus, commStatus, supplier, blinding])

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
          <h1>Project Details</h1>
          <p>{projects.length} Total • {projects.filter((project) => project.status === 'healthy').length} Online</p>
        </div>
      </div>

      <div className={styles.filters}>
        <label><span>Customer</span><select value={customer} onChange={updateFilter(setCustomer)}><option value="all">All</option>{customers.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        <label><span>Country</span><select value={country} onChange={updateFilter(setCountry)}><option value="all">All</option>{countries.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        <label><span>Region</span><select value={region} onChange={updateFilter(setRegion)}><option value="all">All</option>{regions.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        <label><span>Plant Status</span><select value={plantStatus} onChange={updateFilter(setPlantStatus)}><option value="all">All</option><option value="healthy">{getPlantStatusLabel('healthy')}</option><option value="warning">{getPlantStatusLabel('warning')}</option><option value="critical">{getPlantStatusLabel('critical')}</option><option value="offline">{getPlantStatusLabel('offline')}</option></select></label>
        <label><span>Comm Status</span><select value={commStatus} onChange={updateFilter(setCommStatus)}><option value="all">All</option>{commStatusOptions.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        <label><span>Supplier</span><select value={supplier} onChange={updateFilter(setSupplier)}><option value="all">All</option>{suppliers.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        <label><span>Blinding</span><select value={blinding} onChange={updateFilter(setBlinding)}><option value="all">All</option>{blindingOptions.map((value) => <option key={value} value={value}>{value}%</option>)}</select></label>
        <label><span>Plant Name / ID</span><input type="search" aria-label="Search by plant name or ID" placeholder="Search..." value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} /></label>
      </div>

      <h2 className={styles.sectionTitle}>Information about the plants</h2>

      <div className={styles.tableWrap}>
        <div className={styles.tableToolbar}>
          <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Plant Name</th>
              <th>Communication (UTC)</th>
              <th>Concent.</th>
              <th>Contr.</th>
              <th>Meteo</th>
              <th>Power (MWdc)</th>
              <th>Customer</th>
              <th>Country</th>
              <th>Region</th>
              <th>Blinding %</th>
              <th>Plant Status</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((project) => (
              <tr key={project.id} onClick={() => openProject(project)}>
                <td>{project.id}</td>
                <td><strong>{project.name}</strong></td>
                <td>{formatCommTimestamp(project.lastUpdated)}</td>
                <td>{project.concentrators}</td>
                <td>{project.controllers}</td>
                <td>{project.meteoStations}</td>
                <td>{project.powerMWdc}</td>
                <td>{project.customer}</td>
                <td>{project.country}</td>
                <td>{project.region}</td>
                <td>{project.blindingPercent}%</td>
                <td><Badge variant={getStatusTone(project.status)}>{getPlantStatusLabel(project.status)}</Badge></td>
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

