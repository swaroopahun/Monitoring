import Card from '@/components/Card/Card'
import Badge from '@/components/Badge/Badge'
import styles from './Page.module.css'

const BatteryHealth = () => (
  <div className={styles.page}>
    <div className={styles.header}>
      <h1>Battery Health & Analytics</h1>
      <p>Monitor battery performance and health metrics</p>
    </div>
    
    <div className={styles.grid}>
      <Card>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#28A745' }}>87%</div>
          <div style={{ color: '#666', marginTop: '8px' }}>System Health Score</div>
        </div>
      </Card>
      <Card>
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Total Capacity</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>48.2 MWh</div>
          <div style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>Across all systems</div>
        </div>
      </Card>
      <Card>
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Average Age</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>4.2 years</div>
          <div style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>Fleet average</div>
        </div>
      </Card>
      <Card>
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Degradation Rate</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>0.8%/year</div>
          <div style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>Annual average</div>
        </div>
      </Card>
    </div>

    <Card>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>Top Devices by Health</h3>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Device</th>
            <th>Health Score</th>
            <th>Capacity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>SNC_001</td>
            <td>96%</td>
            <td>500 kWh</td>
            <td><Badge variant="success">Excellent</Badge></td>
          </tr>
          <tr>
            <td>SNC_002</td>
            <td>94%</td>
            <td>500 kWh</td>
            <td><Badge variant="success">Excellent</Badge></td>
          </tr>
          <tr>
            <td>RSP_042</td>
            <td>72%</td>
            <td>1000 kWh</td>
            <td><Badge variant="warning">Fair</Badge></td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
)

export default BatteryHealth
