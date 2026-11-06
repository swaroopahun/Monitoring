import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CartesianGrid, Line, LineChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatLiveTimestamp, useMonitoring } from '@/services/monitoringData'
import styles from './DeviceDetail.module.css'

type TimeRange = 'Last 7 Days' | 'Last 30 Days' | 'Last 90 Days'
type DetailTab = 'alarm' | 'battery'

const DeviceDetail = () => {
  const { deviceId } = useParams<{ deviceId: string }>()
  const navigate = useNavigate()
  const { devices, projects, alarms, batteries, lastUpdated } = useMonitoring()
  const [timeRange, setTimeRange] = useState<TimeRange>('Last 7 Days')
  const [activeTab, setActiveTab] = useState<DetailTab>('alarm')

  const device = devices.find((item) => item.id === deviceId) ?? devices[0]
  const project = projects.find((item) => item.id === device.projectId)
  const battery = batteries.find((item) => item.associatedDevice === device.id)
  const deviceAlarms = alarms.filter((item) => item.deviceId === device.id)
  const currentAlarm = deviceAlarms.find((item) => item.status !== 'resolved') ?? deviceAlarms[0]
  const isOffline = device.status === 'offline' || device.communication === 'Lost'
  const statusText = isOffline ? 'Disabled' : device.status === 'warning' ? 'Warning' : 'Enabled'
  const communicationText = device.communication === 'Lost' ? 'No Communication' : `${device.communication} Communication`
  const bindingPercent = project?.blindingPercent ?? 0
  const capacity = battery ? Math.max(100, Math.round(battery.voltage * 5.55)) : 300
  const charge = battery?.soc ?? Math.max(0, Math.min(100, Math.round(100 - device.temperature * 1.8)))
  const trackerAngle = -20.9 + (device.id.length % 8) * 0.3
  const targetAngle = 16.9
  const positionDifference = Math.abs(trackerAngle - targetAngle).toFixed(1)

  const graphData = useMemo(() => {
    const pointCount = timeRange === 'Last 7 Days' ? 24 : timeRange === 'Last 30 Days' ? 30 : 36
    const points = Array.from({ length: pointCount }, (_, index) => ({
      index,
      label: timeRange === 'Last 7 Days'
        ? `${String((15 + index) % 24).padStart(2, '0')}:00`
        : `${index + 1}`,
      alarm: currentAlarm ? (index >= Math.max(0, pointCount - 16) ? 1 : 0) : 0,
    }))
    return points
  }, [currentAlarm, timeRange])

  const exportGraph = () => {
    const rows = [
      ['Time', activeTab === 'alarm' ? 'Alarm count' : 'Battery SoC (%)'],
      ...graphData.map((point) => [point.label, activeTab === 'alarm' ? point.alarm : (battery?.soc ?? charge)]),
    ]
    const csv = rows.map((row) => row.join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${device.id}-${activeTab}-history.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.detail}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <button type="button" onClick={() => navigate('/projects')}>Projects</button>
        <span>/</span>
        {project && <><button type="button" onClick={() => navigate(`/project-details/${project.id}`)}>{project.name}</button><span>/</span></>}
        <strong>{device.id}</strong>
      </nav>

      <header className={styles.header}>
        <div className={styles.titleLine}>
          <h1>{device.id}</h1>
          <span className={`${styles.statusBadge} ${isOffline ? styles.statusDisabled : device.status === 'warning' ? styles.statusWarning : styles.statusEnabled}`}>
            <i />{statusText}
          </span>
          <span className={styles.communication}><i />{communicationText}</span>
        </div>
        <div className={styles.liveStatus}><span><i />Live</span><small>Last Updated: {formatLiveTimestamp(lastUpdated)}</small><button type="button" title="Refresh device data" aria-label="Refresh device data" onClick={() => window.location.reload()}>⟳</button></div>
      </header>

      <section className={styles.topCards}>
        <article className={styles.panel}>
          <h2>Tracker Position</h2>
          <div className={styles.trackerPanel}>
            <TrackerDiagram angle={trackerAngle} />
            <div className={styles.positionStats}>
              <Reading label="Current Position" value={`${trackerAngle.toFixed(3)}°`} />
              <Reading label="Target Position" value={`${targetAngle.toFixed(3)}°`} />
              <Reading label="Difference" value={`${positionDifference}°`} />
              <Reading label="Current Movement" value={device.status === 'online' ? 'Tracking' : '—'} />
            </div>
          </div>
        </article>

        <article className={styles.panel}>
          <h2>Position of the Sun</h2>
          <div className={styles.sunPanel}>
            <SunCompass azimuth={(project?.lng ?? 0) + 180} />
            <div className={styles.sunStats}>
              <Reading label="Sunrise Time" value="06:12" />
              <Reading label="Sunset Time" value="19:48" />
              <Reading label="Current Sun Position" value={`${(35 + Math.abs(project?.lat ?? 0) / 4).toFixed(2)}°`} />
              <Reading label="Current Height of the Sun" value={`${Math.max(0, 60 - Math.abs(project?.lat ?? 0) / 2).toFixed(0)}°`} />
            </div>
          </div>
        </article>

        <article className={`${styles.panel} ${styles.moreInfo}`}>
          <h2>More Information</h2>
          <div className={styles.infoGrid}>
            <Reading label="Type" value={device.type} />
            <Reading label="Communication" value="Zigbee" />
            <Reading label="Supplier" value={project?.supplier ?? '—'} />
          </div>
        </article>
      </section>

      <section className={styles.bottomGrid}>
        <article className={`${styles.panel} ${styles.historyPanel}`}>
          <div className={styles.historyTop}>
            <div className={styles.tabs} role="tablist" aria-label="Device history views">
              <button type="button" role="tab" aria-selected={activeTab === 'alarm'} className={activeTab === 'alarm' ? styles.tabActive : ''} onClick={() => setActiveTab('alarm')}>Alarm</button>
              <button type="button" role="tab" aria-selected={activeTab === 'battery'} className={activeTab === 'battery' ? styles.tabActive : ''} onClick={() => setActiveTab('battery')}>Battery</button>
            </div>
            <label className={styles.rangeSelect}><span>◷</span><span>Time Range<select value={timeRange} onChange={(event) => setTimeRange(event.target.value as TimeRange)}><option>Last 7 Days</option><option>Last 30 Days</option><option>Last 90 Days</option></select></span></label>
          </div>

          {activeTab === 'alarm' ? (
            <div className={styles.historyContent}>
              <div className={styles.recordedAlarms}>
                <h3>Current Recorded Alarms</h3>
                {currentAlarm ? <div className={styles.alarmRow}>
                  <span className={`${styles.alarmIndicator} ${styles[`severity${currentAlarm.severity}`]}`} />
                  <span>{device.id} {currentAlarm.title}</span>
                  <time>{formatLiveTimestamp(currentAlarm.startedAt)}</time>
                </div> : <p className={styles.noAlarm}>No active alarms recorded for this device.</p>}
                <button type="button" className={styles.downloadButton} onClick={exportGraph}>Download Graph</button>
              </div>
              <HistoryChart data={graphData} label="Alarms" color="#ff5368" empty={!currentAlarm} />
            </div>
          ) : (
            <div className={styles.historyContent}>
              <div className={styles.recordedAlarms}>
                <h3>Battery Readings</h3>
                {battery ? <>
                  <Reading label="State of Charge" value={`${battery.soc}%`} />
                  <Reading label="State of Health" value={`${battery.soh}%`} />
                  <Reading label="Temperature" value={`${battery.temperature}°C`} />
                </> : <p className={styles.noAlarm}>No battery is associated with this device.</p>}
                <button type="button" className={styles.downloadButton} onClick={exportGraph}>Download Graph</button>
              </div>
              <HistoryChart data={graphData} label="State of Charge (%)" color="#3987f5" value={battery?.soc ?? charge} empty={!battery} />
            </div>
          )}
        </article>

        <div className={styles.sideCards}>
          <article className={styles.panel}>
            <h2>Status</h2>
            <div className={styles.statusInfo}>
              <Reading label="Status" value={statusText} />
              <Reading label="Binding Percentage" value={`${bindingPercent}%`} />
            </div>
          </article>
          <article className={`${styles.panel} ${styles.powerPanel}`}>
            <h2>Power</h2>
            <div className={styles.powerGrid}>
              <PowerReading icon="▣" label="Charge" value={`${charge}%`} />
              <PowerReading icon="▱" label="Capacity" value={`${capacity} Ah`} />
              <PowerReading icon="▲" label="Voltage" value={`${battery?.voltage ?? device.voltage} V`} />
              <PowerReading icon="◉" label="Current" value={`${battery?.current ?? device.current} mA`} />
            </div>
          </article>
        </div>
      </section>

      <footer className={styles.footer}>©2009-2026, Array Technologies, Inc. All Rights Reserved.</footer>
    </div>
  )
}

