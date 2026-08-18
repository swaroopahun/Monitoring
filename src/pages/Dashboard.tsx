import { useEffect, useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import Card from '@/components/Card/Card'
import Badge from '@/components/Badge/Badge'
import { formatLiveTimestamp, getStatusTone, useMonitoring } from '@/services/monitoringData'
import styles from './Dashboard.module.css'

const connectivityData = [
  { time: '00:00', healthy: 72, warning: 5, offline: 2 }, { time: '02:00', healthy: 76, warning: 4, offline: 2 },
  { time: '04:00', healthy: 73, warning: 5, offline: 3 }, { time: '06:00', healthy: 78, warning: 4, offline: 2 },
  { time: '08:00', healthy: 77, warning: 6, offline: 2 }, { time: '10:00', healthy: 79, warning: 4, offline: 2 },
  { time: '12:00', healthy: 80, warning: 3, offline: 2 }, { time: '14:00', healthy: 81, warning: 4, offline: 2 },
  { time: '16:00', healthy: 80, warning: 5, offline: 2 }, { time: '18:00', healthy: 78, warning: 5, offline: 2 },
  { time: '20:00', healthy: 79, warning: 4, offline: 3 }, { time: '22:00', healthy: 77, warning: 5, offline: 3 },
]

const irradianceData = [
  { time: '06:00', irradiance: 0, power: 0 }, { time: '08:00', irradiance: 330, power: 120 },
  { time: '10:00', irradiance: 680, power: 305 }, { time: '12:00', irradiance: 870, power: 415 },
  { time: '14:00', irradiance: 740, power: 370 }, { time: '16:00', irradiance: 410, power: 190 },
  { time: '18:00', irradiance: 45, power: 20 },
]

type BrazilSite = { name: string; position: [number, number]; state: 'online' | 'offline' }

const brazilSites: BrazilSite[] = [
  { name: 'Manaus Solar', position: [-3.12, -60.02], state: 'online' },
  { name: 'Fortaleza Solar', position: [-3.73, -38.52], state: 'online' },
  { name: 'Natal Solar', position: [-5.79, -35.21], state: 'online' },
  { name: 'Teresina Solar', position: [-5.09, -42.8], state: 'online' },
  { name: 'Recife Solar', position: [-8.05, -34.9], state: 'online' },
  { name: 'Maceio Solar', position: [-9.65, -35.71], state: 'online' },
  { name: 'Salvador Solar', position: [-12.97, -38.5], state: 'online' },
  { name: 'Aracaju Solar', position: [-10.91, -37.07], state: 'online' },
  { name: 'Goiania Solar', position: [-16.69, -49.25], state: 'online' },
  { name: 'Brasilia Solar', position: [-15.79, -47.88], state: 'online' },
  { name: 'Campo Grande Solar', position: [-20.47, -54.62], state: 'online' },
  { name: 'Ribeirao Preto Solar', position: [-21.17, -47.81], state: 'online' },
  { name: 'Vitoria Solar', position: [-20.31, -40.31], state: 'offline' },
  { name: 'Belo Horizonte Solar', position: [-19.92, -43.94], state: 'offline' },
  { name: 'Rio de Janeiro Solar', position: [-22.91, -43.17], state: 'offline' },
  { name: 'Sao Paulo Solar', position: [-23.55, -46.63], state: 'offline' },
  { name: 'Curitiba Solar', position: [-25.43, -49.27], state: 'offline' },
  { name: 'Florianopolis Solar', position: [-27.6, -48.55], state: 'offline' },
]

const MapResizeHandler = () => {
  const map = useMap()

  useEffect(() => {
    const mapElement = map.getContainer()
    const refresh = () => map.invalidateSize({ pan: false, animate: false })
    const observer = new ResizeObserver(refresh)
    const animationFrame = window.requestAnimationFrame(refresh)
    const timer = window.setTimeout(refresh, 150)

    observer.observe(mapElement)
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(timer)
    }
  }, [map])

  return null
}

