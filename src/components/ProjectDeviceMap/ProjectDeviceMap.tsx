import { CircleMarker, MapContainer, TileLayer, Tooltip as LeafletTooltip, ZoomControl } from 'react-leaflet'
import type { Device, Project } from '@/services/monitoringData'
import styles from './ProjectDeviceMap.module.css'

interface ProjectDeviceMapProps {
  project: Project
  devices: Device[]
  onDeviceSelect: (deviceId: string) => void
}

const markerColor = (device: Device) => {
  if (device.status === 'offline') return '#ff353c'
  if (device.status === 'warning') return '#ffb400'
  return '#20c366'
}

const ProjectDeviceMap = ({ project, devices, onDeviceSelect }: ProjectDeviceMapProps) => (
  <div className={styles.frame}>
    <MapContainer center={[project.lat, project.lng]} zoom={14} scrollWheelZoom zoomControl={false} className={styles.map}>
      <ZoomControl position="topright" />
      <TileLayer
        attribution="Tiles &copy; Esri, Maxar, Earthstar Geographics"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        maxZoom={19}
      />
      {devices.map((device, index) => {
        // Device GPS coordinates are not part of the current data model; offsets keep
        // sample markers visible around the project site without implying exact positions.
        const row = Math.floor(index / 8)
        const column = index % 8
        const lat = project.lat + (row - 1.5) * 0.0007
        const lng = project.lng + (column - 3.5) * 0.0008
        return (
          <CircleMarker
            key={device.id}
            center={[lat, lng]}
            radius={8}
            pathOptions={{ color: '#fff', weight: 2, fillColor: markerColor(device), fillOpacity: 1 }}
            eventHandlers={{ click: () => onDeviceSelect(device.id) }}
          >
            <LeafletTooltip direction="top" offset={[0, -8]}>{device.id} · {device.status}</LeafletTooltip>
          </CircleMarker>
        )
      })}
    </MapContainer>
    <div className={styles.legend} aria-label="Device status legend">
      <span><i className={styles.online} />Online</span>
      <span><i className={styles.warning} />Warning</span>
      <span><i className={styles.offline} />Offline</span>
    </div>
  </div>
)

export default ProjectDeviceMap