const Reading = ({ label, value }: { label: string; value: string }) => <div className={styles.reading}><span>{label}</span><strong>{value}</strong></div>

const PowerReading = ({ icon, label, value }: { icon: string; label: string; value: string }) => <div className={styles.powerReading}><span className={styles.powerIcon}>{icon}</span><div><span>{label}</span><strong>{value}</strong></div></div>

const TrackerDiagram = ({ angle }: { angle: number }) => (
  <svg className={styles.trackerDiagram} viewBox="0 0 220 170" role="img" aria-label={`Tracker position diagram at ${angle.toFixed(1)} degrees`}>
    <line x1="110" y1="74" x2="110" y2="153" stroke="#bdcbd5" strokeWidth="5" />
    <line x1="103" y1="153" x2="117" y2="153" stroke="#bdcbd5" strokeWidth="4" />
    <line x1="36" y1="55" x2="181" y2="107" stroke="#4b8ee9" strokeWidth="6" />
    <line x1="50" y1="111" x2="172" y2="75" stroke="#ff5368" strokeWidth="2" strokeDasharray="5 4" />
    <line x1="110" y1="80" x2="89" y2="10" stroke="#ff5368" strokeWidth="2" />
    <circle cx="110" cy="80" r="8" fill="#073454" />
    <circle cx="110" cy="80" r="3" fill="#fff" />
    <text x="19" y="94" className={styles.compassLabel}>W</text>
    <text x="187" y="94" className={styles.compassLabel}>E</text>
  </svg>
)

