import Badge from '@/components/Badge/Badge'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStatusTone, useMonitoring } from '@/services/monitoringData'
import styles from './Projects.module.css'

const Projects = () => {
  const navigate = useNavigate()
  const { projects } = useMonitoring()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const visibleProjects = useMemo(() => projects.filter((project) => {
    const matchesSearch = `${project.name} ${project.location}`.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = status === 'all' || (status === 'online' ? project.status === 'healthy' : project.status === status)
    return matchesSearch && matchesStatus
  }), [projects, search, status])

  return (
    <div className={styles.projects}>
      <div className={styles.header}>
        <div>
          <h1>Project Details</h1>
          <p>{projects.length} Total • {projects.filter((project) => project.status === 'healthy').length} Online</p>
        </div>
      </div>

      <div className={styles.filters}>
        <input type="search" aria-label="Search projects" placeholder="Search projects..." value={search} onChange={(event) => setSearch(event.target.value)} />
        <select aria-label="Filter project status" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All Status</option>
          <option value="online">Online</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      <div className={styles.tableWrap}>
        <table>
          <thead><tr><th>Project</th><th>Location</th><th>Availability</th><th>Devices</th><th>Alarms</th><th>Status</th><th /></tr></thead>
          <tbody>{visibleProjects.map((project) => <tr key={project.id} onClick={() => navigate(`/project-details/${project.id}`)}>
            <td><strong>{project.name}</strong></td><td>{project.location}</td><td>{project.availability}%</td><td>{project.devicesTotal} · {project.devicesOnline}/{project.devicesTotal - project.devicesOnline}</td><td>{project.activeAlarms}</td><td><Badge variant={getStatusTone(project.status)}>{project.status === 'healthy' ? 'online' : project.status}</Badge></td><td><button type="button" onClick={(event) => { event.stopPropagation(); navigate(`/project-details/${project.id}`) }}>Details →</button></td>
          </tr>)}{visibleProjects.length === 0 && <tr><td colSpan={7} className={styles.empty}>No projects match the current filters.</td></tr>}</tbody>
        </table>
      </div>
    </div>
  )
}

export default Projects
