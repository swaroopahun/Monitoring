import { Link, useParams } from 'react-router-dom'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import Card from '@/components/Card/Card'
import Badge from '@/components/Badge/Badge'
import Button from '@/components/Button/Button'
import { formatLiveTimestamp, getStatusTone, useMonitoring } from '@/services/monitoringData'
import styles from './ProjectDetails.module.css'

const ProjectDetails = () => {
  const params = useParams()
  const { projects, devices, alarms, lastUpdated } = useMonitoring()

  const project = projects.find((item) => item.id === params.projectId) ?? projects[0]

  const projectDevices = devices.filter((device) => device.projectId === project.id)
  const projectAlarms = alarms.filter((alarm) => alarm.projectId === project.id)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <div className={styles.eyebrow}>LIVE • Last data received: {formatLiveTimestamp(project.lastUpdated)}</div>
          <h1>{project.name}</h1>
          <div className={styles.metaRow}>
            <span>{project.location}</span>
            <span>•</span>
            <span>{project.devicesOnline}/{project.devicesTotal} Devices Online</span>
            <span>•</span>
            <span>{project.communicationHealth}% Communication Health</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Badge variant={getStatusTone(project.status)}>{project.status}</Badge>
          <Button size="sm">View Site</Button>
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <Card><div className={styles.kpi}><span>Availability</span><strong>{project.availability}%</strong></div></Card>
        <Card><div className={styles.kpi}><span>Device Health</span><strong>94%</strong></div></Card>
        <Card><div className={styles.kpi}><span>Online Devices</span><strong>{project.devicesOnline}</strong></div></Card>
        <Card><div className={styles.kpi}><span>Offline Devices</span><strong>{project.devicesTotal - project.devicesOnline}</strong></div></Card>
        <Card><div className={styles.kpi}><span>Active Alarms</span><strong>{project.activeAlarms}</strong></div></Card>
        <Card><div className={styles.kpi}><span>Critical Alarms</span><strong>{project.criticalAlarms}</strong></div></Card>
        <Card><div className={styles.kpi}><span>Comm Quality</span><strong>{project.communicationHealth}%</strong></div></Card>
        <Card><div className={styles.kpi}><span>Last Updated</span><strong>{formatLiveTimestamp(lastUpdated)}</strong></div></Card>
      </div>

      <div className={styles.tabs}> 
        <button className={styles.tabActive} type="button">Overview</button>
        <button type="button">Devices</button>
        <button type="button">Battery</button>
        <button type="button">Alarms</button>
        <button type="button">Communication</button>
        <button type="button">Performance</button>
        <button type="button">Map</button>
        <button type="button">Activity</button>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainPanel}>
          <Card>
            <div className={styles.sectionHeader}>
              <h2>Operational Status</h2>
              <Button variant="secondary" size="sm">Refresh Now</Button>
            </div>
            <div className={styles.summaryGrid}>
              <div><span>System Health</span><strong>94.1%</strong></div>
              <div><span>Battery SOC</span><strong>81%</strong></div>
              <div><span>Temperature</span><strong>31°C</strong></div>
              <div><span>Response Time</span><strong>2.1s</strong></div>
            </div>
          </Card>

          <Card>
            <div className={styles.sectionHeader}>
              <h2>Project Site Map</h2>
            </div>
            <div className={styles.mapCanvas}>
              <MapContainer center={[project.lat, project.lng]} zoom={7} scrollWheelZoom={false} className={styles.mapContainer}>
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <CircleMarker
                  center={[project.lat, project.lng]}
                  radius={10}
                  pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.9 }}
                >
                  <Popup>
                    <strong>{project.name}</strong>
                    <div>{project.location}</div>
                  </Popup>
                </CircleMarker>
              </MapContainer>
            </div>
          </Card>

          <Card>
            <div className={styles.sectionHeader}>
              <h2>Recent Events</h2>
            </div>
            <ul className={styles.feed}>
              {projectAlarms.slice(0, 5).map((alarm) => (
                <li key={alarm.id}>
                  <span className={`${styles.feedDot} ${styles[alarm.severity]}`}></span>
                  <div>
                    <strong>{alarm.title}</strong>
                    <small>{alarm.deviceId} • {formatLiveTimestamp(alarm.startedAt)}</small>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className={styles.sidePanel}>
          <Card>
            <div className={styles.sectionHeader}>
              <h2>Device Summary</h2>
            </div>
            <ul className={styles.deviceList}>
              {projectDevices.slice(0, 5).map((device) => (
                <li key={device.id}>
                  <div>
                    <strong>{device.name}</strong>
                    <small>{device.type}</small>
                  </div>
                  <Badge variant={getStatusTone(device.status)}>{device.status}</Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <div className={styles.sectionHeader}>
              <h2>Alarm Feed</h2>
            </div>
            <div className={styles.alarmList}>
              {projectAlarms.map((alarm) => (
                <div key={alarm.id} className={styles.alarmItem}>
                  <div className={`${styles.alarmMarker} ${styles[alarm.severity]}`}></div>
                  <div>
                    <strong>{alarm.title}</strong>
                    <small>{alarm.deviceId}</small>
                  </div>
                  <Badge variant={getStatusTone(alarm.severity)}>{alarm.severity}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <div className={styles.sectionHeader}>
          <h2>Project Devices</h2>
          <Link to="/battery"><Button variant="tertiary" size="sm">Battery View</Button></Link>
        </div>

        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Device</th>
                <th>Type</th>
                <th>Status</th>
                <th>Temperature</th>
                <th>Voltage</th>
                <th>Current</th>
                <th>Last Comm</th>
              </tr>
            </thead>
            <tbody>
              {projectDevices.map((device) => (
                <tr key={device.id}>
                  <td>{device.name}</td>
                  <td>{device.type}</td>
                  <td><Badge variant={getStatusTone(device.status)}>{device.status}</Badge></td>
                  <td>{device.temperature}°C</td>
                  <td>{device.voltage}V</td>
                  <td>{device.current}A</td>
                  <td>{formatLiveTimestamp(device.lastCommunication)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default ProjectDetails
