import { useMemo, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, Line, LineChart, Pie, PieChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useMonitoring } from '@/services/monitoringData'
import styles from './Battery.module.css'

type Timeframe = 'Last 24 Hours' | 'Last 7 Days' | 'Last 30 Days' | 'Custom Range'
type Detail = { id: string; soc: number; health: number; alarm: string; alarmTone: 'red' | 'amber' | 'gray'; project: string }

const details: Detail[] = [
  { id: 'T_1_01', soc: 78, health: 90, alarm: 'Low Voltage, Offline', alarmTone: 'gray', project: 'Chandler' },
  { id: 'T_1_02', soc: 22, health: 20, alarm: 'High Temp', alarmTone: 'red', project: 'Chandler' },
  { id: 'T_1_03', soc: 64, health: 70, alarm: 'Offline', alarmTone: 'gray', project: 'Mesa' },
  { id: 'T_1_04', soc: 5, health: 20, alarm: 'High Temp', alarmTone: 'red', project: 'Tempe' },
  { id: 'T_1_05', soc: 7, health: 25, alarm: 'Low Voltage', alarmTone: 'amber', project: 'Chandler' },
  { id: 'T_2_01', soc: 82, health: 93, alarm: 'Normal', alarmTone: 'gray', project: 'Mesa' },
  { id: 'T_2_02', soc: 47, health: 54, alarm: 'Low Voltage', alarmTone: 'amber', project: 'Tempe' },
]
const timeframes: Timeframe[] = ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Custom Range']
const projects = ['Chandler', 'Mesa', 'Tempe']
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const Battery = () => {
  const { batteries } = useMonitoring()
  const [timeframe, setTimeframe] = useState<Timeframe>('Last 7 Days')
  const [project, setProject] = useState('Chandler')
  const [selectedTracker, setSelectedTracker] = useState<Detail | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [healthFilter, setHealthFilter] = useState('All')
  const [alarmFilter, setAlarmFilter] = useState('All')
  const [socRange, setSocRange] = useState('All')
  const [page, setPage] = useState(1)
  const liveOffset = Math.round(batteries.reduce((total, battery) => total + battery.soc, 0) / batteries.length) - 70
  const periodFactor = timeframe === 'Last 24 Hours' ? 0.55 : timeframe === 'Last 30 Days' ? 1.45 : timeframe === 'Custom Range' ? 0.8 : 1
  const projectOffset = projects.indexOf(project) * 2
  const labels = timeframe === 'Last 24 Hours' ? ['00', '04', '08', '12', '16', '20', '24'] : timeframe === 'Last 30 Days' ? ['1', '5', '10', '15', '20', '25', '30'] : days
  const socChart = useMemo(() => labels.map((label, index) => {
    const slope = [-1, -2, -3, -4, -3, -2, -1][index] * periodFactor
    const average = 72 + projectOffset / 2 + liveOffset / 5 + slope
    return { label, minimum: 57 + (index % 3) * 2, range: Math.round(average - 8), average: Math.round(average) }
  }), [labels, liveOffset, periodFactor, projectOffset])
  const temperatureData = [['-10 to -5', 0, '#d9e3eb'], ['-5 to 0', 0, '#d9e3eb'], ['0 to 5', .3, '#d9e3eb'], ['5 to 10', 1.5, '#d9e3eb'], ['10 to 15', 7.4, '#80dca5'], ['15 to 20', 20.2, '#80dca5'], ['20 to 25', 35.4, '#64d68f'], ['25 to 30', 28.1, '#64d68f'], ['30 to 35', 7.7, '#ffe274'], ['35 to 40', 1.6, '#ffe274'], ['40 to 45', 0, '#fbd4d4']].map(([range, percent, color]) => ({ range: String(range), percent: Number(percent), color: String(color) }))
  const filteredDetails = details.filter((detail) => detail.id.toLowerCase().includes(search.toLowerCase()) && detail.project === project && (healthFilter === 'All' || (healthFilter === 'Healthy' ? detail.health >= 70 : detail.health < 70)) && (alarmFilter === 'All' || detail.alarm.includes(alarmFilter)) && (socRange === 'All' || (socRange === 'High' ? detail.soc >= 50 : detail.soc < 50)))
  const tableRows = filteredDetails.slice((page - 1) * 5, page * 5)
  const operational = 900 + Math.round(liveOffset * 2)
  const withAlarms = 120 + Math.max(0, Math.round(liveOffset / 2))
  const down = 70 + Math.max(0, -liveOffset)

  return <div className={styles.page}>
    <div className={styles.pageTop}><h1>Batteries Overview</h1><div className={styles.topFilters}><SelectField label="Select Timeframe" value={timeframe} onChange={(value) => setTimeframe(value as Timeframe)} options={timeframes} /><SelectField label="Select Project" value={project} onChange={setProject} options={projects} /></div></div>
    <section className={styles.overviewGrid}>
      <div className={styles.kpiStack}><KpiCard label="Total Batteries" value={`${1200 + liveOffset}`} /><KpiCard label="Operational" value={`${operational}`} side={<><span className={styles.danger}>{down}</span><small>down</small><span className={styles.warning}>{withAlarms}</span><small>with alarms</small></>} /></div>
      <div className={styles.kpiStack}><div className={styles.metricCard}><span>Battery Size Count</span><div className={styles.sizeCount}><strong>170<small>3AH</small></strong><strong>30<small>6AH</small></strong></div></div><KpiCard label="Avg. State of Charge" value={`${76 + Math.round(liveOffset / 8)}%`} /></div>
      <section className={`${styles.panel} ${styles.socPanel}`}><PanelTitle title={`State of Charge - ${timeframe}`} right={<div className={styles.chartStats}><b>Max SoC: 75%</b><span>Avg SoC: 70%</span><i>Min SoC: 57%</i></div>} /><div className={styles.socChart}><ResponsiveContainer width="100%" height="100%"><AreaChart data={socChart} margin={{ top: 6, right: 44, bottom: 0, left: -18 }}><CartesianGrid stroke="#edf1f4" vertical={false} /><XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 8, fill: '#748292' }} /><YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} tick={{ fontSize: 8, fill: '#748292' }} /><Tooltip contentStyle={{ fontSize: 10, borderColor: '#dce5ed' }} /><ReferenceLine y={75} stroke="#52b970" strokeDasharray="3 3" label={{ value: 'High', fontSize: 8, fill: '#667' }} /><ReferenceLine y={50} stroke="#e5a429" strokeDasharray="4 3" label={{ value: 'Med', fontSize: 8, fill: '#667' }} /><ReferenceLine y={25} stroke="#e95454" strokeDasharray="4 3" label={{ value: 'Critical', fontSize: 8, fill: '#667' }} /><Area type="monotone" dataKey="minimum" name="Min SOC" stroke="#72a8f6" fill="#eff7ff" strokeWidth={1.5} /><Area type="monotone" dataKey="range" name="SOC Range" stroke="#8edfa8" fill="#d9f5e1" fillOpacity={.8} strokeWidth={1} /><Line type="monotone" dataKey="average" name="Average SOC" stroke="#35bd67" strokeWidth={2} dot={{ r: 2, fill: '#35bd67' }} /><Legend verticalAlign="bottom" height={18} iconType="circle" wrapperStyle={{ fontSize: 8 }} /></AreaChart></ResponsiveContainer></div></section>
    </section>
    <section className={styles.detailsGrid}>
      <section className={`${styles.panel} ${styles.healthPanel}`}><PanelTitle title="Battery Health Distribution" /><DonutChart data={[{ name: 'Healthy', value: 61, color: '#20bf64' }, { name: 'Warning', value: 24, color: '#ff9d11' }, { name: 'Critical', value: 9, color: '#f04444' }, { name: 'Offline', value: 6, color: '#b7c0ca' }]} center="61%" caption="Healthy" /></section>
      <section className={`${styles.panel} ${styles.tablePanel}`}><div className={styles.tableHeader}><PanelTitle title="Battery Details" /><button className={styles.filterButton} aria-label="Filter battery details" onClick={() => setFilterOpen((open) => !open)}>≡</button></div>{filterOpen && <div className={styles.filterBar}><input aria-label="Search tracker ID" placeholder="Search Tracker ID" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} /><select aria-label="Filter health status" value={healthFilter} onChange={(event) => { setHealthFilter(event.target.value); setPage(1) }}><option>All</option><option>Healthy</option><option>Attention</option></select><select aria-label="Filter alarm status" value={alarmFilter} onChange={(event) => { setAlarmFilter(event.target.value); setPage(1) }}><option>All</option><option>High Temp</option><option>Low Voltage</option><option>Offline</option></select><select aria-label="Filter state of charge" value={socRange} onChange={(event) => { setSocRange(event.target.value); setPage(1) }}><option>All</option><option>High</option><option>Low</option></select></div>}<div className={styles.tableWrap}><table><thead><tr><th>Tracker ID</th><th>SoC (%)</th><th>Health Status</th><th>Alarms</th></tr></thead><tbody>{tableRows.map((detail) => <tr key={detail.id}><td><button className={styles.trackerLink} onClick={() => setSelectedTracker(detail)}>{detail.id}</button></td><td><span className={`${styles.socBadge} ${detail.soc < 15 ? styles.socDanger : detail.soc < 40 ? styles.socWarning : ''}`}>{detail.soc}%</span></td><td>{detail.health}%</td><td><span className={`${styles.alarmDot} ${styles[detail.alarmTone]}`} />{detail.alarm}</td></tr>)}{tableRows.length === 0 && <tr><td colSpan={4} className={styles.emptyRow}>No batteries match these filters.</td></tr>}</tbody></table></div><Pagination page={page} onChange={setPage} /></section>
    </section>
    <section className={styles.bottomGrid}><section className={`${styles.panel} ${styles.histogramPanel}`}><PanelTitle title="Battery Temperature Histogram" /><div className={styles.histogram}><ResponsiveContainer width="100%" height="100%"><BarChart data={temperatureData} margin={{ top: 22, right: 10, bottom: 4, left: 0 }} barSize={23}><CartesianGrid stroke="#edf1f4" vertical={false} /><XAxis dataKey="range" tickLine={false} axisLine={false} interval={0} tick={{ fontSize: 7, fill: '#748292' }} /><YAxis tickLine={false} axisLine={false} tick={{ fontSize: 8, fill: '#748292' }} label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fontSize: 8, fill: '#748292' }} /><Tooltip formatter={(value) => `${value}%`} /><Bar dataKey="percent" radius={[2, 2, 0, 0]}>{temperatureData.map((item) => <Cell key={item.range} fill={item.color} />)}<LabelList dataKey="percent" position="top" formatter={(value: number) => value ? `${value}%` : ''} style={{ fontSize: 7, fill: '#80909f' }} /></Bar></BarChart></ResponsiveContainer></div><div className={styles.axisLabel}>Temperature (°C)</div></section><section className={`${styles.panel} ${styles.distributionPanel}`}><PanelTitle title="Battery SoC Distribution" /><DonutChart data={[{ name: 'High (80-100%)', value: 52, color: '#20bf64' }, { name: 'Medium (50-79%)', value: 30, color: '#3f7ee8' }, { name: 'Low (20-49%)', value: 14, color: '#ffae13' }, { name: 'Critical (0-19%)', value: 4, color: '#f04444' }]} center="52%" caption="High SoC" /></section></section>
    <footer>©2009-2026, Array Technologies, Inc. All Rights Reserved.</footer>
    {selectedTracker && <TelemetryModal tracker={selectedTracker} timeframe={timeframe} onClose={() => setSelectedTracker(null)} />}
  </div>
}
const SelectField = ({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: readonly string[] }) => <label className={styles.selectField}><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>
const KpiCard = ({ label, value, side }: { label: string; value: string; side?: React.ReactNode }) => <div className={styles.metricCard}><span>{label}</span><div className={styles.kpiContent}><strong>{value}</strong>{side && <div className={styles.kpiSide}>{side}</div>}</div></div>
const PanelTitle = ({ title, right }: { title: string; right?: React.ReactNode }) => <div className={styles.panelTitle}><h2>{title}</h2>{right}</div>
const DonutChart = ({ data, center, caption }: { data: { name: string; value: number; color: string }[]; center: string; caption: string }) => <div className={styles.donut}><div className={styles.donutVisual}><ResponsiveContainer width="100%" height="100%"><PieChart margin={{ top: 20, right: 28, bottom: 4, left: 4 }}><Pie data={data} dataKey="value" nameKey="name" innerRadius="57%" outerRadius="76%" paddingAngle={2}>{data.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip position={{ x: 8, y: 2 }} wrapperStyle={{ zIndex: 2, pointerEvents: 'none' }} contentStyle={{ border: '1px solid #d8e2ea', borderRadius: 3, padding: '4px 6px', fontSize: 9, boxShadow: '0 2px 6px rgb(15 36 56 / 12%)' }} /></PieChart></ResponsiveContainer><div className={styles.donutCenter}><strong>{center}</strong><span>{caption}</span></div></div><div className={styles.donutLegend}>{data.map((item) => <span key={item.name}><i style={{ background: item.color }} />{item.name}</span>)}</div></div>
const Pagination = ({ page, onChange }: { page: number; onChange: (page: number) => void }) => <div className={styles.pagination}><button aria-label="Previous page" onClick={() => onChange(Math.max(1, page - 1))}>‹</button>{[1, 2].map((item) => <button key={item} className={page === item ? styles.pageActive : ''} onClick={() => onChange(item)}>{item}</button>)}<span>...</span>{[9, 10].map((item) => <button key={item} className={page === item ? styles.pageActive : ''} onClick={() => onChange(item)}>{item}</button>)}<button aria-label="Next page" onClick={() => onChange(Math.min(10, page + 1))}>›</button></div>
const TelemetryModal = ({ tracker, timeframe, onClose }: { tracker: Detail; timeframe: Timeframe; onClose: () => void }) => { const data = days.map((day, index) => ({ day, soc: tracker.soc + [1, 0, -2, -1, 0, 1, 0][index], health: tracker.health + [1, 1, 0, 0, -1, -1, -1][index], temperature: 27 + index * 1.6 + (tracker.soc < 30 ? 7 : 0), voltage: 52 + [0, -1, 2, 1, 0, -2, -1][index], current: 72 + [3, 7, 13, 11, 8, 5, 3][index] })); return <div className={styles.modalBackdrop} onMouseDown={onClose}><section className={styles.telemetryModal} role="dialog" aria-modal="true" aria-labelledby="telemetry-title" onMouseDown={(event) => event.stopPropagation()}><header><div><h2 id="telemetry-title">Battery Telemetry</h2><p><strong>{tracker.id}</strong><span className={`${styles.alarmDot} ${styles[tracker.alarmTone]}`} />{tracker.alarm}</p><small>{timeframe}</small></div><button aria-label="Close telemetry" onClick={onClose}>×</button></header><div className={styles.telemetryGrid}><Telemetry title="State of Charge (SoC)" data={data} line="soc" color="#4388f5" suffix="%" /><Telemetry title="State of Health (SoH)" data={data} line="health" color="#20bf64" suffix="%" /><Telemetry title="Temperature" data={data} line="temperature" color="#f4a522" suffix="°C" /><Telemetry title="Voltage & Current" data={data} line="voltage" second="current" color="#8966e8" suffix="V" /></div></section></div> }
const Telemetry = ({ title, data, line, second, color, suffix }: { title: string; data: Record<string, number | string>[]; line: string; second?: string; color: string; suffix: string }) => <article className={styles.telemetry}><h3>{title}</h3><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 10, right: 4, bottom: 0, left: -20 }}><CartesianGrid stroke="#edf1f4" vertical={false} /><XAxis dataKey="day" tick={{ fontSize: 8 }} tickLine={false} axisLine={false} /><YAxis tick={{ fontSize: 8 }} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}${suffix}`} /><Tooltip /><Line type="monotone" dataKey={line} stroke={color} strokeWidth={2} dot={false} />{second && <Line type="monotone" dataKey={second} stroke="#fa5960" strokeWidth={2} dot={false} />}</LineChart></ResponsiveContainer></article>
export default Battery
/* Legacy component retained by an earlier partial patch; do not compile.
import Card from '@/components/Card/Card'
import Badge from '@/components/Badge/Badge'
import Button from '@/components/Button/Button'
import { formatLiveTimestamp, getStatusTone, useMonitoring } from '@/services/monitoringData'
import { useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import styles from './Battery.module.css'

const Battery = () => {
  const { batteries, lastUpdated } = useMonitoring()
  const [selectedBatteryId, setSelectedBatteryId] = useState<string | null>(null)
  const selectedBattery = batteries.find((battery) => battery.id === selectedBatteryId)

  const healthy = batteries.filter((item) => item.status === 'online').length
  const warning = batteries.filter((item) => item.status === 'warning').length
  const critical = batteries.filter((item) => item.status === 'offline').length
  const avgSoc = (batteries.reduce((sum, item) => sum + item.soc, 0) / batteries.length).toFixed(0)
  const avgSoh = (batteries.reduce((sum, item) => sum + item.soh, 0) / batteries.length).toFixed(0)
  const highTemp = batteries.filter((item) => item.temperature > 35).length

  const summary = { healthy, warning, critical, avgSoc, avgSoh, highTemp }

  const socTrend = [
    { day: 'Mon', value: 68 },
    { day: 'Tue', value: 71 },
    { day: 'Wed', value: 74 },
    { day: 'Thu', value: 73 },
    { day: 'Fri', value: 78 },
    { day: 'Sat', value: 81 },
    { day: 'Sun', value: 76 },
  ]

  const temperatureHistogram = [
    { range: '0-5', count: 0 },
    { range: '5-10', count: 2 },
    { range: '10-15', count: 8 },
    { range: '15-20', count: 14 },
    { range: '20-25', count: 22 },
    { range: '25-30', count: 20 },
    { range: '30-35', count: 18 },
    { range: '35-40', count: 9 },
    { range: '40-45', count: 3 },
  ]

  const healthDistribution = [
    { name: 'Healthy', value: 61, color: '#22c55e' },
    { name: 'Warning', value: 24, color: '#f59e0b' },
    { name: 'Critical', value: 9, color: '#ef4444' },
    { name: 'Offline', value: 6, color: '#a0aec0' },
  ]

  const telemetryTrend = Array.from({ length: 7 }, (_, index) => {
    const variation = [2, 1, -1, 0, 1, 2, 1][index]
    const battery = selectedBattery ?? batteries[0]

    return {
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
      soc: Math.max(0, battery.soc + variation),
      soh: Math.min(100, battery.soh + variation / 2),
      temperature: Number((battery.temperature + variation * 0.7).toFixed(1)),
      voltage: battery.voltage + variation * 4,
      current: Math.max(0, battery.current - variation * 3),
    }
  })

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <div className={styles.eyebrow}>LIVE • Last updated: {formatLiveTimestamp(lastUpdated)}</div>
          <h1>Battery Monitoring</h1>
        </div>
        <div className={styles.headerActions}>
          <Button variant="secondary" size="sm">Search Batteries</Button>
          <Button size="sm">Export Report</Button>
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <Card><div className={styles.kpi}><span>Total Batteries</span><strong>{batteries.length}</strong></div></Card>
        <Card><div className={styles.kpi}><span>Healthy</span><strong>{summary.healthy}</strong></div></Card>
        <Card><div className={styles.kpi}><span>Warning</span><strong>{summary.warning}</strong></div></Card>
        <Card><div className={styles.kpi}><span>Critical</span><strong>{summary.critical}</strong></div></Card>
        <Card><div className={styles.kpi}><span>Average SOC</span><strong>{summary.avgSoc}%</strong></div></Card>
        <Card><div className={styles.kpi}><span>Average SOH</span><strong>{summary.avgSoh}%</strong></div></Card>
        <Card><div className={styles.kpi}><span>High Temp</span><strong>{summary.highTemp}</strong></div></Card>
      </div>

      <div className={styles.chartRow}>
        <Card>
          <div className={styles.chartCard}>
            <h2>Battery Overview</h2>
            <div className={styles.chartBox}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={socTrend} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                  <CartesianGrid stroke="#dfeaf3" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#475467' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#475467' }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card>
          <div className={styles.chartCard}>
            <h2>Battery Health Distribution</h2>
            <div className={styles.pieBox}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={healthDistribution} dataKey="value" nameKey="name" innerRadius={44} outerRadius={72} paddingAngle={3}>
                    {healthDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className={styles.legendList}>
              {healthDistribution.map((item) => (
                <div key={item.name} className={styles.legendItem}>
                  <span className={styles.legendColor} style={{ background: item.color }} />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className={styles.bottomRow}>
        <Card>
          <div className={styles.sectionLabel}>Battery Temperature Histogram</div>
          <div className={styles.histogramBox}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={temperatureHistogram} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#dfeaf3" vertical={false} />
                <XAxis dataKey="range" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#475467' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#475467' }} />
                <Tooltip />
                <Bar dataKey="count" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className={styles.sectionLabel}>Battery Details</div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Tracker ID</th>
                  <th>SoC (%)</th>
                  <th>Health Status</th>
                  <th>Alarms</th>
                </tr>
              </thead>
              <tbody>
                {batteries.map((battery) => (
                  <tr key={battery.id}>
                    <td>
                      <button type="button" className={styles.trackerLink} onClick={() => setSelectedBatteryId(battery.id)}>
                        {battery.name}
                      </button>
                    </td>
                    <td>{battery.soc}%</td>
                    <td>
                      <Badge variant={getStatusTone(battery.status)}>{battery.status}</Badge>
                    </td>
                    <td>{battery.temperature > 35 ? 'High Temp' : 'Normal'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {selectedBattery && (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={() => setSelectedBatteryId(null)}>
          <section className={styles.telemetryModal} role="dialog" aria-modal="true" aria-labelledby="telemetry-title" onMouseDown={(event) => event.stopPropagation()}>
            <header className={styles.modalHeader}>
              <div>
                <h2 id="telemetry-title">Battery Telemetry</h2>
                <div className={styles.modalBatteryName}>
                  <strong>{selectedBattery.name}</strong>
                  <span className={styles.statusDot} data-status={selectedBattery.status} />
                  <span>{selectedBattery.temperature > 35 ? 'High Temp' : 'Normal operation'}</span>
                </div>
                <span className={styles.modalRange}>Last 7 Days</span>
              </div>
              <div className={styles.modalActions}>
                <label>
                  <span>Select Timeframe</span>
                  <select aria-label="Select telemetry timeframe" defaultValue="last-7-days">
                    <option value="last-24-hours">Last 24 Hours</option>
                    <option value="last-7-days">Last 7 Days</option>
                    <option value="last-30-days">Last 30 Days</option>
                  </select>
                </label>
                <button type="button" className={styles.closeButton} aria-label="Close telemetry" onClick={() => setSelectedBatteryId(null)}>x</button>
              </div>
            </header>

            <div className={styles.telemetryGrid}>
              <TelemetryChart title="State of Charge (SoC)" maximum="Max SoC" maximumValue={`${Math.max(...telemetryTrend.map((item) => item.soc))}%`} average="Avg SoC" averageValue={`${selectedBattery.soc}%`} minimum="Min SoC" minimumValue={`${Math.min(...telemetryTrend.map((item) => item.soc))}%`}>
                <AreaChart data={telemetryTrend}><CartesianGrid stroke="#e9eff5" vertical={false} /><XAxis dataKey="day" tickLine={false} axisLine={false} /><YAxis domain={[0, 100]} unit="%" tickLine={false} axisLine={false} /><Tooltip /><Area type="monotone" dataKey="soc" stroke="#4388f5" fill="#dceaff" strokeWidth={2} /></AreaChart>
              </TelemetryChart>
              <TelemetryChart title="State of Health (SoH)" maximum="Max SoH" maximumValue={`${Math.max(...telemetryTrend.map((item) => item.soh))}%`} average="Avg SoH" averageValue={`${selectedBattery.soh}%`} minimum="Min SoH" minimumValue={`${Math.min(...telemetryTrend.map((item) => item.soh))}%`}>
                <AreaChart data={telemetryTrend}><CartesianGrid stroke="#e9eff5" vertical={false} /><XAxis dataKey="day" tickLine={false} axisLine={false} /><YAxis domain={[80, 100]} unit="%" tickLine={false} axisLine={false} /><Tooltip /><Area type="monotone" dataKey="soh" stroke="#24be69" fill="#d8f5e4" strokeWidth={2} /></AreaChart>
              </TelemetryChart>
              <TelemetryChart title="Temperature" maximum="Max Temp" maximumValue={`${Math.max(...telemetryTrend.map((item) => item.temperature))}C`} average="Avg Temp" averageValue={`${selectedBattery.temperature}C`} minimum="Min Temp" minimumValue={`${Math.min(...telemetryTrend.map((item) => item.temperature))}C`}>
                <LineChart data={telemetryTrend}><CartesianGrid stroke="#e9eff5" vertical={false} /><XAxis dataKey="day" tickLine={false} axisLine={false} /><YAxis unit="C" tickLine={false} axisLine={false} /><Tooltip /><Line type="monotone" dataKey="temperature" stroke="#f5a623" strokeWidth={2} dot={false} /></LineChart>
              </TelemetryChart>
              <TelemetryChart title="Voltage & Current" maximum="Max Voltage" maximumValue={`${Math.max(...telemetryTrend.map((item) => item.voltage))}V`} average="Avg Voltage" averageValue={`${selectedBattery.voltage}V`} minimum="Min Voltage" minimumValue={`${Math.min(...telemetryTrend.map((item) => item.voltage))}V`}>
                <LineChart data={telemetryTrend}><CartesianGrid stroke="#e9eff5" vertical={false} /><XAxis dataKey="day" tickLine={false} axisLine={false} /><YAxis yAxisId="voltage" tickLine={false} axisLine={false} /><YAxis yAxisId="current" orientation="right" tickLine={false} axisLine={false} /><Tooltip /><Legend iconType="circle" /><Line yAxisId="voltage" type="monotone" dataKey="voltage" stroke="#8b6cf6" strokeWidth={2} dot={false} /><Line yAxisId="current" type="monotone" dataKey="current" stroke="#fa5960" strokeWidth={2} dot={false} /></LineChart>
              </TelemetryChart>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

type TelemetryChartProps = {
  title: string
  maximum: string
  maximumValue: string
  average: string
  averageValue: string
  minimum: string
  minimumValue: string
  children: React.ReactElement
}

const TelemetryChart = ({ title, maximum, maximumValue, average, averageValue, minimum, minimumValue, children }: TelemetryChartProps) => (
  <article className={styles.telemetryChart}>
    <div className={styles.telemetryChartHeader}>
      <strong>{title}</strong>
      <span className={styles.max}>{maximum}: {maximumValue}</span>
      <span className={styles.avg}>{average}: {averageValue}</span>
      <span className={styles.min}>{minimum}: {minimumValue}</span>
    </div>
    <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
  </article>
)

export default Battery
*/