const SunCompass = ({ azimuth }: { azimuth: number }) => {
  const angle = ((azimuth % 360) * Math.PI) / 180
  const x = 70 + Math.sin(angle) * 49
  const y = 70 - Math.cos(angle) * 49
  return (
    <svg className={styles.sunCompass} viewBox="0 0 140 140" role="img" aria-label={`Sun compass, azimuth ${Math.round(azimuth % 360)} degrees`}>
      <circle cx="70" cy="70" r="55" fill="#fff" stroke="#dce4eb" strokeWidth="1.5" />
      <circle cx="70" cy="70" r="21" fill="#073454" />
      <path d="M70 58c-7 0-12 5-12 11 0 8 12 18 12 18s12-10 12-18c0-6-5-11-12-11zm0 15a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" fill="#fff" />
      <text x="70" y="10" textAnchor="middle" className={styles.northLabel}>N</text>
      <text x="130" y="74" textAnchor="middle" className={styles.compassLabel}>E</text>
      <text x="70" y="137" textAnchor="middle" className={styles.compassLabel}>S</text>
      <text x="10" y="74" textAnchor="middle" className={styles.compassLabel}>W</text>
      <circle cx={x} cy={y} r="6" fill="#ffb400" stroke="#fff" strokeWidth="2" />
    </svg>
  )
}

const HistoryChart = ({ data, label, color, value, empty }: { data: { index: number; label: string; alarm: number }[]; label: string; color: string; value?: number; empty: boolean }) => {
  const plotData = data.map((point) => ({ ...point, reading: value ?? point.alarm }))
  return (
    <div className={styles.chartArea}>
      <h3>{label === 'Alarms' ? 'Alarm History' : 'Battery History'}</h3>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={plotData} margin={{ top: 10, right: 8, bottom: 10, left: 0 }}>
            <CartesianGrid stroke="#e8edf2" vertical />
            <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#8294a2' }} tickLine={false} axisLine={{ stroke: '#cbd5de' }} interval="preserveStartEnd" />
            <YAxis domain={label === 'Alarms' ? [0, 1] : [0, 100]} ticks={label === 'Alarms' ? [0, 1] : [0, 25, 50, 75, 100]} tick={{ fontSize: 9, fill: '#8294a2' }} tickLine={false} axisLine={false} width={28} />
            <Tooltip formatter={(reading) => [reading, label]} labelFormatter={(time) => `${time} UTC`} />
            {!empty && <Line type="stepAfter" dataKey="reading" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />}
            {!empty && value === undefined && <ReferenceDot x={plotData[plotData.length - 1]?.label} y={1} r={5} fill={color} stroke="#fff" strokeWidth={2} />}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.axisCaption}>{label === 'Alarms' ? 'Time UTC' : 'Time range'}</div>
    </div>
  )
}

export default DeviceDetail