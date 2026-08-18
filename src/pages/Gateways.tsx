import Card from '@/components/Card/Card'
import Badge from '@/components/Badge/Badge'
import styles from './Page.module.css'

const Gateways = () => (
  <div className={styles.page}>
    <div className={styles.header}>
      <h1>Gateways</h1>
      <p>Monitor gateway connectivity and device relationships</p>
    </div>
    <Card>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Gateway ID</th>
            <th>Location</th>
            <th>Status</th>
            <th>Connected Devices</th>
            <th>Signal Strength</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>GW_001</strong></td>
            <td>Roadrunner Solar</td>
            <td><Badge variant="success">Online</Badge></td>
            <td>523 devices</td>
            <td>⬤⬤⬤⬜⬜ 60%</td>
          </tr>
          <tr>
            <td><strong>GW_015</strong></td>
            <td>Desert Facility</td>
            <td><Badge variant="success">Online</Badge></td>
            <td>1,203 devices</td>
            <td>⬤⬜⬜⬜⬜ 20%</td>
          </tr>
          <tr>
            <td><strong>GW_089</strong></td>
            <td>Remote Island</td>
            <td><Badge variant="danger">Offline</Badge></td>
            <td>407 devices</td>
            <td>⬜⬜⬜⬜⬜ 0%</td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
)

export default Gateways
