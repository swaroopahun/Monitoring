import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Badge from '@/components/Badge/Badge'
import ProjectDeviceMap from '@/components/ProjectDeviceMap/ProjectDeviceMap'
import { formatLiveTimestamp, getPlantStatusLabel, getStatusTone, useMonitoring, type AlarmSeverity, type Device } from '@/services/monitoringData'
import styles from './ProjectDetails.module.css'

const sections = [
  { key: 'devices', label: 'Devices' },
  { key: 'firmware', label: 'Firmware Versions' },
  { key: 'weather', label: 'Weather' },
  { key: 'alarms', label: 'Alarms' },
  { key: 'battery', label: 'Battery' },
] as const

type SectionKey = (typeof sections)[number]['key']
type BatteryView = 'overview' | 'telemetry'

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const hashSeed = (value: string) => {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  return hash
}

const ProjectDetails = () => {
  const { projectId, section } = useParams<{ projectId: string; section?: string }>()
  const navigate = useNavigate()
  const { projects, devices, alarms, batteries, lastUpdated } = useMonitoring()
  const [mapView, setMapView] = useState(true)
  const [deviceStatus, setDeviceStatus] = useState('all')
  const [deviceType, setDeviceType] = useState('all')
  const [alarmType, setAlarmType] = useState('all')
  const [batteryView, setBatteryView] = useState<BatteryView>('overview')

  const project = projects.find((item) => item.id === projectId) ?? projects[0]
  const activeSection: SectionKey = sections.find((item) => item.key === section)?.key ?? 'devices'
  const projectDevices = devices.filter((item) => item.projectId === project.id)
  const projectAlarms = alarms.filter((item) => item.projectId === project.id)
  const projectBatteries = batteries.filter((item) => item.projectId === project.id)
  const offlineDevices = Math.max(0, project.devicesTotal - project.devicesOnline)

  const filteredDevices = projectDevices.filter((device) =>
    (deviceStatus === 'all' || device.status === deviceStatus)
    && (deviceType === 'all' || device.type === deviceType)
    && (alarmType === 'all' || projectAlarms.some((alarm) => alarm.deviceId === device.id && alarm.severity === alarmType)),
  )

  const averageSoc = projectBatteries.length
    ? Math.round(projectBatteries.reduce((sum, battery) => sum + battery.soc, 0) / projectBatteries.length)
    : null
  const averageSoh = projectBatteries.length
    ? Math.round(projectBatteries.reduce((sum, battery) => sum + battery.soh, 0) / projectBatteries.length)
    : null

  const telemetry = useMemo(() => weekdays.map((day, index) => {
    const change = [1, 0, -2, -1, 0, 1, 0][index]
    const soc = averageSoc ?? 70
    const soh = averageSoh ?? 90
    const avgTemp = projectBatteries.length
      ? projectBatteries.reduce((sum, battery) => sum + battery.temperature, 0) / projectBatteries.length
      : 25
    return {
      day,
      soc: Math.min(100, Math.max(0, soc + change)),
      soh: Math.min(100, Math.max(0, soh + change * 0.2)),
      temperature: Number((avgTemp + change * 1.4).toFixed(1)),
      voltage: projectBatteries.length ? Math.round(projectBatteries[0].voltage + change * 2) : 52 + change,
      current: projectBatteries.length ? Math.round(projectBatteries[0].current + change * 3) : 72 + change * 3,
    }
  }), [averageSoc, averageSoh, projectBatteries])

  const batteryHealth = [
    { name: 'Healthy', value: projectBatteries.filter((battery) => battery.status === 'online').length, color: '#20c366' },
    { name: 'Warning', value: projectBatteries.filter((battery) => battery.status === 'warning').length, color: '#ffb400' },
    { name: 'Offline', value: projectBatteries.filter((battery) => battery.status === 'offline').length, color: '#ff353c' },
  ].filter((item) => item.value > 0)
  const totalBatteryCount = projectBatteries.length
  const socBuckets = [
    { name: 'High (80–100%)', value: projectBatteries.filter((item) => item.soc >= 80).length, color: '#20c366' },
    { name: 'Medium (50–79%)', value: projectBatteries.filter((item) => item.soc >= 50 && item.soc < 80).length, color: '#3987f5' },
    { name: 'Low (20–49%)', value: projectBatteries.filter((item) => item.soc >= 20 && item.soc < 50).length, color: '#ffb400' },
    { name: 'Critical (0–19%)', value: projectBatteries.filter((item) => item.soc < 20).length, color: '#ff353c' },
  ].filter((item) => item.value > 0)
  const temperatureBuckets = [
    { range: '<20°', count: projectBatteries.filter((item) => item.temperature < 20).length, color: '#b6d7ff' },
    { range: '20–25°', count: projectBatteries.filter((item) => item.temperature >= 20 && item.temperature < 25).length, color: '#84e9ae' },
    { range: '25–30°', count: projectBatteries.filter((item) => item.temperature >= 25 && item.temperature < 30).length, color: '#20c366' },
    { range: '30–35°', count: projectBatteries.filter((item) => item.temperature >= 30 && item.temperature < 35).length, color: '#ffdf76' },
    { range: '≥35°', count: projectBatteries.filter((item) => item.temperature >= 35).length, color: '#ffb400' },
  ]

  const firmwareRows = projectDevices.map((device) => {
    const deviceSeed = hashSeed(device.id)
    return {
      device,
      software: `v${1 + (deviceSeed % 2)}.${deviceSeed % 10}.${(deviceSeed >> 3) % 10}`,
      hardware: `v0.${(deviceSeed >> 2) % 50}`,
    }
  })

  const statusLabel = project.status === 'healthy' ? 'In Operation' : project.status === 'warning' ? 'Issues Detected' : getPlantStatusLabel(project.status)
  const deviceTypeOptions = [...new Set(projectDevices.map((device) => device.type))]
  const isSkylinkProject = project.supplier === 'Skylink'

  return (
    <div className={styles.page}>
      <header className={styles.projectHeader}>
        <div>
          <div className={styles.projectTitleLine}>
            <h1>{project.name}</h1>
            <span className={`${styles.operationPill} ${styles[project.status]}`}><i />{statusLabel}</span>
          </div>
          <div className={styles.projectMeta}>
            <span><b>⌖</b> {project.location}</span>
            <span>Project ID: {project.id}</span>
            <span>Customer: {project.customer}</span>
          </div>
        </div>
        <div className={styles.refreshInfo}>
          <span><i />Live</span>
          <small>Last Updated: {formatLiveTimestamp(lastUpdated)}</small>
          <button type="button" aria-label="Refresh project details" title="Refresh data" onClick={() => window.location.reload()}>⟳</button>
        </div>
      </header>

      <section className={styles.projectMetrics} aria-label="Project metrics">
        <Metric label="Total Devices" value={project.devicesTotal.toLocaleString()} detail={`${project.devicesOnline} online · ${offlineDevices} offline`} />
        <Metric label="Installed Power" value={isSkylinkProject ? 'N/A' : `${project.powerMWdc}`} />
        <Metric label="Active Alarms" value={projectAlarms.filter((alarm) => alarm.status !== 'resolved').length.toString()} detail={`${project.criticalAlarms} critical`} alert={project.criticalAlarms > 0} />
        <Metric label="Total Batteries" value={isSkylinkProject ? 'N/A' : (totalBatteryCount ? totalBatteryCount.toString() : 'N/A')} detail={project.supplier} />
        <Metric label="Operational Batteries" value={isSkylinkProject ? 'N/A' : projectBatteries.filter((battery) => battery.status === 'online').length.toString()} detail={isSkylinkProject ? 'Battery data unavailable' : `${projectBatteries.filter((battery) => battery.status !== 'online').length} need attention`} />
        <Metric label="Avg. State of Charge" value={isSkylinkProject ? 'N/A' : (averageSoc === null ? 'N/A' : `${averageSoc}%`)} detail={isSkylinkProject ? 'Battery data unavailable' : (averageSoh === null ? 'No health data' : `Avg. health ${averageSoh}%`)} />
      </section>

      <nav className={styles.tabs} aria-label="Project modules">
        {sections.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`${styles.tab} ${activeSection === item.key ? styles.tabActive : ''}`}
            onClick={() => navigate(`/project-details/${project.id}/${item.key}`)}
          >{item.label}</button>
        ))}
      </nav>

      {activeSection === 'devices' && (
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Devices &amp; Alarms</h2>
            <div className={styles.viewSwitch}>
              <button type="button" className={mapView ? styles.switchActive : ''} onClick={() => setMapView(true)}>Map View</button>
              <button type="button" className={!mapView ? styles.switchActive : ''} onClick={() => setMapView(false)}>List View</button>
            </div>
          </div>
          <div className={styles.filters}>
            <label>Alarm Type<select value={alarmType} onChange={(event) => setAlarmType(event.target.value)}><option value="all">All</option><option value="critical">Critical</option><option value="major">High</option><option value="warning">Warning</option><option value="info">Info</option></select></label>
            <label>Status<select value={deviceStatus} onChange={(event) => setDeviceStatus(event.target.value)}><option value="all">All</option><option value="online">Online</option><option value="warning">Warning</option><option value="offline">Offline</option></select></label>
            <label>Device Type<select value={deviceType} onChange={(event) => setDeviceType(event.target.value)}><option value="all">All</option>{deviceTypeOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
          </div>
          {mapView ? (
            <>
              <ProjectDeviceMap project={project} devices={filteredDevices} onDeviceSelect={(deviceId) => navigate(`/device-details/${deviceId}`)} />
              <p className={styles.mapNote}>Click a device marker to open its details. Device map positions are illustrative around the project coordinates.</p>
            </>
          ) : (
            <DeviceTable devices={filteredDevices} alarms={projectAlarms} onSelect={(deviceId) => navigate(`/device-details/${deviceId}`)} />
          )}
          <div className={styles.deviceCounts}>Gateways {project.concentrators} · Trackers {project.devicesTotal} · Weather Stations {project.meteoStations}</div>
        </section>
      )}

      {activeSection === 'firmware' && (
        <section className={styles.panel}>
          <PanelHeader title="Firmware Versions" detail="Firmware versions by device type" />
          <div className={styles.firmwareGrid}>
            <section><h3>Software</h3>{firmwareRows.length ? firmwareRows.map(({ device, software }) => <div className={styles.versionRow} key={device.id}><span>{software}</span><small>{device.name} · {device.type}</small></div>) : <EmptyState>No device firmware is available for this project.</EmptyState>}</section>
            <section><h3>Hardware</h3>{firmwareRows.length ? firmwareRows.map(({ device, hardware }) => <div className={styles.versionRow} key={device.id}><span>{hardware}</span><small>{device.name} · {device.type}</small></div>) : <EmptyState>No hardware versions are available.</EmptyState>}</section>
          </div>
        </section>
      )}

      {activeSection === 'weather' && (
        <section className={styles.panel}>
          <div className={styles.weatherHeaderRow}>
            <h2>Field Meteorological</h2>
            <span>2 Active Units</span>
          </div>

          <div className={styles.weatherTableWrap}>
            <table className={styles.weatherTable}>
              <thead>
                <tr>
                  <th>Station / Location</th>
                  <th>Status</th>
                  <th>Temperature</th>
                  <th>Conditions</th>
                  <th>Wind</th>
                  <th>Humidity</th>
                  <th>Precipitation</th>
                  <th>Dew Point</th>
                  <th>Irradiance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Met Station 01 - North Array</strong><small>Block 1</small></td>
                  <td><span className={styles.weatherStatusOnline}>Online</span></td>
                  <td>69°F</td>
                  <td>Windy</td>
                  <td>10 mph</td>
                  <td>44%</td>
                  <td>0%</td>
                  <td>No Snow</td>
                  <td>342 W/m²</td>
                </tr>
                <tr>
                  <td><strong>Met Station 02 - Substation</strong><small>Tracker Block 4</small></td>
                  <td><span className={styles.weatherStatusOnline}>Online</span></td>
                  <td>72°F</td>
                  <td>Clear / Breezy</td>
                  <td>14 mph</td>
                  <td>38%</td>
                  <td>0%</td>
                  <td>No Snow</td>
                  <td>365 W/m²</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.weatherDashboardGrid}>
            <div className={styles.weatherLargeCard}>
              <div className={styles.weatherCardHeader}>
                <h3>Wind Rose (Direction &amp; Frequency Distribution)</h3>
                <span>Dominant: SSE (158°)</span>
              </div>
              <div className={styles.windRoseWrap}>
                <svg viewBox="0 0 320 260" className={styles.windRoseSvg} aria-label="Wind rose chart">
                  <g>
                    <circle cx="160" cy="130" r="80" fill="none" stroke="#dfeaf3" />
                    <circle cx="160" cy="130" r="58" fill="none" stroke="#eef3f8" />
                    <circle cx="160" cy="130" r="36" fill="none" stroke="#eef3f8" />
                    <line x1="160" y1="50" x2="160" y2="210" stroke="#e8edf4" />
                    <line x1="80" y1="130" x2="240" y2="130" stroke="#e8edf4" />
                    <line x1="106" y1="76" x2="214" y2="184" stroke="#e8edf4" />
                    <line x1="214" y1="76" x2="106" y2="184" stroke="#e8edf4" />
                  </g>
                  <g>
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                      const radians = (angle - 90) * (Math.PI / 180)
                      const x = 160 + Math.cos(radians) * 98
                      const y = 130 + Math.sin(radians) * 98
                      return <line key={angle} x1="160" y1="130" x2={x} y2={y} stroke="#dfe7ef" strokeWidth="1" />
                    })}
                  </g>
                  <g>
                    {[
                      { angle: 90, length: 58, color: '#4e7df9' },
                      { angle: 20, length: 48, color: '#9b8ef7' },
                      { angle: 120, length: 64, color: '#f7ad3c' },
                      { angle: 160, length: 74, color: '#ff4f5d' },
                      { angle: 210, length: 55, color: '#29c07e' },
                    ].map((segment) => {
                      const radians = (segment.angle - 90) * (Math.PI / 180)
                      const x2 = 160 + Math.cos(radians) * segment.length
                      const y2 = 130 + Math.sin(radians) * segment.length
                      return <line key={segment.angle} x1="160" y1="130" x2={x2} y2={y2} stroke={segment.color} strokeWidth="3" strokeLinecap="round" />
                    })}
                  </g>
                  <g fill="#4f6479" fontSize="10" textAnchor="middle">
                    <text x="160" y="34">N</text>
                    <text x="160" y="226">S</text>
                    <text x="274" y="136">E</text>
                    <text x="46" y="136">W</text>
                  </g>
                </svg>
              </div>
              <div className={styles.legendRow}>
                <span><i className={styles.swatchBlue} /> 0–5 mph</span>
                <span><i className={styles.swatchLightBlue} /> 5–10 mph</span>
                <span><i className={styles.swatchAmber} /> 10–15 mph</span>
                <span><i className={styles.swatchRed} /> &gt;15 mph</span>
              </div>
            </div>

            <div className={styles.weatherLargeCard}>
              <div className={styles.weatherCardHeader}>
                <h3>Wind Speed &amp; Gust Profile</h3>
                <span>Station 01 · 24h forecast</span>
              </div>
              <svg viewBox="0 0 420 200" className={styles.lineChartSvg} aria-label="Wind speed chart">
                <g stroke="#e5edf4" strokeWidth="1">
                  {[0, 1, 2, 3, 4].map((row) => (
                    <line key={row} x1="30" x2="380" y1={30 + row * 32} y2={30 + row * 32} />
                  ))}
                </g>
                <path d="M30 135 C 75 120, 95 96, 120 110 S 170 120, 200 92 S 260 98, 300 72 S 350 76, 380 62 L 380 172 L 30 172 Z" fill="#dbeeff" opacity="0.8" />
                <path d="M30 138 C 75 120, 95 98, 120 110 S 170 118, 200 92 S 260 98, 300 72 S 350 78, 380 64" fill="none" stroke="#3d8af7" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M30 83 C 80 90, 105 78, 130 86 S 175 102, 210 98 S 280 62, 330 72 S 360 80, 380 74" fill="none" stroke="#f5b33a" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 6" />
                <g fill="#718598" fontSize="10">
                  {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'].map((label, index) => (
                    <text key={label} x={38 + index * 54} y="190" textAnchor="middle">{label}</text>
                  ))}
                </g>
              </svg>
              <div className={styles.chartSummaryRow}>
                <div>
                  <strong>Peak Record: 22.4 mph (13:40)</strong>
                </div>
                <div>
                  <strong>Safe Margin: 12.8 mph below snow limit</strong>
                </div>
              </div>
            </div>

            <div className={styles.weatherLargeCard}>
              <div className={styles.weatherCardHeader}>
                <h3>Wind Direction History (0° - 360°)</h3>
                <span>Tracker way alignment vector correction</span>
              </div>
              <svg viewBox="0 0 420 165" className={styles.lineChartSvg} aria-label="Wind direction chart">
                <g stroke="#e8edf3" strokeWidth="1">
                  {[0, 1, 2, 3, 4].map((row) => (
                    <line key={row} x1="30" x2="380" y1={24 + row * 30} y2={24 + row * 30} />
                  ))}
                </g>
                <path d="M30 120 C 90 90, 120 72, 150 105 S 220 142, 260 128 S 330 90, 380 98" fill="none" stroke="#8c74ff" strokeWidth="2.5" strokeLinecap="round" />
                <g fill="#6b7d8f" fontSize="10">
                  {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'].map((label, index) => (
                    <text key={label} x={38 + index * 54} y="152" textAnchor="middle">{label}</text>
                  ))}
                </g>
              </svg>
              <div className={styles.miniLegend}>
                <span><i className={styles.swatchPurple} /> Met Station 01</span>
                <span><i className={styles.swatchGray} /> Met Station 02</span>
              </div>
            </div>

            <div className={styles.weatherLargeCard}>
              <div className={styles.weatherCardHeader}>
                <h3>Solar Irradiance Profile (Daily Curve)</h3>
                <span>GHI: 0.4 kW/m² · POA: 1.8 kW/m²</span>
              </div>
              <svg viewBox="0 0 420 180" className={styles.lineChartSvg} aria-label="Solar irradiance chart">
                <g stroke="#e8edf3" strokeWidth="1">
                  {[0, 1, 2, 3, 4].map((row) => (
                    <line key={row} x1="30" x2="380" y1={20 + row * 28} y2={20 + row * 28} />
                  ))}
                </g>
                <path d="M25 120 C 70 70, 110 38, 170 45 S 265 104, 330 76 S 360 40, 380 42 L 380 150 L 25 150 Z" fill="#fbe7b2" opacity="0.65" />
                <path d="M25 120 C 70 70, 110 38, 170 45 S 265 104, 330 76 S 360 40, 380 42" fill="none" stroke="#f2a600" strokeWidth="3" strokeLinecap="round" />
                <g fill="#718598" fontSize="10">
                  {['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '24:00'].map((label, index) => (
                    <text key={label} x={38 + index * 28} y="168" textAnchor="middle">{label}</text>
                  ))}
                </g>
              </svg>
              <div className={styles.chartSummaryRow}>
                <div><strong>Daily Cumulative Energy: 8.62 kWh/m²</strong></div>
                <div><strong>Tracking Advantage: Single-Axis Tracking</strong></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeSection === 'alarms' && (
        <section className={styles.panel}>
          <PanelHeader title="Active Project Alarms" detail={`${projectAlarms.filter((alarm) => alarm.status !== 'resolved').length} active`} />
          <div className={styles.alarmSummary}>
            <Metric label="Critical" value={alarmBuckets(projectAlarms, 'critical').toString()} alert />
            <Metric label="High" value={alarmBuckets(projectAlarms, 'major').toString()} alert />
            <Metric label="Warning" value={alarmBuckets(projectAlarms, 'warning').toString()} />
            <Metric label="Info" value={alarmBuckets(projectAlarms, 'info').toString()} />
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>Device</th><th>Alarm Type</th><th>Severity</th><th>Started</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {projectAlarms.map((alarm) => (
                  <tr key={alarm.id}>
                    <td>{alarm.deviceId}</td><td>{alarm.title}</td><td><Badge variant={getStatusTone(alarm.severity)}>{alarm.severity}</Badge></td>
                    <td>{formatLiveTimestamp(alarm.startedAt)}</td><td>{alarm.status}</td>
                    <td><button className={styles.textButton} type="button" onClick={() => navigate(`/device-details/${alarm.deviceId}`)}>View device →</button></td>
                  </tr>
                ))}
                {projectAlarms.length === 0 && <tr><td colSpan={6}><EmptyState>No alarms reported for this project.</EmptyState></td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeSection === 'battery' && (
        <section className={styles.batterySection}>
          {!isSkylinkProject ? (
            <>
              <nav className={styles.batteryTabs} aria-label="Battery views">
                <button type="button" className={batteryView === 'overview' ? styles.batteryTabActive : ''} onClick={() => setBatteryView('overview')}>Battery Overview</button>
                <button type="button" className={batteryView === 'telemetry' ? styles.batteryTabActive : ''} onClick={() => setBatteryView('telemetry')}>Battery Telemetry</button>
              </nav>
              {projectBatteries.length === 0 ? (
                <section className={`${styles.panel} ${styles.emptyPanel}`}><h2>Battery Monitoring</h2><p>No battery monitoring data is associated with this project.</p></section>
              ) : batteryView === 'overview' ? (
            <>
              <section className={styles.panel}>
                <PanelHeader title="State of Charge — Last 7 Days" detail={`Max ${Math.max(...projectBatteries.map((item) => item.soc))}% · Avg ${averageSoc}% · Min ${Math.min(...projectBatteries.map((item) => item.soc))}%`} />
                <div className={styles.largeChart}><ResponsiveContainer width="100%" height="100%"><AreaChart data={telemetry}><CartesianGrid stroke="#e4eaf0" vertical={false} /><XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#718598' }} /><YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} tick={{ fontSize: 10, fill: '#718598' }} /><Tooltip /><Area type="monotone" dataKey="soc" name="Average SOC" stroke="#3987f5" fill="#d9eaff" strokeWidth={2} /></AreaChart></ResponsiveContainer></div>
              </section>
              <div className={styles.batteryGrid}>
                <BatteryDonut title="Battery Health Distribution" data={batteryHealth} center={`${totalBatteryCount}`} caption="Batteries" />
                <section className={styles.panel}><PanelHeader title="Battery Details" /><BatteryTable batteries={projectBatteries} onTelemetry={() => setBatteryView('telemetry')} /></section>
              </div>
              <div className={styles.batteryGrid}>
                <BatteryDonut title="Battery SoC Distribution" data={socBuckets} center={`${averageSoc}%`} caption="Average SoC" />
                <section className={styles.panel}><PanelHeader title="Battery Temperature Histogram" /><div className={styles.chart}><ResponsiveContainer width="100%" height="100%"><BarChart data={temperatureBuckets}><CartesianGrid stroke="#e4eaf0" vertical={false} /><XAxis dataKey="range" tick={{ fontSize: 9, fill: '#718598' }} /><YAxis allowDecimals={false} tick={{ fontSize: 9, fill: '#718598' }} /><Tooltip /><Bar dataKey="count" name="Batteries">{temperatureBuckets.map((item) => <Cell key={item.range} fill={item.color} />)}</Bar></BarChart></ResponsiveContainer></div></section>
              </div>
            </>
              ) : (
                <div className={styles.telemetryGrid}>
                  <TelemetryChart title="State of Charge (SOC)" data={telemetry} dataKey="soc" color="#3987f5" suffix="%" />
                  <TelemetryChart title="State of Health (SOH)" data={telemetry} dataKey="soh" color="#20c366" suffix="%" />
                  <TelemetryChart title="Temperature" data={telemetry} dataKey="temperature" color="#ffb400" suffix="°F" />
                  <section className={styles.panel}><PanelHeader title="Voltage & Current" /><div className={styles.chart}><ResponsiveContainer width="100%" height="100%"><LineChart data={telemetry}><CartesianGrid stroke="#e4eaf0" vertical={false} /><XAxis dataKey="day" tick={{ fontSize: 9, fill: '#718598' }} /><YAxis yAxisId="voltage" tick={{ fontSize: 9, fill: '#718598' }} /><YAxis yAxisId="current" orientation="right" tick={{ fontSize: 9, fill: '#718598' }} /><Tooltip /><Legend /><Line yAxisId="voltage" dataKey="voltage" name="Voltage" stroke="#3987f5" dot={false} /><Line yAxisId="current" dataKey="current" name="Current" stroke="#ff353c" dot={false} /></LineChart></ResponsiveContainer></div></section>
                </div>
              )}
            </>
          ) : (
            <section className={`${styles.panel} ${styles.emptyPanel}`}><h2>Battery Monitoring</h2><p>N/A — Battery data is not available for Skylink projects.</p></section>
          )}
        </section>
      )}
    </div>
  )
}

