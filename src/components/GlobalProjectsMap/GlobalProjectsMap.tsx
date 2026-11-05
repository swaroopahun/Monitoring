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
          <TileLayer
            attribution="Tiles &copy; Esri, Maxar, Earthstar Geographics"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
          {projects.map((project) => {
            const markerColor = project.status === 'healthy'
              ? '#20c366'
              : project.status === 'warning'
                ? '#ffb400'
                : project.status === 'critical'
                  ? '#ff353c'
                  : '#718598'
            const statusLabel = project.status === 'healthy' ? 'In Operation' : project.status === 'warning' ? 'Issues Detected' : project.status

            return (
              <CircleMarker
                key={project.id}
                center={[project.lat, project.lng]}
                radius={isExpanded ? 11 : 9}
                pathOptions={{ color: '#ffffff', weight: 2, fillColor: markerColor, fillOpacity: 1 }}
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
        <div className={styles.legend} aria-label="Project status legend">
          <span><i className={styles.onlineDot} />In Operation</span>
          <span><i className={styles.warningDot} />Issues</span>
          <span><i className={styles.criticalDot} />Critical</span>
          <span><i className={styles.offlineDot} />Offline</span>
        </div>
      </div>
    </section>
  )
}

export default GlobalProjectsMap
