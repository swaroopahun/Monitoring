import Card from '@/components/Card/Card'
import Badge from '@/components/Badge/Badge'
import Button from '@/components/Button/Button'
import styles from './Projects.module.css'

const Projects = () => {
  const projects = [
    { id: 1, name: 'Roadrunner Solar Project', devices: 523, status: 'online', health: 92 },
    { id: 2, name: 'Desert Storage Facility', devices: 1203, status: 'online', health: 88 },
    { id: 3, name: 'Urban Grid Integration', devices: 234, status: 'warning', health: 85 },
    { id: 4, name: 'Research Lab Battery Bank', devices: 89, status: 'online', health: 96 },
    { id: 5, name: 'Remote Island Systems', devices: 407, status: 'offline', health: 72 },
  ]

  return (
    <div className={styles.projects}>
      <div className={styles.header}>
        <div>
          <h1>Projects</h1>
          <p>Manage your energy storage projects</p>
        </div>
        <Button>+ New Project</Button>
      </div>

      <div className={styles.filters}>
        <input type="text" placeholder="Search projects..." />
        <select>
          <option>All Status</option>
          <option>Online</option>
          <option>Offline</option>
        </select>
      </div>

      <div className={styles.grid}>
        {projects.map((project) => (
          <Card key={project.id} variant="interactive">
            <div className={styles.projectCard}>
              <div className={styles.cardHeader}>
                <h3>{project.name}</h3>
                <Badge variant={project.status === 'online' ? 'success' : 'danger'}>
                  {project.status}
                </Badge>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.stat}>
                  <span>Devices</span>
                  <strong>{project.devices}</strong>
                </div>
                <div className={styles.stat}>
                  <span>Health Score</span>
                  <strong className={project.health >= 90 ? styles.healthGood : styles.healthWarn}>
                    {project.health}%
                  </strong>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <Button variant="secondary" size="sm">View Details</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Projects
