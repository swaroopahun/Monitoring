import { useParams } from 'react-router-dom'
import Card from '@/components/Card/Card'
import Badge from '@/components/Badge/Badge'
import Button from '@/components/Button/Button'
import styles from './DeviceDetail.module.css'

const DeviceDetail = () => {
  useParams()

  return (
    <div className={styles.detail}>
      <div className={styles.header}>
        <div>
          <h1>Device: SNC_001</h1>
          <p>Detailed monitoring and metrics for this device</p>
        </div>
        <Badge variant="success">Online</Badge>
      </div>

      {/* Status Cards */}
      <div className={styles.statusGrid}>
        <Card>
          <div className={styles.statusItem}>
            <div className={styles.label}>Battery SOC</div>
            <div className={styles.value}>87%</div>
            <div className={styles.trend}>+2% from last hour</div>
          </div>
        </Card>
        <Card>
          <div className={styles.statusItem}>
            <div className={styles.label}>Temperature</div>
            <div className={styles.value}>24.5°C</div>
            <div className={styles.trend}>Within normal range</div>
          </div>
        </Card>
        <Card>
          <div className={styles.statusItem}>
            <div className={styles.label}>Power Output</div>
            <div className={styles.value}>245 kW</div>
            <div className={styles.trend}>+18 kW current</div>
          </div>
        </Card>
        <Card>
          <div className={styles.statusItem}>
            <div className={styles.label}>System Health</div>
            <div className={styles.value}>96%</div>
            <div className={styles.trend}>All systems normal</div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className={styles.chartsGrid}>
        <Card>
          <h3>Historical SOC</h3>
          <div className={styles.chartPlaceholder}>📊 SOC Chart</div>
        </Card>
        <Card>
          <h3>Temperature Trend</h3>
          <div className={styles.chartPlaceholder}>📊 Temperature Chart</div>
        </Card>
        <Card>
          <h3>Power Generation</h3>
          <div className={styles.chartPlaceholder}>📊 Power Chart</div>
        </Card>
        <Card>
          <h3>Efficiency Metrics</h3>
          <div className={styles.chartPlaceholder}>📊 Efficiency Chart</div>
        </Card>
      </div>

      {/* Alarms */}
      <Card>
        <h3>Recent Alarms</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Time</th>
              <th>Alert</th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2 hours ago</td>
              <td>Temperature threshold</td>
              <td><Badge variant="warning">Warning</Badge></td>
            </tr>
          </tbody>
        </table>
      </Card>

      {/* Actions */}
      <div className={styles.actions}>
        <Button variant="secondary">Edit Device</Button>
        <Button variant="secondary">View History</Button>
        <Button variant="danger">Remove Device</Button>
      </div>
    </div>
  )
}

export default DeviceDetail
