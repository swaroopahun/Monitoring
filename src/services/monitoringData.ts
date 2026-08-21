import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react'

export type ProjectStatus = 'healthy' | 'warning' | 'critical' | 'offline'
export type DeviceStatus = 'online' | 'warning' | 'offline'
export type AlarmSeverity = 'critical' | 'major' | 'warning' | 'info'
export type AlarmStatus = 'active' | 'acknowledged' | 'resolved'

export interface Project {
  id: string
  name: string
  location: string
  status: ProjectStatus
  availability: number
  devicesTotal: number
  devicesOnline: number
  activeAlarms: number
  criticalAlarms: number
  communicationHealth: number
  lastUpdated: string
  lat: number
  lng: number
  customer: string
  country: string
  region: string
  supplier: string
  blindingPercent: number
  concentrators: number
  controllers: number
  meteoStations: number
  powerMWdc: number
}

export interface Device {
  id: string
  name: string
  projectId: string
  type: string
  status: DeviceStatus
  temperature: number
  voltage: number
  current: number
  communication: 'Strong' | 'Stable' | 'Weak' | 'Lost'
  lastCommunication: string
  activeAlarms: number
}

export interface Alarm {
  id: string
  projectId: string
  deviceId: string
  title: string
  severity: AlarmSeverity
  status: AlarmStatus
  startedAt: string
  duration: string
  acked: boolean
}

export interface Battery {
  id: string
  name: string
  projectId: string
  associatedDevice: string
  status: DeviceStatus
  soc: number
  soh: number
  temperature: number
  voltage: number
  current: number
  communication: 'Strong' | 'Stable' | 'Weak' | 'Lost'
  lastUpdated: string
}

