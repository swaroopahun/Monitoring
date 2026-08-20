import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Card from '@/components/Card/Card'
import Badge from '@/components/Badge/Badge'
import GlobalProjectsMap from '@/components/GlobalProjectsMap/GlobalProjectsMap'
import { getStatusTone, useMonitoring } from '@/services/monitoringData'
import styles from './Dashboard.module.css'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => ({ month, total: 120 + (index % 5) * 8, communicating: 105 + (index % 6) * 9, alarms: 16 + (index % 4) * 5 }))
const solar = ['05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time, index) => ({ time, power: [0, 30, 70, 110, 140, 155, 170, 170, 160, 145, 120, 95, 60, 25][index], irradiance: [0, 240, 500, 720, 850, 980, 1080, 1070, 1000, 850, 680, 480, 280, 60][index] }))

const totalMonitoredDevices = 120456

const DonutTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: { name: string; value: number; color: string } }[] }) => {
  if (!active || !payload || !payload.length) return null
  const { name, value, color } = payload[0].payload
  const count = Math.round((totalMonitoredDevices * value) / 100)
  return (
    <div className={styles.donutTooltip}>
      <strong style={{ color }}>{name}</strong>
      <span>Device Count<b>{count.toLocaleString()}</b></span>
      <span>Percentage<b>{value}%</b></span>
    </div>
  )
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { alarms, projects } = useMonitoring()
  const active = alarms.filter((alarm) => alarm.status !== 'resolved')
  const stateData = useMemo(() => [{ name: 'Auto Mode', value: 75, color: '#20c567' }, { name: 'Manual Mode', value: 15, color: '#3e7ee8' }, { name: 'E-stop Active', value: 6, color: '#ef5350' }, { name: 'Maintenance', value: 4, color: '#8760e8' }], [])
  return <div className={styles.dashboard}>
    <header className={styles.greeting}><p>Welcome back, John! 👋</p><h1>Dashboard</h1></header>
    <section className={styles.summaryGrid}><Summary title="Total Devices" value="120,456" /><Summary title="Active Projects" value="455" /><Summary title="Active Alarms" value="4123" meta="12 Critical" tone="danger" /><Summary title="Devices Online" value="119,839 online" meta="96%" tone="good" /></section>
    <section className={styles.projects}><header><div><h2>Field View — Global Projects</h2><span>Live commissioned project monitoring</span></div><select className={styles.projectSelect} aria-label="Select project" onChange={(event) => event.target.value && navigate(`/project-details/${event.target.value}`)} defaultValue=""><option value="">All projects</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></header><GlobalProjectsMap projects={projects} onProjectSelect={(projectId) => navigate(`/project-details/${projectId}`)} /><footer><span>Live projects <b>{projects.length}</b></span><span>Online <b>{projects.filter((project) => project.status === 'healthy').length}</b></span><span>Offline <b>{projects.filter((project) => project.status !== 'healthy').length}</b></span><span>Controllers <b>{projects.reduce((total, project) => total + project.devicesTotal, 0)}</b></span></footer></section>
    <section className={styles.middle}><Card className={styles.connectivity}><h2>Device Connectivity History</h2><div><ResponsiveContainer width="100%" height="100%"><BarChart data={months}><CartesianGrid vertical={false} stroke="#23455b" /><XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#9fb2bf', fontSize: 11 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: '#9fb2bf', fontSize: 11 }} /><Tooltip contentStyle={{ background: '#0f2b3f', border: '1px solid #234a63', borderRadius: 6, color: '#e8f1f5' }} itemStyle={{ color: '#e8f1f5' }} labelStyle={{ color: '#f4f8fb', fontWeight: 700 }} /><Legend /><Bar dataKey="total" name="Total Devices" fill="#4b8ee9" /><Bar dataKey="communicating" name="Communicating" fill="#7faeef" /><Bar dataKey="alarms" name="No of Alarms" fill="#f6a000" /></BarChart></ResponsiveContainer></div></Card><div className={styles.right}><Card className={styles.alarms}><header><h2>Active Alarms</h2><button type="button" className={styles.viewAllLink} onClick={() => navigate('/alarms')}>View All →</button></header>{active.slice(0, 3).map((alarm) => <article key={alarm.id}><Badge variant={getStatusTone(alarm.severity)}>{alarm.severity}</Badge><span>{alarm.title}<small>{alarm.deviceId}<br />Chandler</small></span><time>08:14<br />Apr 19, 2026</time></article>)}</Card><Card className={styles.device}><h2>Device Connectivity</h2><div><b>119,839<small>Online</small></b><b>542<small>Warning</small></b><b>75<small>Offline</small></b></div><i /><footer>120,456 Total <strong>96.33% Online</strong></footer></Card></div></section>
    <section className={styles.bottom}><Card className={styles.distribution}><h2>Device State Distribution</h2><div><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={stateData} dataKey="value" innerRadius="55%" outerRadius="82%">{stateData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip content={<DonutTooltip />} /></PieChart></ResponsiveContainer><strong><span className={styles.distPercent}>75%</span><span className={styles.distLabel}>Battery</span><span className={styles.distSub}>Automatic</span></strong></div><footer>{stateData.map((item) => <span key={item.name}>{item.name}</span>)}</footer></Card><Card className={styles.generation}><h2>Generation &amp; Irradiance - Today</h2><div><ResponsiveContainer width="100%" height="100%"><LineChart data={solar}><CartesianGrid stroke="#23455b" /><XAxis dataKey="time" tick={{ fill: '#9fb2bf', fontSize: 11 }} /><YAxis yAxisId="power" tick={{ fill: '#9fb2bf', fontSize: 11 }} /><YAxis yAxisId="irradiance" orientation="right" tick={{ fill: '#9fb2bf', fontSize: 11 }} /><Tooltip contentStyle={{ background: '#0f2b3f', border: '1px solid #234a63', borderRadius: 6, color: '#e8f1f5' }} itemStyle={{ color: '#e8f1f5' }} labelStyle={{ color: '#f4f8fb', fontWeight: 700 }} /><Legend /><Line yAxisId="power" dataKey="power" name="Power MW" stroke="#ffb000" strokeWidth={3} dot={false} /><Line yAxisId="irradiance" dataKey="irradiance" name="Irradiance" stroke="#62a3ed" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer></div></Card></section>
  </div>
}
const Summary = ({ title, value, meta, tone }: { title: string; value: string; meta?: string; tone?: 'good' | 'danger' }) => <Card className={styles.summary}><span>{title}</span><strong>{value}</strong>{meta && <small className={tone === 'danger' ? styles.danger : styles.good}>{meta}</small>}</Card>
export default Dashboard