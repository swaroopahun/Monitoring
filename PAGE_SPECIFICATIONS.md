# Array Monitoring - Page Specifications

Detailed specifications for each screen in the monitoring application.

---

## 1. Dashboard

### Purpose
Quick overview of entire system health and status.

### Layout Structure
```
┌────────────────────────────────────────────────────────┐
│ [HEADER: Dashboard]                      [Refresh] [↓] │
├────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │
│ │ Total        │ │ Online       │ │ Offline Devices │ │
│ │ Projects: 12 │ │ Devices: 889 │ │ Devices: 45    │ │
│ └──────────────┘ └──────────────┘ └──────────────────┘ │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │
│ │ Active       │ │ Avg Battery  │ │ System           │ │
│ │ Alarms: 23   │ │ SOC: 72%     │ │ Availability: 99%│ │
│ │ 🔴 Critical  │ │ Trending ✓   │ │ Excellent ✓      │ │
│ └──────────────┘ └──────────────┘ └──────────────────┘ │
├────────────────────────────────────────────────────────┤
│ CHARTS (2-column layout)                                │
│ ┌─────────────────────┐ ┌─────────────────────────────┐│
│ │ Device Status Trend │ │ Alarm Trend                 ││
│ │ (Line Chart)        │ │ (Area Chart)                ││
│ │                     │ │                             ││
│ └─────────────────────┘ └─────────────────────────────┘│
│ ┌─────────────────────┐ ┌─────────────────────────────┐│
│ │ Battery SOC Dist.   │ │ Battery SOH Status          ││
│ │ (Pie Chart)         │ │ (Donut Chart)               ││
│ └─────────────────────┘ └─────────────────────────────┘│
├────────────────────────────────────────────────────────┤
│ MAP SECTION                                             │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Project Locations Map                               ││
│ │ [Shows project pins with status indicators]         ││
│ │ Legend: ● Online  ● Offline  ● Warning              ││
│ └─────────────────────────────────────────────────────┘│
├────────────────────────────────────────────────────────┤
│ RECENT ACTIVITY / EVENTS                                │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Timestamp    | Event              | Severity | Proj ││
│ │ 14:32        | Device: Offline    | Critical | RSP  ││
│ │ 14:15        | High Temp Alert    | Warning  | LNP  ││
│ │ 13:58        | SOC Low            | Warning  | RP   ││
│ │ [View All]                                           ││
│ └─────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────┘
```

### KPI Cards (6 Cards in 3x2 Grid)
| Card | Value | Unit | Status | Subtitle |
|------|-------|------|--------|----------|
| Total Projects | 12 | projects | ✓ | All active |
| Online Devices | 889 | devices | 🟢 98% online |
| Offline Devices | 45 | devices | 🔴 Critical |
| Active Alarms | 23 | alarms | ⚠️ 3 critical |
| Avg Battery SOC | 72% | capacity | ✓ Optimal range |
| System Availability | 99% | uptime | ✓ Excellent |

**Card Design**:
- Title (16px, 600 weight)
- Large number (32px, 600 weight, primary color)
- Status indicator (badge or icon)
- Trend indicator (↑ ↓ → with percentage)
- Last updated timestamp (small, secondary text)

### Charts (4 total)
1. **Device Status Trend** (Line Chart)
   - X-axis: Last 30 days
   - Y-axis: Device count
   - Lines: Online (green), Offline (red)

2. **Alarm Trend** (Area Chart)
   - X-axis: Last 30 days
   - Y-axis: Alarm count
   - Areas: Critical (red), Warning (yellow), Info (blue)
   - Stacked area chart

3. **Battery SOC Distribution** (Pie Chart)
   - Segments: 0-25%, 25-50%, 50-75%, 75-100%
   - Colors: Red → Orange → Yellow → Green

4. **Battery SOH Status** (Donut Chart)
   - Segments: Healthy (>80%), Warning (50-80%), Critical (<50%)
   - Center: Overall SOH %

### Map Section
- Interactive map showing all project locations
- Pins colored by status (green=online, red=offline, orange=warning)
- Legend at bottom
- Zoom/pan controls
- Hover: Show project name + status count
- Click: Navigate to project detail

### Recent Events Table
- Columns: Timestamp | Event Description | Severity | Project
- Rows: Last 10 events
- Sortable by timestamp
- Pagination: "View All Events" link
- Timestamp format: "HH:MM on DD/MM"

### Interactions
- **Refresh Button**: Top right, updates all data
- **Card Click**: Navigates to detail page (if applicable)
- **Chart Legend**: Toggle series visibility
- **Time Range Selector**: "Last 7 days" / "Last 30 days" / "Last 90 days"

### States
- **Loading**: Skeleton screens for all KPI cards and charts
- **Empty**: "No data available - check back soon"
- **Error**: "Unable to load dashboard data"

---

## 2. Projects

### Purpose
View and manage all monitoring projects.

### Layout Structure
```
┌────────────────────────────────────────────────────────┐
│ [HEADER: Projects]                  [Search...] [+Add] │
├────────────────────────────────────────────────────────┤
│ FILTERS: [Customer ▼] [Country ▼] [Region ▼]           │
│          [Status ▼] [Supplier ▼] [Reset]               │
├────────────────────────────────────────────────────────┤
│ CARD VIEW (3-column grid)                               │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │
│ │ Roadrunner   │ │ La Nava      │ │ Parkes Solar    │ │
│ │ Solar Plant  │ │ Solar Plant  │ │ Farm            │ │
│ │ 🟢 In Op     │ │ 🟡 In Comm   │ │ 🔴 Offline      │ │
│ │ Texas, USA   │ │ Navarre, ES  │ │ NSW, Australia  │ │
│ │ 250 MWdc     │ │ 600 MWdc     │ │ 75 MWdc         │ │
│ │ 728 Devices  │ │ 7885 Devices │ │ 340 Devices     │ │
│ │ Devices: ✓   │ │ Devices: ✓   │ │ Devices: ✗      │ │
│ │ Gateways: ✓  │ │ Gateways: ✗  │ │ Gateways: ✗     │ │
│ │ [View] [Edit]│ │ [View] [Edit]│ │ [View] [Edit]   │ │
│ └──────────────┘ └──────────────┘ └──────────────────┘ │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │
│ │ Ebro Solar   │ │ Luzia Solar  │ │ Alcaria         │ │
│ │ Plant        │ │ Complex      │ │                 │ │
│ │ 🟢 In Op     │ │ 🟡 In Const  │ │ 🟡 In Const     │ │
│ │ [View] [Edit]│ │ [View] [Edit]│ │ [View] [Edit]   │ │
│ └──────────────┘ └──────────────┘ └──────────────────┘ │
│ [< Page 1 of 5 >] Showing 6 of 47 projects             │
└────────────────────────────────────────────────────────┘
```

