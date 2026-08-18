import Card from '@/components/Card/Card'
import Badge from '@/components/Badge/Badge'
import Button from '@/components/Button/Button'
import { formatLiveTimestamp, getStatusTone, useMonitoring } from '@/services/monitoringData'
import styles from './Page.module.css'

const Alarms = () => {
  const { alarms, lastUpdated } = useMonitoring()

  const activeAlarms = alarms.filter((alarm) => alarm.status !== 'resolved').length
  const criticalAlarms = alarms.filter((alarm) => alarm.severity === 'critical' && alarm.status !== 'resolved').length
  const acknowledgedAlarms = alarms.filter((alarm) => alarm.status === 'acknowledged').length

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Alarms & Alerts</h1>
          <p>Live monitoring of active faults and operational incidents</p>
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" size="sm">Auto Refresh</Button>
          <Button size="sm">+ Create Alert Rule</Button>
        </div>
      </div>

      <div className={styles.grid}>
        <Card>
          <div className={styles.kpi}><span>Active Alarms</span><strong>{activeAlarms}</strong></div>
        </Card>
        <Card>
          <div className={styles.kpi}><span>Critical</span><strong>{criticalAlarms}</strong></div>
        </Card>
        <Card>
          <div className={styles.kpi}><span>Acknowledged</span><strong>{acknowledgedAlarms}</strong></div>
        </Card>
        <Card>
          <div className={styles.kpi}><span>Last Refresh</span><strong>{formatLiveTimestamp(lastUpdated)}</strong></div>
        </Card>
      </div>

      <Card>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Device</th>
              <th>Alert</th>
              <th>Severity</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {alarms.map((alarm) => (
              <tr key={alarm.id}>
                <td>{alarm.deviceId}</td>
                <td>{alarm.title}</td>
                <td><Badge variant={getStatusTone(alarm.severity)}>{alarm.severity}</Badge></td>
                <td>{alarm.duration}</td>
                <td><Badge variant={getStatusTone(alarm.status)}>{alarm.status}</Badge></td>
                <td>{formatLiveTimestamp(alarm.startedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

export default Alarms
