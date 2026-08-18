import Card from '@/components/Card/Card'
import Button from '@/components/Button/Button'
import Badge from '@/components/Badge/Badge'
import styles from './Page.module.css'

const Reports = () => (
  <div className={styles.page}>
    <div className={styles.header}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Reports</h1>
          <p>Generate and manage system reports</p>
        </div>
        <Button>+ New Report</Button>
      </div>
    </div>

    <Card>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Report Name</th>
            <th>Type</th>
            <th>Generated</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>August 2026 Performance</strong></td>
            <td>Performance Summary</td>
            <td>Aug 1, 2026</td>
            <td><Badge variant="success">Complete</Badge></td>
            <td><Button variant="tertiary" size="sm">Download</Button></td>
          </tr>
          <tr>
            <td><strong>Battery Health Analysis</strong></td>
            <td>Health Report</td>
            <td>Jul 31, 2026</td>
            <td><Badge variant="success">Complete</Badge></td>
            <td><Button variant="tertiary" size="sm">Download</Button></td>
          </tr>
          <tr>
            <td><strong>Q3 Compliance Report</strong></td>
            <td>Compliance</td>
            <td>Generating...</td>
            <td><Badge variant="info">In Progress</Badge></td>
            <td><Button variant="tertiary" size="sm" disabled>Pending</Button></td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
)

export default Reports