### Search & Filters
- **Search Bar**: "Search projects by name..."
- **Filters**:
  - Customer: Dropdown
  - Country: Dropdown
  - Region: Dropdown
  - Status: Checkboxes (In Operation, In Commissioning, In Construction, Offline)
  - Supplier: Dropdown

### Project Card (3-Column Grid)
**Specifications**:
- **Width**: ~33% of container, responsive to 2 then 1 column
- **Height**: Auto-height based on content
- **Header**: 
  - Project name (18px, 600 weight)
  - Status badge (top right, position absolute)
- **Body**:
  - Location (14px, secondary text)
  - Power capacity (e.g., "250 MWdc")
  - Device count
  - Gateway count
  - Device status indicator (✓ or ✗)
  - Gateway status indicator (✓ or ✗)
- **Footer**:
  - [View Details] button (secondary)
  - [Edit] button (tertiary)

**Status Badge**:
- In Operation: Green badge
- In Commissioning: Purple badge
- In Construction: Gray badge
- Offline: Red badge

**Hover State**:
- Shadow increases
- Cursor becomes pointer
- Buttons become more prominent

### Pagination
- Previous/Next buttons
- Page numbers (1-5 of 5)
- "Showing X of Y projects"
- Rows per page: 6, 12, 24

### Interactions
- **Search**: Filter projects in real-time
- **Filters**: Apply multiple filters simultaneously
- **Reset**: Clear all filters
- **Card Click**: Opens Project Detail modal or page
- **Edit**: Opens project editing modal
- **+Add**: Opens new project creation form

### States
- **Loading**: Card skeletons in grid
- **Empty**: "No projects found - adjust filters or create a new project"
- **Error**: "Unable to load projects"

---

## 3. Devices

### Purpose
Monitor all devices across all projects.

### Layout Structure
```
┌────────────────────────────────────────────────────────┐
│ [HEADER: Devices]                   [Search...] [+Add] │
├────────────────────────────────────────────────────────┤
│ FILTERS: [Status ▼] [Project ▼] [Gateway ▼]            │
│          [Temp ▼] [SOC ▼] [Reset] [Export CSV]         │
├────────────────────────────────────────────────────────┤
│ TABLE VIEW                                               │
│ ┌──────────┬───────────┬───────┬──────┬──────┬─────────┬│
│ │Device ID │Status     │Battery│Temp  │Volt  │Gateway  ││
│ │          │           │SOC    │(°C)  │(V)   │         ││
│ ├──────────┼───────────┼───────┼──────┼──────┼─────────┤│
│ │SNC_1     │🟢 Online  │ 75%   │ 25°C │ 54V  │NCU_6   ││
│ │SNC_2     │🔴 Offline │ 45%   │ 32°C │ 48V  │NCU_6   ││
│ │RSU_4     │🟢 Online  │ 82%   │ 28°C │ 56V  │TCU_718 ││
│ │TCU_1_7   │🟡 Warning │ 12%   │ 42°C │ 52V  │TCU_718 ││
│ │[View]    │[Edit]     │[...]  │      │      │         ││
│ ├──────────┼───────────┼───────┼──────┼──────┼─────────┤│
│ │...more rows...                                         ││
│ └──────────┴───────────┴───────┴──────┴──────┴─────────┘│
│ [< Page 1 of 50 >] Showing 50 of 2,456 devices          │
│ Rows per page: [50 ▼]                                    │
└────────────────────────────────────────────────────────┘
```

### Search & Filters
- **Search Bar**: "Search by device ID or name..."
- **Filters**:
  - Status: Online, Offline, Warning, Disabled
  - Project: Multi-select dropdown
  - Gateway: Multi-select dropdown
  - Temperature: Slider (min-max)
  - Battery SOC: Slider (min-max)
- **Actions**: Reset filters, Export to CSV

### Table Columns
| Column | Width | Type | Sortable | Details |
|--------|-------|------|----------|---------|
| Device ID | 120px | Text | Yes | Link to device detail |
| Status | 100px | Badge | Yes | 🟢/🔴/🟡 + Text |
| Battery SOC | 80px | Percentage | Yes | 0-100% |
| Temperature | 80px | Number | Yes | °C with color coding |
| Voltage | 80px | Number | Yes | Volts |
| Current | 80px | Number | Yes | Amps |
| Gateway | 100px | Text | Yes | Gateway ID link |
| Last Comm | 120px | Timestamp | Yes | "2 min ago" or timestamp |
| Actions | 80px | Buttons | No | View, Edit, More |

**Color Coding**:
- **Temperature**: Blue (<20°C) → Green (20-30°C) → Yellow (30-40°C) → Orange (40-50°C) → Red (>50°C)
- **SOC**: Red (<20%) → Orange (20-50%) → Yellow (50-75%) → Green (75-100%)
- **Status**: Green (Online), Red (Offline), Orange (Warning), Gray (Disabled)

### Table Features
- Sortable columns (click header to sort)
- Row hover: Light background highlight
- Sticky header: Header stays visible when scrolling
- Multi-select: Checkboxes to select multiple rows
- Bulk actions: Delete, Export, Change Status
- Row height: 48px
- Pagination: 50 rows per page (configurable)

### Row Actions Menu
- **View Details**: Opens Device Detail page
- **Edit**: Opens edit modal
- **More** (ellipsis):
  - Export telemetry
  - Download graphs
  - Configure alerts
  - Assign to project

### Interactions
- **Column Sort**: Click header, shows sort indicator (▲▼)
- **Search**: Real-time filtering
- **Filters**: Apply dynamically
- **Row Click**: Opens Device Detail page
- **Checkbox**: Select/deselect row
- **Export**: Download visible/selected rows as CSV

### States
- **Loading**: Table skeleton with 10 rows
- **Empty**: "No devices found - check filters or add a new device"
- **Error**: "Unable to load devices"
- **No Results**: "No devices match your search criteria"

---

## 4. Device Details

### Purpose
Comprehensive view of a single device with all historical data.

