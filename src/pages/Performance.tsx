import Card from '@/components/Card/Card'
import styles from './Page.module.css'

const Performance = () => (
  <div className={styles.page}>
    <div className={styles.header}>
      <h1>Performance Analytics</h1>
      <p>System-wide performance metrics and trends</p>
    </div>
    
    <div className={styles.grid}>
      <Card>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#0088FF' }}>92%</div>
          <div style={{ color: '#666', marginTop: '8px' }}>System Efficiency</div>
          <div style={{ color: '#28A745', fontSize: '12px', marginTop: '4px' }}>↑ +3% from last week</div>
        </div>
      </Card>
      <Card>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#28A745' }}>99.8%</div>
          <div style={{ color: '#666', marginTop: '8px' }}>Uptime</div>
          <div style={{ color: '#28A745', fontSize: '12px', marginTop: '4px' }}>↑ +0.1% from last week</div>
        </div>
      </Card>
      <Card>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#17A2B8' }}>1,245</div>
          <div style={{ color: '#666', marginTop: '8px' }}>Total Cycles</div>
          <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>Average per device</div>
        </div>
      </Card>
      <Card>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#FFC107' }}>4.2h</div>
          <div style={{ color: '#666', marginTop: '8px' }}>Avg Response Time</div>
          <div style={{ color: '#FFC107', fontSize: '12px', marginTop: '4px' }}>↓ -0.3h from last week</div>
        </div>
      </Card>
    </div>

    <div className={styles.grid}>
      <Card>
        <h3 style={{ margin: '0 0 16px' }}>Daily Generation</h3>
        <div style={{ height: '200px', background: 'linear-gradient(135deg, #f5f7fa 0%, #eef1f6 100%)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>📊 Chart visualization</div>
      </Card>
      <Card>
        <h3 style={{ margin: '0 0 16px' }}>System Efficiency Trend</h3>
        <div style={{ height: '200px', background: 'linear-gradient(135deg, #f5f7fa 0%, #eef1f6 100%)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>📊 Chart visualization</div>
      </Card>
      <Card>
        <h3 style={{ margin: '0 0 16px' }}>Charging vs Discharging</h3>
        <div style={{ height: '200px', background: 'linear-gradient(135deg, #f5f7fa 0%, #eef1f6 100%)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>📊 Chart visualization</div>
      </Card>
      <Card>
        <h3 style={{ margin: '0 0 16px' }}>Temperature Distribution</h3>
        <div style={{ height: '200px', background: 'linear-gradient(135deg, #f5f7fa 0%, #eef1f6 100%)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>📊 Chart visualization</div>
      </Card>
    </div>
  </div>
)

export default Performance
