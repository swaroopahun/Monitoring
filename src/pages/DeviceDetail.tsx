import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Badge from '@/components/Badge/Badge'
import { formatLiveTimestamp, getStatusTone, useMonitoring } from '@/services/monitoringData'
import styles from './DeviceDetail.module.css'

type TimeRange = 'Last 7 Days' | 'Last 30 Days' | 'Last 90 Days'

const DeviceDetail = () => {
  const { deviceId } = useParams<{ deviceId: string }>()
  const navigate = useNavigate()
  const { devices, projects, alarms, batteries } = useMonitoring()
  const [timeRange, setTimeRange] = useState<TimeRange>('Last 7 Days')
  const device = devices.find((item) => item.id === deviceId) ?? devices[0]
  const project = projects.find((item) => item.id === device.projectId)
  const battery = batteries.find((item) => item.associatedDevice === device.id)
  const deviceAlarms = alarms.filter((item) => item.deviceId === device.id)
  const isOffline = device.status === 'offline'

  const trend = useMemo(() => {
    const count = timeRange === 'Last 7 Days' ? 7 : timeRange === 'Last 30 Days' ? 15 : 30
    const baseSoc = battery?.soc ?? Math.max(12, Math.min(98, Math.round(100 - device.temperature)))
    return Array.from({ length: count }, (_, index) => {
      const variation = Math.sin(index * 0.8 + device.id.length) * 3
      return {
        label: timeRange === 'Last 7 Days' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index] : `${index + 1}`,
        soc: Math.max(0, Math.min(100, Math.round(baseSoc + variation))),
        temperature: Number((device.temperature + Math.sin(index * 0.55) * 3).toFixed(1)),
        voltage: Math.round(device.voltage + Math.sin(index * 0.65) * 12),
        current: Math.round(device.current + Math.cos(index * 0.5) * 9),
      }
    })
  }, [battery?.soc, device.current, device.id, device.temperature, device.voltage, timeRange])

  const exportDeviceData = () => {
    const rows = [
      ['Time', 'State of Charge (%)', 'Temperature (°C)', 'Voltage (V)', 'Current (A)'],
      ...trend.map((point) => [point.label, point.soc, point.temperature, point.voltage, point.current]),
    ]
    const blob = new Blob([rows.map((row) => row.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${device.id}-telemetry.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const lastCommunication = device.lastCommunication
  return (
    <div className={styles.detail}>
      <div className={styles.breadcrumbs}>
        <button type="button" onClick={() => navigate('/projects')}>Projects</button><span>/</span>
        {project && <><button type="button" onClick={() => navigate(`/project-details/${project.id}`)}>{project.name}</button><span>/</span></>}
        <strong>{device.id}</strong>
      </div>

      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>LIVE · Last communication: {formatLiveTimestamp(lastCommunication)}</div>
          <h1>{device.id}</h1>
          <p>{device.type} · {project?.name ?? 'Unknown project'} · {device.communication}</p>
        </div>
        <Badge variant={getStatusTone(device.status)}>{device.status}</Badge>
      </header>

      <section className={styles.statusGrid} aria-label="Current device readings">
        <Metric label="Status" value={device.status} detail={`Communication: ${device.communication}`} />
        <Metric label="Battery SoC" value={battery ? `${battery.soc}%` : 'N/A'} detail={battery ? `SoH ${battery.soh}%` : 'No battery assigned'} />
        <Metric label="Connectivity" value={device.communication} detail={`Last sync ${formatLiveTimestamp(lastCommunication)}`} />
      </section>

      <section className={styles.infoGrid}>
        <article className={styles.panel}>
          <h2>More Information</h2>
          <DetailRow label="Project" value={project?.name ?? '—'} />
          <DetailRow label="Location" value={project?.location ?? '—'} />
          <DetailRow label="Device Type" value={device.type} />
          <DetailRow label="Serial Number" value={`SPC${device.id.replace(/\D/g, '').padStart(8, '0')}`} />
          <DetailRow label="Firmware" value={`v${2 + (device.id.length % 2)}.${device.id.length}.${device.temperature.toFixed(0)}`} />
          <DetailRow label="Supplier" value={project?.supplier ?? '—'} />
        </article>
        <article className={styles.panel}>
          <h2>Current Readings</h2>
          <DetailRow label="Voltage" value={`${device.voltage} V`} />
          <DetailRow label="Current" value={`${device.current} A`} />
          <DetailRow label="Temperature" value={`${device.temperature} °C`} warning={device.temperature >= 38} />
          <DetailRow label="Battery SoH" value={battery ? `${battery.soh}%` : 'N/A'} />
          <DetailRow label="Battery SoC" value={battery ? `${battery.soc}%` : 'N/A'} />
          <DetailRow label="Last Updated" value={formatLiveTimestamp(lastCommunication)} />
        </article>
      </section>

      <section className={styles.chartSection}>
        <div className={styles.chartSectionHeader}>
          <h2>Device Telemetry</h2>
          <div className={styles.controls}>
            <label>Time range<select value={timeRange} onChange={(event) => setTimeRange(event.target.value as TimeRange)}><option>Last 7 Days</option><option>Last 30 Days</option><option>Last 90 Days</option></select></label>
            <button type="button" className={styles.action} onClick={exportDeviceData}>Export CSV</button>
          </div>
        </div>
        <div className={styles.chartsGrid}>
          <TelemetryChart title="Battery SOC" data={trend} dataKey="soc" color="#3987f5" suffix="%" />
          <TelemetryChart title="Temperature Trend" data={trend} dataKey="temperature" color="#ffb400" suffix="°C" />
          <TelemetryChart title="Voltage Trend" data={trend} dataKey="voltage" color="#20c366" suffix=" V" />
          <TelemetryChart title="Current Trend" data={trend} dataKey="current" color="#c82de4" suffix=" A" />
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}><h2>Alarm History</h2><span>{deviceAlarms.filter((alarm) => alarm.status !== 'resolved').length} Active Alarms</span></div>
        {deviceAlarms.length ? <div className={styles.tableWrap}>
          <table><thead><tr><th>Timestamp</th><th>Severity</th><th>Description</th><th>Status</th></tr></thead>
            <tbody>{deviceAlarms.map((alarm) => <tr key={alarm.id}><td>{formatLiveTimestamp(alarm.startedAt)}</td><td><Badge variant={getStatusTone(alarm.severity)}>{alarm.severity}</Badge></td><td>{alarm.title}</td><td>{alarm.status}</td></tr>)}</tbody>
          </table>
        </div> : <div className={styles.emptyState}>{isOffline ? 'No alarm history is available for this device.' : 'No recent alarms for this device.'}</div>}
      </section>
    </div>
  )
}

const Metric = ({ label, value, detail }: { label: string; value: string; detail: string }) => <article className={styles.metric}><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>

const DetailRow = ({ label, value, warning = false }: { label: string; value: string; warning?: boolean }) => <div className={styles.detailRow}><span>{label}</span><strong className={warning ? styles.warning : ''}>{value}</strong></div>

const TelemetryChart = ({ title, data, dataKey, color, suffix }: { title: string; data: { label: string; soc: number; temperature: number; voltage: number; current: number }[]; dataKey: 'soc' | 'temperature' | 'voltage' | 'current'; color: string; suffix: string }) => (
  <article className={styles.chartCard}>
    <h3>{title}</h3>
    <div className={styles.chart}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
          <CartesianGrid stroke="#e4eaf0" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#8a9cac' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 9, fill: '#718598' }} tickLine={false} axisLine={false} />
          <Tooltip formatter={(value) => `${value}${suffix}`} />
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={`${color}2b`} strokeWidth={2} />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ r: 2, fill: color }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </article>
)

export default DeviceDetail