### Layout Structure
```
┌────────────────────────────────────────────────────────┐
│ [← Back] Device: SNC_1        [Edit] [Export] [Delete] │
├────────────────────────────────────────────────────────┤
│ STATUS OVERVIEW (3-card layout)                          │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │
│ │ Status       │ │ Battery      │ │ Connectivity    │ │
│ │ 🟢 Online    │ │ SOC: 75%     │ │ 🟢 Connected    │ │
│ │ Uptime: 99%  │ │ SOH: 92%     │ │ Link: Ethernet  │ │
│ │ Connected 2h │ │ Cycles: 245  │ │ Last Sync: 30s  │ │
│ └──────────────┘ └──────────────┘ └──────────────────┘ │
├────────────────────────────────────────────────────────┤
│ DEVICE INFORMATION (Left) | CURRENT READINGS (Right)   │
│ ┌─────────────────────────┐ ┌──────────────────────┐   │
│ │ Project: Roadrunner     │ │ Voltage: 54 V        │   │
│ │ Gateway: NCU_6          │ │ Current: 45 mA       │   │
│ │ Location: Texas, USA    │ │ Temperature: 25°C    │   │
│ │ Installed: Jan 5, 2024  │ │ Power: 2.43 kW       │   │
│ │ Firmware: v2.1.4        │ │ Last Updated: 30s    │   │
│ │ Serial: ABC-123456      │ │                      │   │
│ └─────────────────────────┘ └──────────────────────┘   │
├────────────────────────────────────────────────────────┤
│ CHARTS (2x2 grid)                                        │
│ ┌──────────────────┐ ┌──────────────────────────────┐  │
│ │ Battery SOC      │ │ Temperature Trend            │  │
│ │ (Line, 30d)      │ │ (Line, 30d)                  │  │
│ │                  │ │ Min: 15°C, Max: 42°C, Avg: 25°C│
│ └──────────────────┘ └──────────────────────────────┘  │
│ ┌──────────────────┐ ┌──────────────────────────────┐  │
│ │ Voltage Trend    │ │ Current Trend                │  │
│ │ (Line, 30d)      │ │ (Line, 30d)                  │  │
│ └──────────────────┘ └──────────────────────────────┘  │
├────────────────────────────────────────────────────────┤
│ TIME RANGE SELECTOR: [Last 7 Days ▼] [Last 30 Days]   │
│                      [Last 90 Days] [Custom Range]     │
├────────────────────────────────────────────────────────┤
│ ALARMS & EVENTS                                          │
│ ┌──────────────────────────────────────────────────────┐│
│ │ Recent Alarms                    Active Alarms (0)   ││
│ │ ┌─────────────┬──────┬────────────────────────┐      ││
│ │ │Timestamp    │Sever │Description             │      ││
│ │ ├─────────────┼──────┼────────────────────────┤      ││
│ │ │14:32 07/05  │🔴 Crit│Low Battery (SOC < 15%) │      ││
│ │ │12:10 06/05  │🟡 Warn│High Temp (>40°C)       │      ││
│ │ │[View More]                                  │      ││
│ │ └─────────────┴──────┴────────────────────────┘      ││
│ └──────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────┘
```

### Status Cards (3 Cards)
1. **Status**
   - Status badge (Online/Offline/Warning)
   - Uptime percentage
   - Last connection time
   - Connection duration

2. **Battery**
   - SOC percentage (with color)
   - SOH percentage (with trend)
   - Cycle count
   - Remaining capacity (Ah)

3. **Connectivity**
   - Connection status badge
   - Link type (Ethernet, WiFi, 4G)
   - Last sync time
   - IP Address

### Information Section (Left Column)
- Device ID
- Project Name (link)
- Gateway (link)
- Location (address/coordinates)
- Installation date
- Firmware version
- Serial number
- Device type/model
- Supplier
- Warranty info

### Current Readings (Right Column)
- Voltage (V) with min/max today
- Current (A) with min/max today
- Temperature (°C) with status
- Power (kW)
- Energy (kWh) - today/month/total
- Efficiency (%)
- Last updated timestamp

### Charts (4 Total)
1. **Battery SOC Trend**: Line chart, 30 days, min/max/avg
2. **Temperature Trend**: Line chart, 30 days, min/max/avg
3. **Voltage Trend**: Line chart, 30 days, min/max/avg
4. **Current Trend**: Line chart, 30 days, min/max/avg

### Time Range Selector
- Buttons: Last 7 Days | Last 30 Days | Last 90 Days | Custom Range
- Custom range: Date picker popup
- Updates all charts simultaneously

### Alarms & Events Table
- Columns: Timestamp | Severity | Type | Description | Status
- Rows: Last 20 alarms
- Severity badges: 🔴 Critical | 🟡 Warning | 🟢 Info
- [View More] link to open full alarms table

### Interactions
- **Back Button**: Return to Devices list
- **Edit Button**: Opens device edit modal
- **Export Button**: Download device data/charts as PDF
- **Delete Button**: Remove device (with confirmation)
- **Chart Interaction**: Hover to see values, legend toggle
- **Time Range**: Click to change all chart date ranges
- **Alarm Row Click**: Show alarm details

### States
- **Loading**: Skeleton screens for all sections
- **Error**: "Unable to load device data"
- **No Data**: "No data available for selected time range"

---

## 5. Gateways

### Purpose
Monitor all network gateways and their connectivity.

### Layout Structure
```
┌────────────────────────────────────────────────────────┐
│ [HEADER: Gateways]                  [Search...] [+Add] │
├────────────────────────────────────────────────────────┤
│ FILTERS: [Status ▼] [Project ▼] [Signal ▼]             │
│          [Reset] [Export CSV]                           │
├────────────────────────────────────────────────────────┤
│ TABLE VIEW                                               │
│ ┌──────────┬───────────┬───────────┬──────┬─────────────┬│
│ │Gateway   │Status     │Devices    │Signal│IP Address  ││
│ │ID        │           │Connected  │      │            ││
│ ├──────────┼───────────┼───────────┼──────┼─────────────┤│
│ │NCU_6     │🟢 Online  │ 12 / 12   │ 95%  │192.168.1.10││
│ │TCU_718   │🟢 Online  │ 45 / 50   │ 88%  │192.168.1.20││
│ │RSU_4     │🔴 Offline │ 0 / 15    │ 0%   │192.168.1.30││
│ │TCU_1_7   │🟡 Warning │ 8 / 10    │ 42%  │192.168.1.40││
│ │[View]    │[Config]   │[...]      │      │             ││
│ └──────────┴───────────┴───────────┴──────┴─────────────┘│
│ [< Page 1 of 3 >] Showing 50 of 145 gateways             │
└────────────────────────────────────────────────────────┘
```