export interface MonitoringState {
  projects: Project[]
  devices: Device[]
  alarms: Alarm[]
  batteries: Battery[]
  lastUpdated: string
  isLive: boolean
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const projectSeed: Project[] = [
  {
    id: 'north-ridge',
    name: 'North Ridge Solar',
    location: 'Phoenix, Arizona',
    status: 'healthy',
    availability: 98.7,
    devicesTotal: 214,
    devicesOnline: 209,
    activeAlarms: 1,
    criticalAlarms: 0,
    communicationHealth: 99,
    lastUpdated: new Date().toISOString(),
    lat: 33.4484,
    lng: -112.074,
    customer: 'Array Technologies',
    country: 'USA',
    region: 'Southwest',
    supplier: 'Nextracker',
    blindingPercent: 99,
    concentrators: 6,
    controllers: 214,
    meteoStations: 2,
    powerMWdc: 30,
  },
  {
    id: 'coastal-storage',
    name: 'Coastal Storage Park',
    location: 'San Diego, California',
    status: 'warning',
    availability: 94.2,
    devicesTotal: 186,
    devicesOnline: 170,
    activeAlarms: 5,
    criticalAlarms: 1,
    communicationHealth: 91,
    lastUpdated: new Date().toISOString(),
    lat: 32.7157,
    lng: -117.1611,
    customer: 'Coastal Energy Partners',
    country: 'USA',
    region: 'West',
    supplier: 'GameChange Solar',
    blindingPercent: 94,
    concentrators: 5,
    controllers: 186,
    meteoStations: 2,
    powerMWdc: 26,
  },
  {
    id: 'midwest-grid',
    name: 'Midwest Grid Hub',
    location: 'Chicago, Illinois',
    status: 'healthy',
    availability: 97.8,
    devicesTotal: 247,
    devicesOnline: 242,
    activeAlarms: 2,
    criticalAlarms: 0,
    communicationHealth: 96,
    lastUpdated: new Date().toISOString(),
    lat: 41.8781,
    lng: -87.6298,
    customer: 'Midwest Grid Cooperative',
    country: 'USA',
    region: 'Midwest',
    supplier: 'FTC Solar',
    blindingPercent: 100,
    concentrators: 7,
    controllers: 247,
    meteoStations: 3,
    powerMWdc: 35,
  },
  {
    id: 'desert-peak',
    name: 'Desert Peak Facility',
    location: 'Las Vegas, Nevada',
    status: 'critical',
    availability: 87.3,
    devicesTotal: 132,
    devicesOnline: 101,
    activeAlarms: 8,
    criticalAlarms: 3,
    communicationHealth: 79,
    lastUpdated: new Date().toISOString(),
    lat: 36.1699,
    lng: -115.1398,
    customer: 'Desert Peak Energy LLC',
    country: 'USA',
    region: 'Southwest',
    supplier: 'Nextracker',
    blindingPercent: 87,
    concentrators: 4,
    controllers: 132,
    meteoStations: 1,
    powerMWdc: 18,
  },
]

const deviceSeed: Device[] = [
  { id: 'DEV-101', projectId: 'north-ridge', name: 'DEV-101', type: 'Battery Pack', status: 'online', temperature: 26.2, voltage: 540, current: 96, communication: 'Strong', lastCommunication: new Date().toISOString(), activeAlarms: 0 },
  { id: 'DEV-102', projectId: 'north-ridge', name: 'DEV-102', type: 'Battery Pack', status: 'online', temperature: 29.8, voltage: 515, current: 82, communication: 'Stable', lastCommunication: new Date().toISOString(), activeAlarms: 0 },
  { id: 'DEV-201', projectId: 'coastal-storage', name: 'DEV-201', type: 'Power Conversion', status: 'warning', temperature: 39.4, voltage: 470, current: 121, communication: 'Weak', lastCommunication: new Date().toISOString(), activeAlarms: 2 },
  { id: 'DEV-202', projectId: 'coastal-storage', name: 'DEV-202', type: 'Battery Pack', status: 'online', temperature: 31.2, voltage: 525, current: 88, communication: 'Strong', lastCommunication: new Date().toISOString(), activeAlarms: 1 },
  { id: 'DEV-301', projectId: 'midwest-grid', name: 'DEV-301', type: 'Battery Pack', status: 'online', temperature: 27.9, voltage: 548, current: 104, communication: 'Strong', lastCommunication: new Date().toISOString(), activeAlarms: 0 },
  { id: 'DEV-401', projectId: 'desert-peak', name: 'DEV-401', type: 'Battery Pack', status: 'offline', temperature: 42.4, voltage: 412, current: 0, communication: 'Lost', lastCommunication: new Date(Date.now() - 1000 * 60 * 11).toISOString(), activeAlarms: 4 },
  { id: 'DEV-402', projectId: 'desert-peak', name: 'DEV-402', type: 'Inverter', status: 'warning', temperature: 35.2, voltage: 486, current: 32, communication: 'Weak', lastCommunication: new Date().toISOString(), activeAlarms: 1 },
]

const batterySeed: Battery[] = [
  { id: 'BAT-1001', name: 'BAT-1001', projectId: 'north-ridge', associatedDevice: 'DEV-101', status: 'online', soc: 88, soh: 96, temperature: 28.1, voltage: 540, current: 92, communication: 'Strong', lastUpdated: new Date().toISOString() },
  { id: 'BAT-1002', name: 'BAT-1002', projectId: 'north-ridge', associatedDevice: 'DEV-102', status: 'online', soc: 84, soh: 94, temperature: 29.8, voltage: 520, current: 74, communication: 'Stable', lastUpdated: new Date().toISOString() },
  { id: 'BAT-2001', name: 'BAT-2001', projectId: 'coastal-storage', associatedDevice: 'DEV-201', status: 'warning', soc: 63, soh: 81, temperature: 39.7, voltage: 470, current: 121, communication: 'Weak', lastUpdated: new Date().toISOString() },
  { id: 'BAT-3001', name: 'BAT-3001', projectId: 'midwest-grid', associatedDevice: 'DEV-301', status: 'online', soc: 91, soh: 97, temperature: 27.8, voltage: 548, current: 109, communication: 'Strong', lastUpdated: new Date().toISOString() },
  { id: 'BAT-4001', name: 'BAT-4001', projectId: 'desert-peak', associatedDevice: 'DEV-401', status: 'offline', soc: 22, soh: 68, temperature: 44.8, voltage: 410, current: 0, communication: 'Lost', lastUpdated: new Date(Date.now() - 1000 * 60 * 7).toISOString() },
]

const alarmSeed: Alarm[] = [
  { id: 'ALM-001', projectId: 'coastal-storage', deviceId: 'DEV-201', title: 'Temperature excursion', severity: 'major', status: 'active', startedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(), duration: '18 min', acked: false },
  { id: 'ALM-002', projectId: 'desert-peak', deviceId: 'DEV-401', title: 'Communication lost', severity: 'critical', status: 'active', startedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(), duration: '42 min', acked: false },
  { id: 'ALM-003', projectId: 'desert-peak', deviceId: 'DEV-402', title: 'Voltage imbalance', severity: 'warning', status: 'active', startedAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(), duration: '9 min', acked: true },
  { id: 'ALM-004', projectId: 'north-ridge', deviceId: 'DEV-102', title: 'Minor thermal drift', severity: 'info', status: 'acknowledged', startedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(), duration: '55 min', acked: true },
  { id: 'ALM-005', projectId: 'midwest-grid', deviceId: 'DEV-301', title: 'Battery balancing delay', severity: 'warning', status: 'active', startedAt: new Date(Date.now() - 1000 * 60 * 6).toISOString(), duration: '6 min', acked: false },
]

export const createMonitoringState = (): MonitoringState => ({
  projects: projectSeed.map((project) => ({ ...project, lastUpdated: new Date().toISOString() })),
  devices: deviceSeed.map((device) => ({ ...device, lastCommunication: new Date().toISOString() })),
  alarms: alarmSeed,
  batteries: batterySeed.map((battery) => ({ ...battery, lastUpdated: new Date().toISOString() })),
  lastUpdated: new Date().toISOString(),
  isLive: true,
})

export const advanceMonitoringState = (state: MonitoringState): MonitoringState => {
  const now = new Date().toISOString()

  const updatedProjects = state.projects.map((project) => {
    const offset = Math.random() * 3 - 1.5
    const availability = clamp(project.availability + offset * 0.5, 70, 100)
    const status: ProjectStatus = availability > 96 ? 'healthy' : availability > 90 ? 'warning' : availability > 84 ? 'critical' : 'offline'
    const activeAlarms = Math.max(0, project.activeAlarms + Math.round((Math.random() - 0.48) * 3))
    const criticalAlarms = Math.max(0, Math.min(activeAlarms, project.criticalAlarms + (Math.random() > 0.72 ? 1 : 0) - (Math.random() > 0.8 ? 1 : 0)))

    return {
      ...project,
      availability: Number(availability.toFixed(1)),
      status,
      activeAlarms,
      criticalAlarms,
      communicationHealth: clamp(project.communicationHealth + (Math.random() - 0.5) * 8, 60, 100),
      lastUpdated: now,
    }
  })

  const updatedDevices = state.devices.map((device, index) => {
    const drift = (Math.random() - 0.5) * 7
    const temperature = clamp(device.temperature + drift, 18, 60)
    const voltage = clamp(device.voltage + (Math.random() - 0.5) * 22, 300, 620)
    const current = clamp(device.current + (Math.random() - 0.5) * 30, 0, 180)
    const status: DeviceStatus = temperature > 42 || device.communication === 'Lost' ? 'offline' : temperature > 36 ? 'warning' : 'online'
    const communicationRoll = Math.random()
    const communication: Device['communication'] = communicationRoll > 0.88 ? 'Lost' : communicationRoll > 0.68 ? 'Weak' : communicationRoll > 0.42 ? 'Stable' : 'Strong'

    return {
      ...device,
      temperature: Number(temperature.toFixed(1)),
      voltage: Number(voltage.toFixed(0)),
      current: Number(current.toFixed(0)),
      status,
      communication,
      lastCommunication: now,
      activeAlarms: index % 2 === 0 ? device.activeAlarms : Math.max(0, device.activeAlarms + (Math.random() > 0.7 ? 1 : 0) - (Math.random() > 0.8 ? 1 : 0)),
    }
  })

  const updatedBatteries = state.batteries.map((battery) => {
    const soc = clamp(battery.soc + (Math.random() - 0.5) * 4, 10, 99)
    const soh = clamp(battery.soh + (Math.random() - 0.5) * 2, 60, 100)
    const temperature = clamp(battery.temperature + (Math.random() - 0.5) * 5, 18, 52)
    const voltage = clamp(battery.voltage + (Math.random() - 0.5) * 18, 360, 610)
    const current = clamp(battery.current + (Math.random() - 0.5) * 28, 0, 170)
    const status: DeviceStatus = battery.communication === 'Lost' ? 'offline' : temperature > 38 ? 'warning' : 'online'

    return {
      ...battery,
      soc: Number(soc.toFixed(0)),
      soh: Number(soh.toFixed(0)),
      temperature: Number(temperature.toFixed(1)),
      voltage: Number(voltage.toFixed(0)),
      current: Number(current.toFixed(0)),
      status,
      communication: battery.communication === 'Lost' && Math.random() > 0.4 ? 'Weak' : battery.communication,
      lastUpdated: now,
    }
  })

  const adjustedAlarms = state.alarms.map((alarm, idx) => {
    if (idx === 2 && Math.random() > 0.54) {
      return { ...alarm, status: 'resolved' as AlarmStatus, acked: true }
    }
    return alarm
  })

  return {
    projects: updatedProjects,
    devices: updatedDevices,
    alarms: adjustedAlarms,
    batteries: updatedBatteries,
    lastUpdated: now,
    isLive: true,
  }
}

const MonitoringContext = createContext<MonitoringState | null>(null)

export const MonitoringProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<MonitoringState>(() => createMonitoringState())

