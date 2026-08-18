import Card from '@/components/Card/Card'
import Badge from '@/components/Badge/Badge'
import styles from './Page.module.css'

const ActivityLogs = () => (
  <div className={styles.page}>
    <div className={styles.header}>
      <h1>Activity Logs</h1>
      <p>Complete audit trail of all system activities</p>
    </div>

    <Card>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User</th>
            <th>Action</th>
            <th>Resource</th>
            <th>IP Address</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Aug 17, 2:45 PM</td>
            <td>john@example.com</td>
            <td>Device Configuration Updated</td>
            <td>SNC_001</td>
            <td>192.168.1.100</td>
            <td><Badge variant="success">Success</Badge></td>
          </tr>
          <tr>
            <td>Aug 17, 2:30 PM</td>
            <td>admin@example.com</td>
            <td>Alert Rule Created</td>
            <td>Alert #456</td>
            <td>192.168.1.50</td>
            <td><Badge variant="success">Success</Badge></td>
          </tr>
          <tr>
            <td>Aug 17, 1:15 PM</td>
            <td>jane@example.com</td>
            <td>Report Generated</td>
            <td>Report #789</td>
            <td>192.168.1.75</td>
            <td><Badge variant="success">Success</Badge></td>
          </tr>
          <tr>
            <td>Aug 17, 12:00 PM</td>
            <td>manager@example.com</td>
            <td>Automated Backup</td>
            <td>Database</td>
            <td>System</td>
            <td><Badge variant="success">Success</Badge></td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
)

export default ActivityLogs
