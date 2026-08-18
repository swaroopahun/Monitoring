import Card from '@/components/Card/Card'
import Button from '@/components/Button/Button'
import styles from './Page.module.css'

const Settings = () => (
  <div className={styles.page}>
    <div className={styles.header}>
      <h1>Settings</h1>
      <p>Configure your application and account preferences</p>
    </div>

    <Card>
      <h3 style={{ margin: '0 0 16px' }}>General Settings</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label>Application Name</label>
          <input type="text" defaultValue="Array Monitoring" style={{ width: '100%', padding: '10px 12px', marginTop: '8px', border: '1px solid #E8EBF0', borderRadius: '6px' }} />
        </div>
        <div>
          <label>Theme</label>
          <select defaultValue="light" style={{ width: '100%', padding: '10px 12px', marginTop: '8px', border: '1px solid #E8EBF0', borderRadius: '6px' }}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="secondary">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </Card>

    <Card>
      <h3 style={{ margin: '0 0 16px' }}>Notifications</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input type="checkbox" defaultChecked />
          <label>Email alerts for critical issues</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input type="checkbox" defaultChecked />
          <label>Daily summary reports</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input type="checkbox" />
          <label>SMS notifications</label>
        </div>
        <div style={{ marginTop: '16px' }}>
          <Button variant="secondary">Save Preferences</Button>
        </div>
      </div>
    </Card>

    <Card>
      <h3 style={{ margin: '0 0 16px' }}>Account</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <strong>Email:</strong> john@example.com
        </div>
        <div>
          <strong>Role:</strong> Administrator
        </div>
        <div>
          <strong>Last Login:</strong> Aug 17, 2:45 PM
        </div>
        <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
          <Button variant="secondary">Change Password</Button>
          <Button variant="danger">Sign Out</Button>
        </div>
      </div>
    </Card>
  </div>
)

export default Settings
