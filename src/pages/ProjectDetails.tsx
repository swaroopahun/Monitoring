import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Badge from '@/components/Badge/Badge'
import { formatLiveTimestamp, getStatusTone, useMonitoring, type Device } from '@/services/monitoringData'
import styles from './ProjectDetails.module.css'

const sections = [
  { key: 'devices', label: 'Device Details' },
  { key: 'weather', label: 'Weather' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'alarms', label: 'Alarms' },
  { key: 'firmware', label: 'Firmware Status' },
  { key: 'reports', label: 'Reports' },
] as const

type SectionKey = (typeof sections)[number]['key']

const hashSeed = (value: string) => {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }
  return hash
}

const roundPercent = (value: number) => Math.round(value * 100) / 100

const relativeTime = (iso: string) => {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (minutes < 2) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

const ProjectDetails = () => {
  const params = useParams<{ projectId: string; section?: string }>()
  const navigate = useNavigate()
  const { projects, devices, alarms, lastUpdated } = useMonitoring()

  const [deviceSearch, setDeviceSearch] = useState('')
  const [deviceType, setDeviceType] = useState('all')
  const [deviceStatus, setDeviceStatus] = useState('all')
  const [alertsOnly, setAlertsOnly] = useState(false)

  const project = projects.find((item) => item.id === params.projectId) ?? projects[0]
  const activeSection: SectionKey | null = sections.find((item) => item.key === params.section)?.key ?? null

  const projectDevices = devices.filter((device) => device.projectId === project.id)
  const projectAlarms = alarms.filter((alarm) => alarm.projectId === project.id)

  const seed = useMemo(() => hashSeed(project.id), [project.id])

  const weather = useMemo(() => {
    const conditions = ['Sunny', 'Clear', 'Partly Cloudy', 'Windy']
    const sunConditions = ['Sunny', 'Partly Cloudy', 'Clear Skies', 'Hazy Sun']
    const snowConditions = ['No Snow', 'Light Snow', 'Snow Showers', 'Clear']
    return {
      temperature: 62 + (seed % 42),
      condition: conditions[seed % conditions.length],
      wind: 3 + (seed % 14),
      humidity: 18 + (seed % 55),
      pressure: 990 + (seed % 30),
      sun: { condition: sunConditions[seed % sunConditions.length], uvIndex: 1 + (seed % 10) },
      snow: { condition: snowConditions[(seed >> 2) % snowConditions.length], accumulation: `${seed % 6} in` },
    }
  }, [seed])

  const energyTrend = useMemo(() => {
    const scale = project.devicesTotal / 6
    return ['12 AM', '6 AM', '12 PM', '6 PM', '12 AM'].map((time, index) => {
      const curve = Math.sin((index / 4) * Math.PI)
      return {
        time,
        energy: Math.round(Math.max(0, curve) * scale * 4 + (seed % 20)),
        power: Math.round(Math.max(0, curve) * scale * 1.6 + (seed % 12)),
      }
    })
  }, [project.devicesTotal, seed])

  const totalEnergy = energyTrend.reduce((sum, point) => sum + point.energy, 0)
  const peakPower = Math.max(...energyTrend.map((point) => point.power))

  const alarmBuckets = {
    critical: projectAlarms.filter((alarm) => alarm.severity === 'critical').length,
    warning: projectAlarms.filter((alarm) => alarm.severity === 'major' || alarm.severity === 'warning').length,
    info: projectAlarms.filter((alarm) => alarm.severity === 'info').length,
  }

  const firmwareStatuses = projectDevices.map((device) => {
    const deviceHash = hashSeed(device.id)
    const version = `v${2 + (deviceHash % 3)}.${deviceHash % 10}.${(deviceHash >> 4) % 10}`
    const status = deviceHash % 10 < 7 ? 'Up to Date' : deviceHash % 10 < 9 ? 'Update Available' : 'Update Failed'
    return { device, version, status }
  })

  const firmwareCounts = {
    upToDate: firmwareStatuses.filter((item) => item.status === 'Up to Date').length,
    updateAvailable: firmwareStatuses.filter((item) => item.status === 'Update Available').length,
    updateFailed: firmwareStatuses.filter((item) => item.status === 'Update Failed').length,
  }

  const maintenanceDevices = projectDevices.filter((device) => device.status === 'warning').length
  const offlineDevices = project.devicesTotal - project.devicesOnline

  const deviceRows = useMemo(() => projectDevices.map((device) => {
    const deviceHash = hashSeed(device.id)
    return {
      device,
      serialNumber: `SPC${(20162700000 + (deviceHash % 900000)).toString()}`,
      lastSeen: relativeTime(device.lastCommunication),
      trackerAngle: (deviceHash % 61) - 30,
      parentNcu: `NCU ${(deviceHash % 5) + 1}`,
    }
  }), [projectDevices])

  const deviceTypes = useMemo(() => Array.from(new Set(projectDevices.map((device) => device.type))), [projectDevices])

  const filteredDeviceRows = deviceRows.filter(({ device, serialNumber }) => {
    const query = deviceSearch.trim().toLowerCase()
    const matchesSearch = !query || device.id.toLowerCase().includes(query) || serialNumber.toLowerCase().includes(query)
    const matchesType = deviceType === 'all' || device.type === deviceType
    const matchesStatus = deviceStatus === 'all' || device.status === deviceStatus
    const matchesAlerts = !alertsOnly || device.activeAlarms > 0
    return matchesSearch && matchesType && matchesStatus && matchesAlerts
  })

  const reportTypes = [
    { id: 'performance', name: 'Performance Summary', description: 'Availability, output, and efficiency for the selected period.' },
    { id: 'alarms', name: 'Alarm Report', description: 'Full alarm history with severity and resolution time.' },
    { id: 'devices', name: 'Device Inventory', description: 'Device list with type, status, and last communication.' },
    { id: 'communication', name: 'Communication Health', description: 'Signal quality and connectivity trend for this site.' },
  ]

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
            <span>{roundPercent(project.communicationHealth)}% Communication Health</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Badge variant={getStatusTone(project.status)}>{project.status === 'healthy' ? 'Healthy' : project.status}</Badge>
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpi}><span>Availability</span><strong>{project.availability}%</strong></div>
        <div className={styles.kpi}><span>Device Health</span><strong>94%</strong></div>
        <div className={styles.kpi}><span>Online Devices</span><strong>{project.devicesOnline}</strong></div>
        <div className={styles.kpi}><span>Offline Devices</span><strong>{offlineDevices}</strong></div>
        <div className={styles.kpi}><span>Active Alarms</span><strong>{project.activeAlarms}</strong></div>
        <div className={styles.kpi}><span>Critical Alarms</span><strong>{project.criticalAlarms}</strong></div>
        <div className={styles.kpi}><span>Comm Quality</span><strong>{roundPercent(project.communicationHealth)}%</strong></div>
        <div className={styles.kpi}><span>Last Updated</span><strong>{formatLiveTimestamp(lastUpdated)}</strong></div>
      </div>

      <nav className={styles.tabs} aria-label="Project modules">
        {sections.map((section) => (
          <button
            key={section.key}
            type="button"
            className={`${styles.tab} ${activeSection === section.key ? styles.tabActive : ''}`}
            onClick={() => navigate(`/project-details/${project.id}/${section.key}`)}
          >
            {section.label}
          </button>
        ))}
      </nav>

      {activeSection === null && (
        <section className={styles.overviewHint}>
          <strong>{project.name}</strong> is online and reporting live data. Select a module above — Device Details, Weather, Analytics, Alarms, Firmware Status, or Reports — to view its full details.
        </section>
      )}

      {activeSection === 'devices' && (
        <>
          <section className={styles.widget}>
            <div className={styles.widgetHeader}><h2>Device Status Overview</h2></div>
            <div className={styles.statusBar}>
              <i style={{ width: `${(project.devicesOnline / project.devicesTotal) * 100}%`, background: '#1db969' }} />
              <i style={{ width: `${(offlineDevices / project.devicesTotal) * 100}%`, background: '#f5a000' }} />
            </div>
            <div className={styles.statusLegend}>
              <span><i className={styles.dotOnline} />Online <b>{project.devicesOnline} ({roundPercent((project.devicesOnline / project.devicesTotal) * 100)}%)</b></span>
              <span><i className={styles.dotOffline} />Offline <b>{offlineDevices} ({roundPercent((offlineDevices / project.devicesTotal) * 100)}%)</b></span>
              <span><i className={styles.dotMaintenance} />Maintenance <b>{maintenanceDevices} ({roundPercent((maintenanceDevices / project.devicesTotal) * 100)}%)</b></span>
            </div>
          </section>

          <section className={styles.widget}>
            <div className={styles.widgetHeader}><h2>Device Details</h2><span>{filteredDeviceRows.length} of {deviceRows.length} devices</span></div>
            <div className={styles.deviceFilterBar}>
              <input type="search" aria-label="Search device ID or serial" placeholder="Search device ID or serial..." value={deviceSearch} onChange={(event) => setDeviceSearch(event.target.value)} />
              <select aria-label="Filter device type" value={deviceType} onChange={(event) => setDeviceType(event.target.value)}>
                <option value="all">All Types</option>
                {deviceTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              <select aria-label="Filter device status" value={deviceStatus} onChange={(event) => setDeviceStatus(event.target.value)}>
                <option value="all">All Statuses</option>
                <option value="online">Online</option>
                <option value="warning">Warning</option>
                <option value="offline">Offline</option>
              </select>
              <label className={styles.alertsOnly}>
                <input type="checkbox" checked={alertsOnly} onChange={(event) => setAlertsOnly(event.target.checked)} />
                Show Alerts Only
              </label>
            </div>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>Device ID</th>
                    <th>Type</th>
                    <th>Serial Number</th>
                    <th>Last Seen</th>
                    <th>Tracker Angle</th>
                    <th>Parent NCU</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeviceRows.map(({ device, serialNumber, lastSeen, trackerAngle, parentNcu }) => {
                    const statusLabel = device.status === 'online' ? 'Online' : device.status === 'warning' ? 'Warning' : 'Offline'
                    const pillClass = device.status === 'online' ? styles.pillOnline : device.status === 'warning' ? styles.pillWarning : styles.pillOffline
                    return (
                      <tr key={device.id}>
                        <td className={styles.deviceIdCell}>{device.id}</td>
                        <td>{device.type}</td>
                        <td>{serialNumber}</td>
                        <td>{lastSeen}</td>
                        <td>{trackerAngle}°</td>
                        <td>{parentNcu}</td>
                        <td><span className={`${styles.statusPill} ${pillClass}`}><i /> {statusLabel}</span></td>
                      </tr>
                    )
                  })}
                  {filteredDeviceRows.length === 0 && <tr><td colSpan={7} className={styles.emptyRow}>No devices match these filters.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {activeSection === 'weather' && (
        <section className={styles.widget}>
          <div className={styles.widgetHeader}><h2>Weather</h2><span>{project.location.split(', ')[0]}</span></div>
          <div className={styles.statGrid}>
            <div><span>🌡 Temperature</span><strong>{weather.temperature}°F</strong></div>
            <div><span>☁ Conditions</span><strong>{weather.condition}</strong></div>
            <div><span>💨 Wind</span><strong>{weather.wind} mph</strong></div>
            <div><span>💧 Humidity</span><strong>{weather.humidity}%</strong></div>
            <div><span>⏱ Pressure</span><strong>{weather.pressure} hPa</strong></div>
            <div><span>☀ Sun / Solar</span><strong>{weather.sun.condition} · UV {weather.sun.uvIndex}</strong></div>
            <div><span>❄ Snow</span><strong>{weather.snow.condition} · {weather.snow.accumulation}</strong></div>
          </div>
        </section>
      )}

      {activeSection === 'analytics' && (
        <div className={styles.widgetRowSplit}>
          <section className={styles.widget}>
            <div className={styles.widgetHeader}><h2>System Analytics</h2><span>Today</span></div>
            <div className={styles.chartBoxLarge}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={energyTrend} margin={{ top: 6, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="#eef2f7" vertical={false} />
                  <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="energy" stroke="#4398f1" strokeWidth={2.5} dot={false} name="Energy (kWh)" />
                  <Line type="monotone" dataKey="power" stroke="#ffb000" strokeWidth={2.5} dot={false} name="Power (kW)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className={styles.widget}>
            <div className={styles.widgetHeader}><h2>Performance Summary</h2></div>
            <div className={styles.statList}>
              <div><span>Total Energy</span><strong>{totalEnergy.toLocaleString()} kWh</strong></div>
              <div><span>Peak Power</span><strong>{peakPower} kW</strong></div>
              <div><span>Availability</span><strong>{project.availability}%</strong></div>
              <div><span>Comm Quality</span><strong>{roundPercent(project.communicationHealth)}%</strong></div>
            </div>
          </section>
        </div>
      )}

      {activeSection === 'alarms' && (
        <div className={styles.widgetRowSplit}>
          <section className={styles.widget}>
            <div className={styles.widgetHeader}><h2>Alarms Summary</h2></div>
            <div className={styles.statList}>
              <div><span>Critical</span><strong className={styles.critical}>{alarmBuckets.critical}</strong></div>
              <div><span>Warning</span><strong className={styles.warning}>{alarmBuckets.warning}</strong></div>
              <div><span>Info</span><strong className={styles.info}>{alarmBuckets.info}</strong></div>
            </div>
          </section>
          <section className={`${styles.widget} ${styles.widgetWide}`}>
            <div className={styles.widgetHeader}><h2>Alarm List</h2></div>
            <div className={styles.tableWrap}>
              <table>
                <thead><tr><th>Severity</th><th>Title</th><th>Device</th><th>Started</th><th>Status</th></tr></thead>
                <tbody>
                  {projectAlarms.map((alarm) => (
                    <tr key={alarm.id}>
                      <td><Badge variant={getStatusTone(alarm.severity)}>{alarm.severity}</Badge></td>
                      <td>{alarm.title}</td>
                      <td>{alarm.deviceId}</td>
                      <td>{formatLiveTimestamp(alarm.startedAt)}</td>
                      <td>{alarm.status}</td>
                    </tr>
                  ))}
                  {projectAlarms.length === 0 && <tr><td colSpan={5} className={styles.emptyRow}>No alarms for this project.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {activeSection === 'firmware' && (
        <div className={styles.widgetRowSplit}>
          <section className={styles.widget}>
            <div className={styles.widgetHeader}><h2>Firmware Status</h2></div>
            <div className={styles.statList}>
              <div><span>Up to Date</span><strong>{firmwareCounts.upToDate}</strong></div>
              <div><span>Update Available</span><strong>{firmwareCounts.updateAvailable}</strong></div>
              <div><span>Update Failed</span><strong>{firmwareCounts.updateFailed}</strong></div>
            </div>
          </section>
          <section className={`${styles.widget} ${styles.widgetWide}`}>
            <div className={styles.widgetHeader}><h2>Device Firmware</h2></div>
            <div className={styles.tableWrap}>
              <table>
                <thead><tr><th>Device</th><th>Type</th><th>Version</th><th>Status</th></tr></thead>
                <tbody>
                  {firmwareStatuses.map(({ device, version, status }: { device: Device; version: string; status: string }) => (
                    <tr key={device.id}>
                      <td>{device.name}</td>
                      <td>{device.type}</td>
                      <td>{version}</td>
                      <td>{status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {activeSection === 'reports' && (
        <section className={styles.widget}>
          <div className={styles.widgetHeader}><h2>Reports</h2></div>
          <div className={styles.reportGrid}>
            {reportTypes.map((report) => (
              <div key={report.id} className={styles.reportCard}>
                <strong>{report.name}</strong>
                <small>{report.description}</small>
                <button type="button" className={styles.viewAll}>Generate Report →</button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default ProjectDetails

