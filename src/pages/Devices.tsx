import { useMemo, useState } from 'react'
import Card from '@/components/Card/Card'
import Badge from '@/components/Badge/Badge'
import Button from '@/components/Button/Button'
import { formatLiveTimestamp, getStatusTone, type DeviceStatus, useMonitoring } from '@/services/monitoringData'
import styles from './Devices.module.css'

const Devices = () => {
  const { devices, lastUpdated } = useMonitoring()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | DeviceStatus>('all')

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const matchesSearch = device.name.toLowerCase().includes(query.toLowerCase()) || device.type.toLowerCase().includes(query.toLowerCase())
      const matchesStatus = statusFilter === 'all' || device.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [devices, query, statusFilter])

  return (
    <div className={styles.devices}>
      <div className={styles.header}>
        <div>
          <h1>Live Devices</h1>
          <p>Last refresh: {formatLiveTimestamp(lastUpdated)}</p>
        </div>
        <Button>+ Add Device</Button>
      </div>

      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Search devices or asset type..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | DeviceStatus)}>
          <option value="all">All Status</option>
          <option value="online">Online</option>
          <option value="warning">Warning</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      <Card variant="standard">
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Device ID</th>
              <th>Project</th>
              <th>Status</th>
              <th>Battery SOC</th>
              <th>Temperature</th>
              <th>Last Comm</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.map((device) => (
              <tr key={device.id}>
                <td><strong>{device.name}</strong></td>
                <td>{device.projectId}</td>
                <td>
                  <Badge variant={getStatusTone(device.status)}>{device.status}</Badge>
                </td>
                <td>{device.temperature > 40 ? 'Low' : 'Healthy'}</td>
                <td>{device.temperature}°C</td>
                <td>{formatLiveTimestamp(device.lastCommunication)}</td>
                <td>
                  <Button variant="tertiary" size="sm">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className={styles.pagination}>
        <span>Showing {filteredDevices.length} of {devices.length} devices</span>
        <div>
          <Button variant="secondary" size="sm">← Previous</Button>
          <Button variant="secondary" size="sm">Next →</Button>
        </div>
      </div>
    </div>
  )
}

export default Devices