const alarmBuckets = (items: { severity: AlarmSeverity; status: string }[], severity: AlarmSeverity) => items.filter((alarm) => alarm.severity === severity && alarm.status !== 'resolved').length

const Metric = ({ label, value, detail, alert = false }: { label: string; value: string; detail?: string; alert?: boolean }) => (
  <div className={`${styles.metric} ${alert ? styles.metricAlert : ''}`}><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</div>
)

const PanelHeader = ({ title, detail }: { title: string; detail?: string }) => <div className={styles.panelHeader}><h2>{title}</h2>{detail && <span>{detail}</span>}</div>

const EmptyState = ({ children }: { children: string }) => <div className={styles.emptyState}>{children}</div>

const DeviceTable = ({ devices, alarms, onSelect }: { devices: Device[]; alarms: { deviceId: string; title: string; severity: AlarmSeverity }[]; onSelect: (deviceId: string) => void }) => (
  <div className={styles.tableWrap}>
    <table>
      <thead><tr><th>Device ID</th><th>Type</th><th>Status</th><th>Alarms</th><th>Communication</th><th>Details</th></tr></thead>
      <tbody>
        {devices.map((device) => {
          const deviceAlarms = alarms.filter((alarm) => alarm.deviceId === device.id)
          return <tr key={device.id}><td><button className={styles.textButton} type="button" onClick={() => onSelect(device.id)}>{device.id}</button></td><td>{device.type}</td><td><Badge variant={getStatusTone(device.status)}>{device.status}</Badge></td><td>{deviceAlarms.length ? deviceAlarms.map((alarm) => <span className={styles.alarmTag} key={`${alarm.deviceId}-${alarm.title}`} title={alarm.title}>{alarm.severity}</span>) : '—'}</td><td>{device.communication}</td><td><button className={styles.textButton} type="button" onClick={() => onSelect(device.id)}>Open →</button></td></tr>
        })}
        {devices.length === 0 && <tr><td colSpan={6}><EmptyState>No devices match these filters.</EmptyState></td></tr>}
      </tbody>
    </table>
  </div>
)