### Table Columns
| Column | Width | Type | Sortable | Details |
|--------|-------|------|----------|---------|
| Gateway ID | 100px | Text | Yes | Link to detail |
| Status | 100px | Badge | Yes | 🟢/🔴/🟡 |
| Devices Connected | 120px | Number | Yes | X / Total |
| Signal Strength | 100px | Percentage | Yes | 0-100% with bars |
| IP Address | 130px | Text | No | IPv4 address |
| Firmware | 100px | Text | Yes | Version number |
| Last Sync | 120px | Timestamp | Yes | "1 min ago" |
| Actions | 80px | Buttons | No | View, Config, More |

### Search & Filters
- **Search**: "Search by gateway ID or IP address..."
- **Filters**:
  - Status: Online, Offline, Warning
  - Project: Multi-select
  - Signal Strength: Slider (0-100%)
- **Export**: CSV export of current view

### Gateway Card (Alternative View)
Optional card view for gateways:
- Gateway ID (header)
- Status badge
- Connected devices: X / Y
- Signal strength: Progress bar + percentage
- IP Address
- Firmware version
- Last sync time
- [View Details] [Configure] buttons

### Interactions
- **Search**: Real-time filtering
- **Row Click**: Opens Gateway Detail page
- **View**: Opens details modal
- **Configure**: Opens network configuration modal
- **More**: Additional actions menu

### States
- **Loading**: Table skeleton
- **Empty**: "No gateways found"
- **Offline Warning**: Highlight offline gateways

---

## 6. Alarms

### Purpose
Monitor and manage all system alarms.

### Layout Structure
```
┌────────────────────────────────────────────────────────┐
│ [HEADER: Alarms]                    [Search...] [+New] │
├────────────────────────────────────────────────────────┤
│ FILTERS: [Severity ▼] [Status ▼] [Project ▼]           │
│          [Date ▼] [Reset] [Export CSV]                 │
├────────────────────────────────────────────────────────┤
│ SUMMARY CARDS (1x4 layout)                              │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                    │
│ │ 23   │ │ 12   │ │ 8    │ │ 3    │                    │
│ │Critical│ Warning│ Info │ Resolved                   │
│ └──────┘ └──────┘ └──────┘ └──────┘                    │
├────────────────────────────────────────────────────────┤
│ TABLE VIEW                                               │
│ ┌──────────┬──────┬──────────┬────────┬────────────────┬│
│ │Alarm Type│Sever │Device    │Project │Timestamp      ││
│ │          │ity  │          │        │               ││
│ ├──────────┼──────┼──────────┼────────┼────────────────┤│
│ │Low Battery│🔴   │SNC_1    │RSP     │14:32 07/05     ││
│ │High Temp │🟡   │TCU_1_7  │RSP     │12:10 06/05     ││
│ │Offline   │🔴   │RSU_4    │LNP     │08:42 05/05     ││
│ │Comm Lost │🟡   │NCU_6    │RSP     │22:15 04/05     ││
│ │[Ack] [...] │      │          │        │               ││
│ └──────────┴──────┴──────────┴────────┴────────────────┘│
│ [< Page 1 of 5 >] Showing 15 of 73 alarms               │
└────────────────────────────────────────────────────────┘
```

### Summary Cards (4 Cards)
- **Critical**: Red badge, count
- **Warning**: Orange badge, count
- **Info**: Blue badge, count
- **Resolved**: Gray badge, count
- Click card to filter by severity

### Table Columns
| Column | Width | Type | Sortable | Details |
|--------|-------|------|----------|---------|
| Alarm Type | 130px | Text | Yes | Name of alarm rule |
| Severity | 80px | Badge | Yes | 🔴/🟡/🟢/⚪ |
| Device ID | 100px | Text | Yes | Link to device |
| Gateway | 100px | Text | Yes | Gateway ID |
| Project | 100px | Text | Yes | Project name |
| Timestamp | 140px | DateTime | Yes | "07/05 14:32" |
| Status | 80px | Badge | No | Active/Acknowledged/Resolved |
| Actions | 100px | Buttons | No | Acknowledge, View, More |

### Search & Filters
- **Search**: "Search by alarm type or device..."
- **Filters**:
  - Severity: Critical, Warning, Info
  - Status: Active, Acknowledged, Resolved
  - Project: Multi-select
  - Date: Date range picker
  - Device: Multi-select
- **Export**: CSV with selected/filtered alarms

### Alarm Detail Modal
When clicking an alarm:
- Alarm ID
- Type & Severity badge
- Device information (link)
- Project (link)
- Timestamp
- Description
- Threshold/Value info
- Acknowledged by (if applicable)
- [Acknowledge] [Resolve] [Close] buttons

### Interactions
- **Severity Badge Click**: Filter by severity
- **Device Link**: Navigate to device detail
- **Project Link**: Navigate to project detail
- **Acknowledge**: Mark alarm as acknowledged (grays out)
- **Resolve**: Mark alarm as resolved (archives it)
- **More**: Delete, Edit threshold, Export details
- **Search**: Real-time filtering

### Bulk Actions
- Multi-select checkboxes
- Selected action buttons:
  - [Acknowledge Selected] [Resolve Selected] [Delete Selected]

### States
- **Loading**: Table skeleton with 10 rows
- **Empty**: "No alarms - great work!"
- **All Resolved**: Show resolved count only
- **Filtering**: Show active filter badges

---

## 7. Battery Health

### Purpose
Dedicated view for battery monitoring metrics.

