# Array Monitoring - Design System & Specifications

## Table of Contents
1. [Design Principles](#design-principles)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Layout & Grid](#layout--grid)
5. [Spacing](#spacing)
6. [Components](#components)
7. [Navigation](#navigation)
8. [Responsive Design](#responsive-design)
9. [Icons & Visual Elements](#icons--visual-elements)
10. [States & Interactions](#states--interactions)

---

## Design Principles

### Core Values
- **Clean & Minimal**: Eliminate visual clutter; focus on essential information
- **Enterprise-Grade**: Professional, trustworthy appearance for critical monitoring
- **Intuitive**: Users should understand the interface without training
- **Consistent**: Same patterns, components, and spacing throughout
- **Accessible**: Clear hierarchy, readable text, sufficient color contrast
- **Scalable**: New features can be added without redesigning

### Design Decisions
- **No Deep Navigation**: Users access all pages directly from sidebar (max 1-level depth)
- **Independent Pages**: Each screen must function standalone without dependencies
- **Desktop-First**: Primary focus on desktop, responsive down to tablets
- **Minimal Animations**: Only purposeful, brief animations for state changes
- **Real-Time Focus**: Emphasis on current status and recent events
- **Visual Hierarchy**: Size, color, and placement guide user attention

---

## Color Palette

### Primary Colors

| Color | Hex Code | Usage | Notes |
|-------|----------|-------|-------|
| **Navy Blue** | `#003D6B` | Sidebar, headers, primary UI | Deep professional tone |
| **Light Gray** | `#F5F7FA` | Page background | Slight blue tint for cohesion |
| **Dark Gray** | `#2C3E50` | Text content, dark elements | Primary text color |
| **White** | `#FFFFFF` | Card backgrounds, text backgrounds | Clean separation |

### Accent Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Golden Yellow** | `#FFC107` | Warnings, secondary actions |
| **Bright Blue** | `#0088FF` | Primary buttons, links, active states |
| **Teal/Cyan** | `#17A2B8` | Info badges, secondary elements |
| **Bright Green** | `#28A745` | Success, healthy status, positive indicators |
| **Orange** | `#FF9800` | In Progress, warning conditions |
| **Red** | `#DC3545` | Critical alerts, errors, offline status |
| **Dark Gray** | `#6C757D` | Disabled states, inactive elements |

### Status Colors

| Status | Color | Hex Code | Example |
|--------|-------|----------|---------|
| **Healthy/Online** | Green | `#28A745` | Device online, SOC optimal |
| **Warning** | Orange/Yellow | `#FFC107` | Low battery, temperature warning |
| **Critical/Offline** | Red | `#DC3545` | Device offline, critical alarm |
| **In Operation** | Green | `#28A745` | System running |
| **In Commissioning** | Purple | `#9966FF` | Setup in progress |
| **In Construction** | Gray | `#C0C0C0` | Not yet active |
| **Disabled** | Light Gray | `#E0E0E0` | Feature disabled |

### Background & Border Colors

| Element | Color | Hex Code |
|---------|-------|----------|
| Page Background | Light Gray | `#F5F7FA` |
| Card Background | White | `#FFFFFF` |
| Card Border | Light Gray | `#E8EBF0` |
| Hover Background | Very Light Blue | `#F0F4F8` |
| Divider Line | Light Gray | `#DDD` or `#E8EBF0` |

---

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Type Scale

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| **Display XL** | 32px | 600 | 1.2 | Page titles, main headings |
| **Display L** | 28px | 600 | 1.2 | Section headings |
| **Display M** | 24px | 600 | 1.3 | Subsection headings |
| **Display S** | 20px | 600 | 1.4 | Card titles |
| **Heading L** | 18px | 600 | 1.4 | Card titles, emphasis |
| **Heading M** | 16px | 600 | 1.5 | Labels, navigation items |
| **Body L** | 16px | 400 | 1.6 | Body copy, descriptions |
| **Body M** | 14px | 400 | 1.6 | Standard body text |
| **Body S** | 13px | 400 | 1.5 | Small text, helper text |
| **Caption** | 12px | 500 | 1.4 | Labels, metadata |
| **Overline** | 11px | 600 | 1.5 | Upper labels, badges |

### Typography Usage

- **Headings**: Roboto Bold or System Font 600 weight
- **Body Text**: Regular weight (400), high readability
- **Labels**: Medium weight (500) for form labels and badges
- **Small Text**: Slightly increased line height for readability
- **Color**: Dark Gray (#2C3E50) for primary text, Medium Gray for secondary

### Hierarchy Rules
- Page title: 32px/600
- Section heading: 24px/600
- Card title: 18px/600
- Body text: 14px-16px/400
- Always maintain sufficient contrast for readability

---

## Layout & Grid

### Grid System
- **12-column grid** for responsive consistency
- **Gutters**: 24px between columns (12px on each side)
- **Max Content Width**: 1440px (on very large screens)
- **Sidebar Width**: 240px (collapsible to 64px on mobile)
- **Main Content Area**: Fills remaining space

### Breakpoints
```
Mobile:     < 576px
Tablet:     576px - 1024px
Desktop:    > 1024px
Large:      > 1440px
```

### Common Layouts

#### Full Width with Sidebar
```
┌─────────┬──────────────────┐
│         │                  │
│ Sidebar │   Header & Title │
│ 240px   │   Main Content   │
│         │   Footer         │
└─────────┴──────────────────┘
```

#### Three Column Grid (Common for KPI Cards)
```
┌─────────────┬─────────────┬─────────────┐
│   Card 1    │   Card 2    │   Card 3    │
└─────────────┴─────────────┴─────────────┘
```

#### Two Column Split (Dashboard/Map)
```
┌──────────────────┬──────────────────┐
│   Left Content   │   Right Content  │
│   (60% / 40%)    │   (40% / 60%)    │
└──────────────────┴──────────────────┘
```

---

## Spacing

### Spacing Scale (8px Base Unit)
```
xs    = 4px    (0.5rem)
sm    = 8px    (0.5rem)
md    = 16px   (1rem)
lg    = 24px   (1.5rem)
xl    = 32px   (2rem)
xxl   = 48px   (3rem)
xxxl  = 64px   (4rem)
```

### Common Spacing Patterns

| Element | Spacing | Notes |
|---------|---------|-------|
| **Sidebar Padding** | 24px | Left/right and top/bottom |
| **Card Padding** | 24px | Inside cards for content |
| **Section Gap** | 32px | Between major sections |
| **Grid Gap** | 24px | Between cards in grid |
| **Button Padding** | 12px 24px | Vertical × Horizontal |
| **Form Field Gap** | 8px | Between label and input |
| **List Item Padding** | 16px 24px | Vertical × Horizontal |
| **Header Height** | 64px | Top navigation/header |
| **Sidebar Padding** | 16px top/bottom | Navigation items |

---

## Components

### 1. Cards
**Purpose**: Container for related information

**Specifications**:
- Background: White (`#FFFFFF`)
- Border: 1px solid `#E8EBF0`
- Border Radius: 8px
- Padding: 24px
- Box Shadow: 0 1px 3px rgba(0, 0, 0, 0.08)
- Hover Shadow: 0 4px 12px rgba(0, 0, 0, 0.12)

**Variants**:
- **Standard Card**: Default styling
- **Elevated Card**: Stronger shadow for emphasis
- **Interactive Card**: Hover state changes, cursor pointer
- **Bordered Card**: Colored left border (2-4px) for status
- **Flat Card**: No shadow, minimal styling

```css
.card {
  background: #FFFFFF;
  border: 1px solid #E8EBF0;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}
```

### 2. Buttons
**Purpose**: Call-to-action elements

**Specifications**:
- Border Radius: 6px
- Font Weight: 600
- Font Size: 14px
- Padding: 12px 24px
- Minimum Height: 40px
- Transition: 0.2s ease

**Variants**:
- **Primary** (Filled): Background `#0088FF`, white text, for main actions
- **Secondary** (Outlined): Border `#0088FF`, text `#0088FF`, for secondary actions
- **Tertiary** (Ghost): Text only, no background, for low-priority actions
- **Danger** (Red): Background `#DC3545`, white text, for destructive actions
- **Disabled**: Gray background `#E0E0E0`, gray text, cursor not-allowed

```css
.btn-primary {
  background-color: #0088FF;
  color: #FFFFFF;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: #0070CC;
}

.btn-primary:disabled {
  background-color: #E0E0E0;
  color: #999;
  cursor: not-allowed;
}
```

### 3. Badges & Status Indicators
**Purpose**: Quick status visualization

**Specifications**:
- Padding: 6px 12px
- Font Size: 12px
- Font Weight: 600
- Border Radius: 4px
- Display: inline-block

**Variants**:
- **Success (Green)**: Background `#D4EDDA`, text `#155724`
- **Warning (Yellow)**: Background `#FFF3CD`, text `#856404`
- **Danger (Red)**: Background `#F8D7DA`, text `#721C24`
- **Info (Blue)**: Background `#D1ECF1`, text `#0C5460`
- **Gray**: Background `#E8E8E8`, text `#666`

### 4. Tables
**Purpose**: Display structured data

**Specifications**:
- Row Height: 48px
- Header Background: `#F5F7FA`
- Header Text: Dark Gray, 600 weight
- Cell Padding: 16px 24px
- Border: 1px solid `#E8EBF0` (row dividers)
- Hover State: Very light background `#F9FAFB`
- Sortable headers: Cursor pointer, underline on hover

**Features**:
- Checkbox for multi-select
- Sortable columns
- Sticky header
- Pagination controls
- Row actions (edit, delete, view details)

### 5. Modals & Dialogs
**Purpose**: Focused user interactions

**Specifications**:
- Overlay Background: Rgba(0, 0, 0, 0.5)
- Modal Width: 40-50% of viewport
- Border Radius: 8px
- Padding: 32px
- Header Font: 24px/600 weight
- Footer: Aligned right with buttons

**Variants**:
- **Standard Modal**: Info/form dialog
- **Alert Modal**: Confirmation/warning with single action
- **Filter Modal**: Complex filtering UI

### 6. Forms & Inputs
**Purpose**: Data entry

**Specifications**:
- Input Height: 40px
- Input Padding: 10px 16px
- Input Border: 1px solid `#D0D0D0`
- Input Border-Radius: 6px
- Focus Border: `#0088FF`
- Focus Shadow: 0 0 0 3px rgba(0, 136, 255, 0.1)

**States**:
- **Default**: Normal input
- **Focus**: Blue border + shadow
- **Disabled**: Gray background, no interaction
- **Error**: Red border, error message below
- **Success**: Green checkmark indicator

### 7. Search Bars
**Purpose**: Quick information lookup

**Specifications**:
- Height: 40px
- Icon: Left side (magnifying glass)
- Placeholder: Gray text, "Search..."
- Border Radius: 6px
- Padding: 10px 16px with 16px left for icon

### 8. Filter Panels
**Purpose**: Narrow down data display

**Design**:
- Sidebar or modal overlay
- Grouped filter sections
- Checkboxes, dropdowns, date pickers
- "Apply Filters" & "Reset" buttons
- Real-time preview of results count
- Clear badges showing active filters

### 9. Pagination
**Purpose**: Navigate large data sets

**Design**:
- Previous/Next buttons with arrows
- Page numbers (show 5-7 page numbers)
- Current page highlighted in blue
- "Rows per page" selector
- "Showing X-Y of Z results" text
- Centered at bottom of content

### 10. Status Badges (For Devices/Gateways)
**Purpose**: Quick status at glance

**Variants**:
- **Online** (Green circle): `● Online`
- **Offline** (Red circle): `● Offline`
- **In Operation** (Green): `In Operation`
- **In Commissioning** (Purple): `In Commissioning`
- **Warning** (Orange): `⚠ Warning`
- **Critical** (Red): `🔴 Critical`
- **Disabled** (Gray): `● Disabled`

---

## Navigation

### Sidebar Navigation
**Specifications**:
- **Width**: 240px (desktop), collapses to 64px or hidden on mobile
- **Background**: Navy Blue `#003D6B`
- **Text Color**: White
- **Item Height**: 48px
- **Item Padding**: 16px 24px
- **Font Size**: 14px, 500 weight
- **Icon Size**: 20px × 20px
- **Icons**: Positioned left, margin-right 12px

**Navigation Items** (10 total):
1. Dashboard
2. Projects
3. Devices
4. Gateways
5. Alarms
6. Battery Health
7. Performance
8. Reports
9. Activity Logs
10. Settings

**States**:
- **Active**: Background color `#0088FF` or lighter navy, underline
- **Hover**: Background opacity change
- **Inactive**: Default text color

### Top Header
**Specifications**:
- **Height**: 64px
- **Background**: White with bottom border
- **Border**: 1px solid `#E8EBF0`
- **Padding**: 0 32px
- **Display**: Flexbox, space-between

**Components**:
- Left: Page title + breadcrumb
- Right: Notifications icon, user profile dropdown, settings

---

## Responsive Design

### Mobile (< 576px)
- Sidebar: Hidden, hamburger menu in header
- Cards: Full width, stacked
- Tables: Horizontal scroll or card view
- Modals: Full screen
- Buttons: Full width, stacked in footer

### Tablet (576px - 1024px)
- Sidebar: Collapsible, 200px when open
- Grid: 2-3 columns max
- Cards: Responsive, 2-column layout
- Tables: Horizontal scroll with sticky first column

### Desktop (> 1024px)
- Sidebar: 240px, always visible
- Grid: 3-4 columns
- Full feature set
- All interactions enabled

---

## Icons & Visual Elements

### Icon Set
- **Source**: Use Feather Icons, Heroicons, or Font Awesome (consistent set)
- **Size**: 20px for navigation, 24px for card headers, 16px for inline
- **Color**: Match text color or accent colors
- **Stroke**: 2px for icon borders

### Common Icons
- Dashboard: ▦ (grid)
- Projects: 📁 (folder)
- Devices: 📱 (device)
- Gateways: 🔌 (gateway/plug)
- Alarms: 🔔 (bell)
- Battery: 🔋 (battery)
- Performance: 📊 (chart)
- Reports: 📄 (document)
- Logs: 📋 (list)
- Settings: ⚙️ (gear)

### Icons for Status
- Online: ✓ or ●
- Offline: ✗ or ●
- Warning: ⚠
- Error: ⊗
- Info: ⓘ

---

## States & Interactions

### Loading State
- **Skeleton Screens**: Placeholder blocks with pulse animation
- **Spinners**: Small centered loader or progress bar
- **Opacity**: 0.6 for disabled/loading content
- **Duration**: Animations 1-2 seconds

### Empty State
- **Icon**: Large, light gray
- **Heading**: "No data available"
- **Message**: Helpful explanation
- **Action**: Button to create/add/refresh
- **Background**: Light gray or white card

### Error State
- **Alert Box**: Red border, red icon, red heading
- **Message**: Clear, actionable error description
- **Retry Button**: Prominent action to retry
- **Support Link**: Link to help/documentation

### Hover & Focus States
- **Cards**: Subtle shadow increase, cursor pointer
- **Buttons**: Color darkening or opacity change
- **Links**: Underline, color change
- **Form Inputs**: Blue border + shadow
- **Table Rows**: Light background highlight

### Disabled State
- **Opacity**: 0.5 for disabled content
- **Cursor**: not-allowed
- **Color**: Gray text, gray background
- **Interaction**: None (pointer-events: none)

---

## Animation Guidelines

### Principles
- **Micro-animations only**: State changes, 0.2-0.3s duration
- **No auto-play animations**: User-triggered only
- **Smooth easing**: ease-in-out for natural motion
- **Purpose**: Provide feedback, guide attention

### Common Animations
- Button hover: 0.2s background color change
- Card hover: 0.3s shadow increase
- Modal entry: 0.3s fade + scale
- List item removal: 0.2s fade out
- Loading spinner: Continuous 1s rotation

### Animation Properties
```css
transition: background-color 0.2s ease, box-shadow 0.2s ease;
/* Duration: 0.2-0.3s for UI feedback */
/* Timing: ease or ease-in-out */
/* No bounce or overshoot */
```

---

## Accessibility Considerations

### Color Contrast
- Text on background: Minimum 4.5:1 ratio
- Interactive elements: Clearly distinguishable
- Don't rely on color alone for status

### Typography
- Minimum font size: 12px (captions), 14px (body text)
- Line height: 1.4+ for readability
- Sufficient line length: 60-80 characters

### Interactive Elements
- Minimum touch target: 40px × 40px
- Focus indicators: Always visible (outline or ring)
- Keyboard navigation: Tab through all interactive elements

### Semantic HTML
- Use semantic tags: `<button>`, `<nav>`, `<header>`, `<main>`, `<footer>`
- Form labels: Always associated with inputs
- ARIA attributes: For dynamic content updates

---

## Implementation Notes

### CSS Architecture
- Use CSS Variables for colors and spacing
- BEM naming convention for class names
- Mobile-first media queries
- Utility classes for common patterns

### Component Library Structure
```
components/
├── Button/
│   ├── Button.jsx
│   ├── Button.module.css
│   └── Button.stories.jsx
├── Card/
│   ├── Card.jsx
│   ├── Card.module.css
│   └── Card.stories.jsx
├── Table/
│   ├── Table.jsx
│   ├── Table.module.css
│   └── Table.stories.jsx
├── Modal/
├── Badge/
├── SearchBar/
└── ...
```

### CSS Variables Example
```css
:root {
  --color-navy: #003D6B;
  --color-blue: #0088FF;
  --color-green: #28A745;
  --color-red: #DC3545;
  --color-white: #FFFFFF;
  --color-bg: #F5F7FA;
  
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  --border-radius-sm: 4px;
  --border-radius-md: 6px;
  --border-radius-lg: 8px;
  
  --font-size-sm: 12px;
  --font-size-md: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 18px;
}
```

---

## Quick Reference Checklist

### Every Page Should Include
- ✓ Left sidebar with navigation
- ✓ Top header with page title
- ✓ Search functionality
- ✓ Filter options
- ✓ Pagination (if applicable)
- ✓ Loading state
- ✓ Empty state
- ✓ Error handling
- ✓ Responsive design
- ✓ Consistent spacing and typography

### Visual Elements
- ✓ Cards with consistent styling
- ✓ Status badges for quick identification
- ✓ Icons for visual hierarchy
- ✓ Color coding for status/severity
- ✓ Rounded corners (8px default)
- ✓ Soft shadows for depth
- ✓ Sufficient whitespace

### User Experience
- ✓ No deep navigation hierarchy
- ✓ Independent page functionality
- ✓ Clear call-to-action buttons
- ✓ Helpful error messages
- ✓ Loading state feedback
- ✓ Confirmation for destructive actions
- ✓ Keyboard accessibility
- ✓ Responsive to all screen sizes

---

## Color Palette Quick Reference

```
Primary:
- Navy: #003D6B
- Light BG: #F5F7FA
- Dark Text: #2C3E50
- White: #FFFFFF

Accents:
- Blue: #0088FF
- Green: #28A745
- Orange: #FF9800
- Yellow: #FFC107
- Red: #DC3545
- Teal: #17A2B8
- Gray: #6C757D
```

---

## Font Stack
```
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
```

---

End of Design System Document