const BatteryDonut = ({ title, data, center, caption }: { title: string; data: { name: string; value: number; color: string }[]; center: string; caption: string }) => (
  <section className={styles.panel}>
    <PanelHeader title={title} />
    {data.length ? <>
      <div className={styles.donutArea}>
        <div className={styles.donutVisual}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="82%" paddingAngle={2}>{data.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className={styles.donutCenter}><strong>{center}</strong><small>{caption}</small></div></div>
      </div>
      <div className={styles.donutLegend}>{data.map((item) => <span key={item.name}><i style={{ background: item.color }} />{item.name} ({item.value})</span>)}</div>
    </> : <EmptyState>No battery data is available.</EmptyState>}
  </section>
)

const BatteryTable = ({ batteries, onTelemetry }: { batteries: ReturnType<typeof useMonitoring>['batteries']; onTelemetry: () => void }) => (
  <div className={styles.tableWrap}>
    <table><thead><tr><th>Tracker ID</th><th>SoC (%)</th><th>Health Status</th><th>Alarms</th></tr></thead>
      <tbody>{batteries.map((battery) => <tr key={battery.id}><td><button type="button" className={styles.textButton} onClick={onTelemetry}>{battery.id}</button></td><td>{battery.soc}%</td><td>{battery.soh}%</td><td><Badge variant={getStatusTone(battery.status)}>{battery.status}</Badge></td></tr>)}</tbody>
    </table>
  </div>
)

const TelemetryChart = ({ title, data, dataKey, color, suffix }: { title: string; data: { day: string; soc: number; soh: number; temperature: number }[]; dataKey: 'soc' | 'soh' | 'temperature'; color: string; suffix: string }) => (
  <section className={styles.panel}><PanelHeader title={title} /><div className={styles.chart}><ResponsiveContainer width="100%" height="100%"><AreaChart data={data}><CartesianGrid stroke="#e4eaf0" vertical={false} /><XAxis dataKey="day" tick={{ fontSize: 9, fill: '#718598' }} /><YAxis tickFormatter={(value) => `${value}${suffix}`} tick={{ fontSize: 9, fill: '#718598' }} /><Tooltip formatter={(value) => `${value}${suffix}`} /><Area type="monotone" dataKey={dataKey} stroke={color} fill={`${color}33`} strokeWidth={2} /></AreaChart></ResponsiveContainer></div></section>
)

export default ProjectDetails