### Layout Structure
```
┌────────────────────────────────────────────────────────┐
│ [HEADER: Battery Health]  [Project ▼] [Time Range ▼]   │
├────────────────────────────────────────────────────────┤
│ METRICS (6 cards in 3x2 grid)                            │
│ ┌──────────┐ ┌──────────┐ ┌────────────┐              │
│ │ Avg SOC  │ │ Avg SOH  │ │ Min SOC    │              │
│ │ 72%      │ │ 82%      │ │ 12% 🔴    │              │
│ │ Trending ✓ │ Healthy ✓  │ Alert      │              │
│ └──────────┘ └──────────┘ └────────────┘              │
│ ┌──────────┐ ┌──────────┐ ┌────────────┐              │
│ │ Avg Temp │ │ Cycles   │ │ Remaining  │              │
│ │ 25°C     │ │ Avg: 245 │ │ Capacity   │              │
│ │ Normal ✓   │ Max: 456   │ 87% 🟢    │              │
│ └──────────┘ └──────────┘ └────────────┘              │
├────────────────────────────────────────────────────────┤
│ CHARTS (2x2 grid)                                        │
│ ┌──────────────────┐ ┌────────────────────────────────┐ │
│ │ SOC Trend        │ │ SOH Trend                      │ │
│ │ (Line)           │ │ (Line)                         │ │
│ │ Min/Max/Avg      │ │ Declining/Stable/Improving    │ │
│ └──────────────────┘ └────────────────────────────────┘ │
│ ┌──────────────────┐ ┌────────────────────────────────┐ │
│ │ Temperature Dist │ │ Cycle Distribution            │ │
│ │ (Histogram)      │ │ (Bar chart)                    │ │
│ │ Range: 10-45°C   │ │ Low/Mid/High cycles           │ │
│ └──────────────────┘ └────────────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│ HEALTH SCORE (Gauge)                                     │
│ ┌────────────────────────────────────────────────────────┐
│ │ System Health Score: 82/100 (Good) 🟢                │
│ │ Based on: SOH (40%), Temperature (30%), Cycles (20%)  │
│ │ [View Calculation Details]                             │
│ └────────────────────────────────────────────────────────┘
├────────────────────────────────────────────────────────┤
│ BATTERY DEVICES TABLE                                    │
│ ┌──────────┬───────┬───────┬──────────┬────────────────┬│
│ │Device    │SOC    │SOH    │Temp      │Status          ││
│ ├──────────┼───────┼───────┼──────────┼────────────────┤│
│ │SNC_1     │ 75%   │ 92%   │ 25°C     │🟢 Healthy      ││
│ │SNC_2     │ 45%   │ 85%   │ 32°C     │🟢 Good         ││
│ │RSU_4     │ 12%   │ 78%   │ 42°C     │🔴 Critical     ││
│ │TCU_1_7   │ 82%   │ 88%   │ 28°C     │🟢 Excellent    ││
│ │[View]                                                  ││
│ └──────────┴───────┴───────┴──────────┴────────────────┘│
└────────────────────────────────────────────────────────┘
```

### Top Metrics (6 Cards)
| Metric | Value | Status | Trend |
|--------|-------|--------|-------|
| Average SOC | 72% | Healthy | ↗ Increasing |
| Average SOH | 82% | Good | ↘ Slight Decline |
| Minimum SOC | 12% | Critical | ↗ Improving |
| Average Temperature | 25°C | Optimal | → Stable |
| Average Cycles | 245 | Normal | → Stable |
| Remaining Capacity | 87% | Excellent | ↘ Declining |

### Charts (4 Total)
1. **SOC Trend**: Line chart over time (7/30/90 days)
   - Min/Max bands
   - Average line
   - Color: Blue
   
2. **SOH Trend**: Line chart over time
   - Declining/Stable/Improving zones
   - Threshold line (80%)
   - Color: Orange warning zone
   
3. **Temperature Distribution**: Histogram
   - X-axis: Temperature ranges (5°C buckets)
   - Y-axis: Count of batteries
   - Color: Green → Yellow → Red zones
   - Mark optimal range (20-30°C)
   
4. **Cycle Distribution**: Stacked bar chart
   - Categories: Low (<200), Mid (200-400), High (>400)
   - Shows device count in each
   - Color coded by health impact

### Health Score Gauge
- **Central Display**: 82/100 with "Good" label
- **Gauge Arc**: Visual representation (green→yellow→red)
- **Calculation**: Show weightage:
  - SOH: 40% (Gauge reading)
  - Temperature: 30% (Optimal range compliance)
  - Cycles: 20% (Cycle aging factor)
  - Other: 10% (Voltage stability)
- **Expand Details**: Show calculation breakdown

### Battery Devices Table
- Columns: Device ID | SOC | SOH | Temp | Status
- Sortable by each column
- Row colors: Green (healthy), Yellow (warning), Red (critical)
- Click row: Navigate to device details
- Pagination: 25 rows per page

### Time Range Selector
- Buttons: Last 7 Days | Last 30 Days | Last 90 Days | Custom
- Updates all charts
- Persistent across session

### Interactions
- **Project Filter**: Change entire view to single project
- **Chart Hover**: Show values at specific times
- **Legend Toggle**: Show/hide series in charts
- **Device Click**: Navigate to device detail page
- **Export**: Download health report as PDF

### States
- **Loading**: Skeleton screens for all cards and charts
- **No Data**: "No battery health data available"
- **All Healthy**: Celebrate message "All batteries healthy! 🎉"

---

## 8. Performance

### Purpose
System-wide performance metrics and trends.

### Layout Structure
```
┌────────────────────────────────────────────────────────┐
│ [HEADER: Performance]  [View ▼] [Time Range ▼] [Export]│
├────────────────────────────────────────────────────────┤
│ KPI CARDS (4 cards in 1x4 layout)                        │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│ │Availability│Energy     │Efficiency │Comm Health │  │
│ │99.5%     │2,456 MWh   │96.2%      │98.7%       │  │
│ │↗ +2%     │↗ +150 MWh  │↗ +1.2%    │↗ +0.5%     │  │
│ │Excellent │Good        │Excellent  │Excellent   │  │
│ └──────────┘ └──────────┘ └──────────┘ └────────────┘  │
├────────────────────────────────────────────────────────┤
│ TREND CHARTS (2x2 grid)                                  │
│ ┌──────────────────┐ ┌────────────────────────────────┐ │
│ │ System Uptime    │ │ Energy Generation              │ │
│ │ (Line Chart)     │ │ (Area Chart)                   │ │
│ │ 7-day moving avg │ │ Daily generation trends        │ │
│ └──────────────────┘ └────────────────────────────────┘ │
│ ┌──────────────────┐ ┌────────────────────────────────┐ │
│ │ Device Health    │ │ Gateway Connectivity           │ │
│ │ (Line Chart)     │ │ (Line Chart)                   │ │
│ │ % healthy trend  │ │ % connected devices            │ │
│ └──────────────────┘ └────────────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│ DETAILED METRICS (Tabbed Section)                        │
│ [Charging] [Discharging] [Power Output]                 │
├────────────────────────────────────────────────────────┤
│ CHARGING METRICS:                                        │
│ ┌────────┬────────────┬──────────┬──────────────────────┐
│ │Period  │Avg Power   │Peak Power│Energy Delivered     │
│ ├────────┼────────────┼──────────┼──────────────────────┤
│ │Daily   │ 1,245 kW   │ 2,456 kW │ 12,450 kWh          │
│ │Weekly  │ 1,234 kW   │ 2,500 kW │ 87,120 kWh          │
│ │Monthly │ 1,189 kW   │ 2,456 kW │ 387,600 kWh         │
│ └────────┴────────────┴──────────┴──────────────────────┘
└────────────────────────────────────────────────────────┘
```

