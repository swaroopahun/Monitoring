import { useEffect, useState } from 'react'
import { CircleMarker, MapContainer, TileLayer, Tooltip as LeafletTooltip, ZoomControl, useMap } from 'react-leaflet'
import type { Project } from '@/services/monitoringData'
import styles from './GlobalProjectsMap.module.css'

interface GlobalProjectsMapProps {
  projects: Project[]
  onProjectSelect: (projectId: string) => void
  height?: number
}

const MapResizeHandler = () => {
  const map = useMap()

  useEffect(() => {
    const refresh = () => map.invalidateSize({ pan: false, animate: false })
    const frame = window.requestAnimationFrame(refresh)
    window.addEventListener('resize', refresh)

    const observer = new ResizeObserver(refresh)
    observer.observe(map.getContainer())

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', refresh)
      observer.disconnect()
    }
  }, [map])

  return null
}

const GlobalProjectsMap = ({ projects, onProjectSelect, height }: GlobalProjectsMapProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className={`${styles.mapCard} ${isExpanded ? styles.expanded : ''}`} aria-label="Global Projects map">
      <div className={styles.mapFrame} style={{ height: isExpanded ? undefined : height }}>
        <MapContainer center={[18, 5]} zoom={2} minZoom={1} maxZoom={12} zoomControl={false} scrollWheelZoom className={styles.map}>
          <MapResizeHandler />
          <ZoomControl position="topleft" />
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {projects.map((project) => {
            const isOnline = project.status === 'healthy'
            const statusLabel = isOnline ? 'Online' : 'Offline'

            return (
              <CircleMarker
                key={project.id}
                center={[project.lat, project.lng]}
                radius={isExpanded ? 11 : 9}
                pathOptions={{ color: '#ffffff', weight: 2, fillColor: isOnline ? '#1db969' : '#f5a000', fillOpacity: 1 }}
                eventHandlers={{ click: () => onProjectSelect(project.id) }}
              >
                <LeafletTooltip direction="top" offset={[0, -10]}>
                  {project.name} | {project.location} | {statusLabel}
                </LeafletTooltip>
              </CircleMarker>
            )
          })}
        </MapContainer>
        <button type="button" className={styles.expandButton} aria-label={isExpanded ? 'Restore map size' : 'Expand map'} title={isExpanded ? 'Restore map size' : 'Expand map'} onClick={() => setIsExpanded((expanded) => !expanded)}>
          {isExpanded ? '×' : '↗'}
        </button>
        <div className={styles.legend}><span><i className={styles.onlineDot} />Online</span><span><i className={styles.offlineDot} />Offline</span></div>
      </div>
    </section>
  )
}

export default GlobalProjectsMap