const MapZoomHandler = ({ zoom }: { zoom: number }) => {
  const map = useMap()

  useEffect(() => {
    map.setZoom(zoom)
  }, [map, zoom])

  return null
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { projects, alarms, devices, lastUpdated } = useMonitoring()
  const [selectedProjectId, setSelectedProjectId] = useState('all')
  const [region, setRegion] = useState('all')
  const [mapZoom, setMapZoom] = useState(4)
  const regions = Array.from(new Set(projects.map((project) => project.location.split(', ').at(-1) ?? project.location)))
  const filteredProjects = projects.filter((project) => region === 'all' || project.location.includes(region))
  const activeProjects = projects.filter((project) => project.status !== 'offline').length
  const activeAlarms = alarms.filter((alarm) => alarm.status !== 'resolved').length
  const onlineDevices = devices.filter((device) => device.status === 'online').length
  const warningDevices = devices.filter((device) => device.status === 'warning').length
  const offlineDevices = devices.filter((device) => device.status === 'offline').length
  const mapCenter: [number, number] = [-15, -50]
  const donutStyle = { '--online': `${(onlineDevices / devices.length) * 360}deg`, '--warning': `${((onlineDevices + warningDevices) / devices.length) * 360}deg` } as CSSProperties

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId)
    if (projectId !== 'all') navigate(`/project-details/${projectId}`)
  }

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.pageHeader}>
        <div><p>Welcome back, operator <span>●</span></p><h1>Dashboard</h1></div>
        <div className={styles.liveStatus}>LIVE DATA <time>{formatLiveTimestamp(lastUpdated)}</time></div>
      </div>

      <section className={styles.kpiGrid} aria-label="Portfolio summary">
        <Card><div className={styles.kpiCard}><span>Active Projects</span><strong>{activeProjects}</strong><small className={styles.good}>All systems observed</small></div></Card>
        <Card><div className={styles.kpiCard}><span>Total Devices</span><strong>{devices.length}</strong><small className={styles.good}>{onlineDevices} reporting live</small></div></Card>
        <Card><div className={styles.kpiCard}><span>Active Alarms</span><strong>{activeAlarms}</strong><small className={styles.alert}>{alarms.filter((alarm) => alarm.severity === 'critical' && alarm.status !== 'resolved').length} critical require attention</small></div></Card>
        <Card><div className={styles.kpiCard}><span>Devices Online</span><strong>{onlineDevices}</strong><small className={styles.good}>{Math.round((onlineDevices / devices.length) * 100)}% fleet availability</small></div></Card>
      </section>

      <Card className={styles.mapCard}>
        <div className={styles.mapTopline}>
          <div><h2>Projects</h2><span>{filteredProjects.length} displayed</span></div>
          <div className={styles.mapActions}>
            <div className={styles.filters}>
            <label><span>Project</span><select value={selectedProjectId} onChange={(event) => handleProjectChange(event.target.value)}><option value="all">Total Projects ({projects.length})</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>
            <label><span>Region</span><select value={region} onChange={(event) => setRegion(event.target.value)}><option value="all">All regions</option>{regions.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <label><span>Plant status</span><select defaultValue="all"><option value="all">All</option><option value="healthy">Healthy</option><option value="warning">Warning</option><option value="critical">Critical</option></select></label>
            </div>
          </div>
        </div>
        <><div className={styles.mapCanvas}>
          <MapContainer center={mapCenter} zoom={4} zoomControl={false} scrollWheelZoom={false} className={styles.mapContainer}>
            <MapResizeHandler />
            <MapZoomHandler zoom={mapZoom} />
            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {brazilSites.map((site) => {
              const isOnline = site.state === 'online'
              return <CircleMarker key={site.name} center={site.position} radius={11} pathOptions={{ color: '#08283d', weight: 2, fillColor: isOnline ? '#00b968' : '#ff6800', fillOpacity: 1 }}><Popup><div className={styles.popupCard}><strong>{site.name}</strong><div>{isOnline ? 'Online' : 'Offline'}</div></div></Popup></CircleMarker>
            })}
          </MapContainer>
          <div className={styles.mapZoomControls} aria-label="Map zoom controls">
            <button type="button" aria-label="Zoom in map" title="Zoom in" disabled={mapZoom >= 7} onClick={() => setMapZoom((zoom) => Math.min(7, zoom + 1))}>+</button>
            <button type="button" aria-label="Zoom out map" title="Zoom out" disabled={mapZoom <= 3} onClick={() => setMapZoom((zoom) => Math.max(3, zoom - 1))}>−</button>
          </div>
        </div>
        <div className={styles.mapFooter}><span>Concentrators <b>{projects.length * 2}</b></span><span>Controllers <b>{devices.length}</b></span><span>Meters <b>{projects.length * 6}</b></span><span>Installed Power <b>1.8 MWdc</b></span><div className={styles.legend}><i className={styles.green} /> Online <i className={styles.offline} /> Offline</div></div></>
      </Card>

      <section className={styles.analysisGrid}>
        <Card className={styles.connectivityCard}>
          <div className={styles.sectionHeader}><h2>Device Connectivity History</h2><span>Today</span></div>
          <div className={styles.chart}><ResponsiveContainer width="100%" height="100%"><BarChart data={connectivityData} barGap={1}><CartesianGrid vertical={false} stroke="#e9eef4" /><XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#78889a' }} /><YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#78889a' }} /><Tooltip cursor={{ fill: '#f3f7fb' }} /><Bar dataKey="healthy" stackId="a" fill="#4398f1" /><Bar dataKey="warning" stackId="a" fill="#ffb000" /><Bar dataKey="offline" stackId="a" fill="#ef5362" /></BarChart></ResponsiveContainer></div>
          <div className={styles.connectivitySummary}><span><i className={styles.blue} /><b>Healthy</b><small>{onlineDevices} devices reporting</small></span><span><i className={styles.amber} /><b>Warning</b><small>{warningDevices} devices need attention</small></span><span><i className={styles.red} /><b>Critical</b><small>{offlineDevices} devices offline</small></span></div>
        </Card>
        <div className={styles.sideStack}>
          <Card className={styles.alarmCard}><div className={styles.sectionHeader}><h2>Active Alarms</h2><a href="/alarm">View all</a></div><div className={styles.alarmList}>{alarms.filter((alarm) => alarm.status !== 'resolved').slice(0, 3).map((alarm) => <div key={alarm.id}><Badge className={styles.alarmSeverity} variant={getStatusTone(alarm.severity)}>{alarm.severity === 'critical' ? 'critical' : 'warning'}</Badge><span>{alarm.title}<small>{alarm.deviceId}</small></span><time>{alarm.duration}</time></div>)}</div></Card>
          <Card className={styles.healthCard}><div className={styles.sectionHeader}><h2>Device Connectivity</h2><span>Live</span></div><div className={styles.healthStats}><b>{onlineDevices}<small>Online</small></b><b>{warningDevices}<small>Warning</small></b><b>{offlineDevices}<small>Offline</small></b></div><div className={styles.healthBar}><i style={{ width: `${(onlineDevices / devices.length) * 100}%` }} /></div></Card>
        </div>
      </section>

      <section className={styles.bottomGrid}>
        <Card className={styles.dsdCard}><div className={styles.sectionHeader}><h2>Device State Distribution</h2><span>Current fleet</span></div><div className={styles.dsdBody}><div className={styles.donut} style={donutStyle}><b>{Math.round((onlineDevices / devices.length) * 100)}%</b><small>Online</small></div><div className={styles.dsdLegend}><span><i className={styles.blue} /> Online <b>{onlineDevices}</b></span><span><i className={styles.amber} /> Warning <b>{warningDevices}</b></span><span><i className={styles.red} /> Offline <b>{offlineDevices}</b></span></div></div></Card>
        <Card className={styles.irradianceCard}><div className={styles.sectionHeader}><h2>Generation &amp; Irradiance - Today</h2><span><i className={styles.yellow} /> Irradiance <i className={styles.blue} /> Power</span></div><div className={styles.chart}><ResponsiveContainer width="100%" height="100%"><LineChart data={irradianceData}><CartesianGrid vertical={false} stroke="#e9eef4" /><XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#78889a' }} /><YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#78889a' }} /><YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#78889a' }} /><Tooltip /><Line yAxisId="left" type="monotone" dataKey="irradiance" stroke="#ffb000" strokeWidth={2.5} dot={false} /><Line yAxisId="right" type="monotone" dataKey="power" stroke="#4398f1" strokeWidth={2.5} dot={false} /></LineChart></ResponsiveContainer></div></Card>
      </section>
    </div>
  )
}

export default Dashboard