### KPI Cards (4 Cards)
| KPI | Value | Trend | Status | Details |
|-----|-------|-------|--------|---------|
| System Availability | 99.5% | ↗ +2% | Excellent | This period |
| Energy Generation | 2,456 MWh | ↗ +150 MWh | Good | This month |
| Efficiency | 96.2% | ↗ +1.2% | Excellent | System-wide |
| Communication Health | 98.7% | ↗ +0.5% | Excellent | Gateway avg |

### Trend Charts (4 Total, Top 2x2 Grid)
1. **System Uptime**: Line chart
   - X-axis: Last 30 days
   - Y-axis: Uptime percentage (%)
   - 7-day moving average line
   - Shaded area: Status zones

2. **Energy Generation**: Area chart
   - X-axis: Last 30 days
   - Y-axis: MWh generated
   - Stacked areas: Actual vs. Expected
   - Peak indicator

3. **Device Health**: Line chart
   - X-axis: Last 30 days
   - Y-axis: % healthy devices
   - Threshold line: 95%
   - Color: Green above, red below

4. **Gateway Connectivity**: Line chart
   - X-axis: Last 30 days
   - Y-axis: % connected devices
   - Multiple lines: Per gateway or all
   - Alerts for drops

### Detailed Metrics Tabs
Three tabs with table views:

**Tab 1: Charging Metrics**
| Period | Avg Power | Peak Power | Sessions | Energy |
|--------|-----------|------------|----------|--------|
| Daily | 1,245 kW | 2,456 kW | 145 | 12,450 kWh |
| Weekly | 1,234 kW | 2,500 kW | 1,015 | 87,120 kWh |
| Monthly | 1,189 kW | 2,456 kW | 4,350 | 387,600 kWh |

**Tab 2: Discharging Metrics**
| Period | Avg Power | Peak Power | Sessions | Energy |
|--------|-----------|------------|----------|--------|
| Daily | 789 kW | 1,567 kW | 98 | 7,890 kWh |
| Weekly | 854 kW | 1,654 kW | 686 | 55,230 kWh |
| Monthly | 823 kW | 1,789 kW | 2,945 | 238,950 kWh |

**Tab 3: Power Output**
| Period | Avg Output | Peak Output | Efficiency | Cycles |
|--------|-----------|------------|------------|--------|
| Daily | 456 kW | 1,234 kW | 94.5% | 12 |
| Weekly | 445 kW | 1,267 kW | 94.2% | 87 |
| Monthly | 433 kW | 1,289 kW | 93.8% | 378 |

### Time Range Selector
- Buttons: Last 7 Days | Last 30 Days | Last 90 Days | Last Year
- Custom range: Date picker

### Export Options
- [Export Report] button: PDF with all metrics and charts
- [Export Data] button: CSV with detailed metrics

### View Options Dropdown
- System-wide view (default)
- By Project
- By Gateway
- By Device Type

---

## 9. Reports

### Purpose
Generate and download custom reports.

### Layout Structure
```
┌────────────────────────────────────────────────────────┐
│ [HEADER: Reports]                      [View History] │
├────────────────────────────────────────────────────────┤
│ REPORT BUILDER FORM                                     │
│ ┌────────────────────────────────────────────────────────┐
│ │ Report Type:                                          │
│ │ ○ Battery Health Report    ○ Alarm Summary Report    │
│ │ ○ Performance Report        ○ Device Status Report    │
│ │ ○ Energy Generation Report  ○ Maintenance Report     │
│ ├────────────────────────────────────────────────────────┤
│ │ Scope:                                                │
│ │ ○ All Projects   ○ Specific Project ▼                │
│ │ ○ Specific Device [Select Device ▼]                  │
│ │ ○ Specific Gateway [Select Gateway ▼]                │
│ ├────────────────────────────────────────────────────────┤
│ │ Date Range:                                           │
│ │ From: [Date Picker] To: [Date Picker]                 │
│ │ OR Preset: [This Week] [This Month] [This Year]       │
│ ├────────────────────────────────────────────────────────┤
│ │ Sections to Include (checkboxes):                     │
│ │ ☑ Executive Summary  ☑ Key Metrics  ☑ Charts         │
│ │ ☑ Device Details     ☑ Alarms       ☑ Recommendations│
│ ├────────────────────────────────────────────────────────┤
│ │ Format:                                               │
│ │ ○ PDF (Full Report)    ○ CSV (Data Export)            │
│ │ ○ Excel (Spreadsheet)                                 │
│ ├────────────────────────────────────────────────────────┤
│ │ Schedule (Optional):                                  │
│ │ □ Send Email to: [email input]                        │
│ │ □ Recurring: [Never ▼] [Weekly] [Monthly] [Quarterly]│
│ └────────────────────────────────────────────────────────┘
│ [RESET] [PREVIEW] [GENERATE REPORT] [DOWNLOAD]         │
├────────────────────────────────────────────────────────┤
│ RECENT REPORTS                                           │
│ ┌──────────────────────────────────────────────────────┐
│ │ Report Name              | Date       | Status       │
│ ├──────────────────────────────────────────────────────┤
│ │ Battery Health - July    │ 07/07/24  │ ✓ Ready     │
│ │ All Projects             │ 07/01/24  │ ✓ Ready     │
│ │ Roadrunner Solar - June  │ 06/30/24  │ ✓ Ready     │
│ │ [Download] [Preview] [Share]                         │
│ └──────────────────────────────────────────────────────┘
└────────────────────────────────────────────────────────┘
```

### Report Builder Form

**1. Report Type** (Radio Buttons)
- Battery Health Report: SOC, SOH, Temperature, Cycles
- Alarm Summary Report: All alarms, severity, trends
- Performance Report: Uptime, efficiency, energy
- Device Status Report: Individual device metrics
- Energy Generation Report: Generation trends, efficiency
- Maintenance Report: Recommended maintenance items

**2. Scope** (Radio Buttons)
- All Projects (system-wide)
- Specific Project (dropdown to select)
- Specific Device (search/select)
- Specific Gateway (dropdown to select)

**3. Date Range**
- From/To date pickers
- OR Preset buttons: This Week | This Month | This Year | Custom

**4. Sections to Include** (Checkboxes)
- Executive Summary
- Key Metrics & KPIs
- Charts & Visualizations
- Device/Gateway Details
- Alarms & Issues
- Recommendations
- Technical Details
- Comparative Analysis

**5. Format** (Radio Buttons)
- PDF: Professional full report (default)
- CSV: Data export for spreadsheets
- Excel: Formatted spreadsheet with tabs