  useEffect(() => {
    const interval = window.setInterval(() => {
      setState((current) => advanceMonitoringState(current))
    }, 5000)

    return () => window.clearInterval(interval)
  }, [])

  return createElement(MonitoringContext.Provider, { value: state }, children)
}

export const useMonitoring = () => {
  const context = useContext(MonitoringContext)

  if (!context) {
    throw new Error('useMonitoring must be used within MonitoringProvider')
  }

  return context
}

export const formatLiveTimestamp = (isoDate: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(isoDate))

export const getCommStatus = (communicationHealth: number): Device['communication'] => {
  if (communicationHealth >= 95) return 'Strong'
  if (communicationHealth >= 85) return 'Stable'
  if (communicationHealth >= 70) return 'Weak'
  return 'Lost'
}

export const getPlantStatusLabel = (status: ProjectStatus) => {
  switch (status) {
    case 'healthy':
      return 'In Operation'
    case 'warning':
      return 'In Commissioning'
    case 'critical':
      return 'Under Maintenance'
    default:
      return 'Offline'
  }
}

export const getStatusTone = (status: string) => {
  switch (status) {
    case 'healthy':
    case 'online':
    case 'success':
      return 'success'
    case 'warning':
    case 'major':
      return 'warning'
    case 'critical':
    case 'offline':
      return 'danger'
    default:
      return 'info'
  }
}