**6. Schedule (Optional)** (Checkboxes)
- Send Email to: [email input]
- Recurring: Dropdown (Never, Weekly, Monthly, Quarterly, Annually)

### Buttons
- **[RESET]**: Clear form to defaults
- **[PREVIEW]**: Show sample report (opens modal)
- **[GENERATE REPORT]**: Create report (shows progress)
- **[DOWNLOAD]**: Download generated report

### Recent Reports Table
| Report Name | Date | Type | Size | Status | Actions |
|-------------|------|------|------|--------|---------|
| Battery Health - July | 07/07/24 | PDF | 2.3 MB | Ready | Download, Preview, Share, Delete |
| All Projects | 07/01/24 | CSV | 1.2 MB | Ready | Download, Preview, Share, Delete |

### Report Generation Progress
- Modal showing: Report generating...
- Progress bar: 0-100%
- Cancel button: Stop generation
- Auto-download when complete

---

## 10. Activity Logs

### Purpose
Track all user actions and system events.

### Layout Structure
```
┌────────────────────────────────────────────────────────┐
│ [HEADER: Activity Logs]            [Search...] [Export]│
├────────────────────────────────────────────────────────┤
│ FILTERS: [User ▼] [Action ▼] [Module ▼]                │
│          [Date Range ▼] [Reset] [Export CSV]           │
├────────────────────────────────────────────────────────┤
│ TABLE VIEW                                               │
│ ┌──────────┬──────────┬────────┬──────────┬─────────────┬│
│ │Timestamp │User      │Action  │Module    │Description ││
│ ├──────────┼──────────┼────────┼──────────┼─────────────┤│
│ │07/07 14:32│John Smith│View    │Devices   │Viewed SNC_1││
│ │07/07 14:15│Jane Doe  │Update  │Alarms    │Acknowledged││
│ │07/07 13:58│John Smith│Export  │Reports   │Generated PDF││
│ │07/07 12:42│Admin     │Delete  │Settings  │Removed user││
│ │07/07 11:20│Jane Doe  │Create  │Devices   │Added device││
│ │07/07 10:05│John Smith│Login   │System    │User login   ││
│ │[Details] [...]                                         ││
│ └──────────┴──────────┴────────┴──────────┴─────────────┘│
│ [< Page 1 of 50 >] Showing 50 of 2,345 activities        │
└────────────────────────────────────────────────────────┘
```

### Table Columns
| Column | Width | Type | Sortable | Details |
|--------|-------|------|----------|---------|
| Timestamp | 130px | DateTime | Yes | "07/07 14:32:45" |
| User | 120px | Text | Yes | User name or "System" |
| Action | 100px | Text | Yes | View, Edit, Delete, Create, Export, Login, Logout, etc. |
| Module | 100px | Text | Yes | Devices, Projects, Alarms, Reports, Settings, etc. |
| Target | 120px | Text | Yes | Item affected (Device ID, Project name, etc.) |
| Description | 250px | Text | Yes | Human-readable action details |
| Status | 80px | Badge | Yes | Success ✓, Failed ✗, Pending ⏳ |
| IP Address | 120px | Text | No | Source IP address |

### Search & Filters
- **Search**: "Search by user, action, or description..."
- **Filters**:
  - User: Multi-select dropdown
  - Action: Checkboxes (View, Edit, Create, Delete, Login, Export, etc.)
  - Module: Checkboxes (Devices, Projects, Alarms, Reports, Settings, System)
  - Date Range: Date picker
  - Status: Success, Failed, Pending
- **Export**: CSV with all visible/filtered logs

### Activity Detail Modal
When clicking a row:
- Timestamp (full)
- User (link to user profile)
- Action (with details)
- Module/Target
- Description
- IP Address
- Request ID
- Status (success/failure)
- Error details (if applicable)
- Changes made (if edit action - show before/after)

### Interactions
- **Row Click**: Open activity details modal
- **User Link**: Filter by that user
- **Search**: Real-time filtering
- **Export**: Download visible logs as CSV
- **Timestamp Sort**: Sort by date (newest first by default)

### States
- **Loading**: Table skeleton with 20 rows
- **Empty**: "No activity logs found"
- **High Volume**: Show pagination clearly
- **Search Results**: Show number of results found

### Audit Trail Features
- Immutable logs (cannot be deleted, only archived)
- Retention policy: 1 year default
- Administrator only access to complete logs
- Compliance: GDPR, SOX ready format

---

## 11. Settings

### Purpose
Application configuration and administration.

### Layout Structure
```
┌────────────────────────────────────────────────────────┐
│ [HEADER: Settings]                                      │
├────────────────────────────────────────────────────────┤
│ SETTINGS NAVIGATION (Left sidebar or tabs)              │
│ ┌─────────────────┬──────────────────────────────────────┐
│ │ • Account       │ ACCOUNT SETTINGS                     │
│ │ • Company       │                                      │
│ │ • Users & Roles │ Name: John Smith                     │
│ │ • Notifications │ Email: john@company.com             │
│ │ • Theme         │ Company: ENEL                        │
│ │ • Security      │ Role: Administrator                  │
│ │ • Integrations  │ [Edit Profile] [Change Password]    │
│ │ • System Config │                                      │
│ │ • Backup & Data │ ──────────────────────────────────── │
│ │ • Help & Support│ Change Password:                     │
│ │                 │ Current Password: [input]            │
│ │                 │ New Password: [input]                │
│ │                 │ Confirm Password: [input]            │
│ │                 │ [Save] [Cancel]                     │
│ │                 │                                      │
│ │                 │ Two-Factor Auth:                     │
│ │                 │ ☑ Enabled (Last verified: 3 days)   │
│ │                 │ [Manage]                             │
│ └─────────────────┴──────────────────────────────────────┘
└────────────────────────────────────────────────────────┘
```

### Settings Sections

#### 1. Account Settings
- **Personal Information**:
  - Name (text input)
  - Email (text input)
  - Company (text input, read-only)
  - Job Title (text input)
  - Phone (text input)
  - Avatar (upload image)
  - [Edit] / [Save] / [Cancel] buttons

- **Authentication**:
  - Change Password form
  - Two-Factor Authentication toggle
  - Active sessions list (Sign out other sessions)
  - Login history

#### 2. Company Settings (Admin Only)
- **Company Profile**:
  - Company name
  - Address
  - Phone
  - Website
  - Logo upload
  - Industry
  - [Edit] / [Save]

- **Billing**:
  - Current plan
  - Renewal date
  - Payment method
  - [Upgrade Plan] [Cancel Subscription]

#### 3. Users & Roles (Admin Only)
- **Users Table**:
  - Columns: Name | Email | Role | Status | Last Login | Actions
  - Add user button: [+Add User]
  - Search and filter users
  - Edit/Deactivate/Delete actions

- **User Form** (modal):
  - First Name, Last Name, Email
  - Role: Admin, Manager, User, Guest
  - Send invitation email checkbox
  - [Create] / [Cancel]

- **Roles Management**:
  - Predefined roles: Admin, Manager, User, Guest
  - Custom roles (if supported)
  - Role permissions matrix
  - [Edit] / [Delete] role

#### 4. Notifications Settings
- **Email Notifications**:
  - ☑ Critical Alerts
  - ☑ Daily Summary
  - ☑ Weekly Report
  - ☑ Account Updates
  - ☑ Maintenance Alerts

- **Notification Channels**:
  - Email (toggle)
  - SMS (toggle)
  - Push Notifications (toggle)

- **Alert Configuration**:
  - Alert Level: Critical | Warning | Info
  - Frequency: Real-time | Hourly | Daily | Weekly
  - Recipients: Select users/roles

#### 5. Theme Settings
- **Color Theme**:
  - ○ Light Mode (default)
  - ○ Dark Mode
  - ○ Auto (system preference)

- **Language**:
  - Dropdown: English, Spanish, German, French, etc.

- **Date & Time Format**:
  - Date format: MM/DD/YYYY | DD/MM/YYYY | YYYY-MM-DD
  - Time format: 12-hour | 24-hour
  - Timezone: Dropdown with all timezones

#### 6. Security Settings (Admin Only)
- **Password Policy**:
  - Minimum length: [8] characters
  - Require uppercase: ☑
  - Require numbers: ☑
  - Require special characters: ☑
  - Expiration: [90] days (0 = never)

- **Session Management**:
  - Session timeout: [30] minutes
  - Remember me: ☑ (14 days)

- **IP Whitelist** (optional):
  - Add IP addresses/ranges
  - [Add IP] [Remove] buttons

- **API Keys** (for integrations):
  - Existing keys table
  - Key name | Created | Last Used | Status | [Delete]
  - [Generate New Key] button

#### 7. Integrations (Optional)
- **Connected Services**:
  - ☑ Slack (Connected as #alerts)
  - ☑ Email Notifications (Configured)
  - ☐ Webhook (Not connected)
  - [Configure] / [Disconnect] buttons

#### 8. System Configuration (Admin Only)
- **System Settings**:
  - Data retention period: [365] days
  - Alarm retention: [730] days
  - Default units: Celsius | Fahrenheit
  - Energy units: kWh | MWh | GWh
  - Power units: kW | MW | GW

- **Maintenance Mode**:
  - □ Enable maintenance mode
  - Message: [text area]
  - Maintenance window: [Date/Time]

#### 9. Backup & Data (Admin Only)
- **Backup Options**:
  - Last backup: [timestamp]
  - Auto-backup: ☑ Daily
  - Retention: [30] days
  - [Backup Now] [Download Latest] buttons

- **Data Export**:
  - Export all user data: [Export] button
  - Export audit logs: [Export] button
  - GDPR compliance: Automatic format

#### 10. Help & Support
- **Documentation Links**:
  - User Guide
  - API Documentation
  - FAQ
  - Release Notes

- **Contact Support**:
  - Support email
  - Support phone
  - Live chat widget
  - Submit ticket form

- **System Status**:
  - System status page link
  - Incident history

### Settings Navigation
- **Sidebar** (left column on desktop):
  - List of all settings sections
  - Current section highlighted
  - Icons for each section
  - Collapsible on mobile

- **Tabs** (alternative on mobile):
  - Scrollable horizontal tabs
  - Active tab highlighted

### Interactions
- **Save Button**: Validates and saves changes
- **Cancel Button**: Discard changes
- **Confirmation**: "Are you sure?" for destructive actions
- **Success Toast**: "Settings saved successfully"
- **Error Handling**: Show validation errors inline

### States
- **Unsaved Changes**: Save button becomes prominent
- **Loading**: Disable inputs while saving
- **Error**: Show error message and keep form data
- **Success**: Flash success message, reload data

---

## General Page Rules

### Every Page Must Have:

1. **Left Sidebar Navigation**
   - Logo/branding at top
   - 10 navigation items
   - Current page highlighted
   - User menu at bottom (avatar, logout)

2. **Top Header**
   - Page title
   - Breadcrumb trail (optional)
   - Search bar (if applicable)
   - Notifications bell
   - User profile dropdown
   - Settings icon

3. **Content Area**
   - Consistent left/right padding (32px)
   - Max width: 1440px
   - Responsive grid system
   - Whitespace: 24px between sections

4. **Interactive Elements**
   - Search functionality
   - Filter options
   - Pagination (if >20 rows/items)
   - Export options
   - Refresh button
   - Action buttons (Add, Edit, Delete, View)

5. **User Feedback**
   - Loading states (skeleton screens)
   - Empty states (helpful messages)
   - Error states (actionable errors)
   - Success messages (toasts/alerts)
   - Confirmation dialogs (destructive actions)

6. **Responsive Design**
   - Mobile: Stacked layout, hamburger menu
   - Tablet: 2-column layouts
   - Desktop: 3+ column layouts, sidebar visible
   - All content accessible on all screen sizes

---

## Color Coding Quick Reference

### Status Colors (Used Throughout)
- 🟢 **Online/Healthy**: #28A745 (Green)
- 🔴 **Offline/Critical**: #DC3545 (Red)
- 🟡 **Warning/In Progress**: #FFC107 (Yellow)
- 🔵 **Info/In Commissioning**: #0088FF or #9966FF (Blue/Purple)
- ⚪ **Disabled/Offline**: #6C757D (Gray)

### Chart Colors
- Primary line: #0088FF (Blue)
- Success/Healthy: #28A745 (Green)
- Warning: #FFC107 (Yellow)
- Danger: #DC3545 (Red)
- Secondary: #17A2B8 (Teal)
- Neutral: #6C757D (Gray)

---

## Accessibility Notes

All pages must meet WCAG 2.1 AA standards:
- Color contrast: 4.5:1 minimum for text
- Font size: Minimum 12px
- Line height: 1.4+
- Form labels: Always associated with inputs
- Focus states: Always visible (blue outline)
- Keyboard navigation: Tab through all interactive elements
- ARIA labels: For dynamic content
- Alt text: For all images
- Error messages: Clear and actionable

---

End of Page Specifications Document
