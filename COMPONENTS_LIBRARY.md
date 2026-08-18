# Array Monitoring - Components & Patterns Library

Complete guide to reusable UI components and interaction patterns.

---

## Table of Contents
1. [Button Component](#button-component)
2. [Card Component](#card-component)
3. [Table Component](#table-component)
4. [Form Inputs](#form-inputs)
5. [Badge & Status Components](#badge--status-components)
6. [Modal & Dialog](#modal--dialog)
7. [Navigation Components](#navigation-components)
8. [Search & Filter](#search--filter)
9. [Pagination](#pagination)
10. [Charts & Visualizations](#charts--visualizations)
11. [Notifications & Alerts](#notifications--alerts)
12. [Loading States](#loading-states)
13. [Empty & Error States](#empty--error-states)
14. [Common Patterns](#common-patterns)

---

## Button Component

### Button Variants

#### Primary Button
**Purpose**: Main call-to-action, most important action on the page

**Specifications**:
- Background: #0088FF (Bright Blue)
- Text: White
- Padding: 12px 24px
- Height: 40px minimum
- Border Radius: 6px
- Font Weight: 600
- Font Size: 14px
- Cursor: pointer
- Transition: 0.2s ease

**States**:
- **Default**: Blue background, white text
- **Hover**: Darker blue (#0070CC), slight shadow
- **Active/Pressed**: Even darker (#004F99)
- **Focus**: Blue border + outline ring
- **Disabled**: Gray background (#E0E0E0), gray text, cursor: not-allowed
- **Loading**: Icon spinner + text "Loading..."

**HTML Example**:
```html
<button class="btn btn-primary">Save Changes</button>
<button class="btn btn-primary" disabled>Disabled Action</button>
```

**CSS Example**:
```css
.btn {
  padding: 12px 24px;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 40px;
}

.btn-primary {
  background-color: #0088FF;
  color: #FFFFFF;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0070CC;
  box-shadow: 0 2px 8px rgba(0, 136, 255, 0.2);
}

.btn-primary:disabled {
  background-color: #E0E0E0;
  color: #999;
  cursor: not-allowed;
}
```

#### Secondary Button
**Purpose**: Secondary actions, alternative to primary

**Specifications**:
- Background: Transparent
- Border: 2px solid #0088FF
- Text: #0088FF
- Padding: 10px 22px (to account for border)
- Height: 40px
- All other specs same as primary

**HTML Example**:
```html
<button class="btn btn-secondary">Cancel</button>
```

**CSS Example**:
```css
.btn-secondary {
  background-color: transparent;
  color: #0088FF;
  border: 2px solid #0088FF;
  padding: 10px 22px;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #F0F7FF;
}
```

#### Tertiary Button (Ghost)
**Purpose**: Low-priority actions, links

**Specifications**:
- Background: Transparent
- Border: None
- Text: #0088FF
- Underline on hover

**CSS Example**:
```css
.btn-tertiary {
  background-color: transparent;
  color: #0088FF;
  border: none;
  padding: 12px 24px;
}

.btn-tertiary:hover:not(:disabled) {
  text-decoration: underline;
}
```

#### Danger Button
**Purpose**: Destructive actions (delete, remove)

**Specifications**:
- Background: #DC3545 (Red)
- Text: White
- Same padding/size as primary
- Confirmation required on click

**CSS Example**:
```css
.btn-danger {
  background-color: #DC3545;
  color: #FFFFFF;
}

.btn-danger:hover:not(:disabled) {
  background-color: #B71C1C;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
}
```

#### Icon Button
**Purpose**: Icon-only buttons (close, menu, etc.)

**Specifications**:
- Size: 40px × 40px (minimum touch target)
- Icon size: 20px
- Border radius: 6px
- Hover: Subtle background color change

**CSS Example**:
```css
.btn-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: none;
  background-color: transparent;
  cursor: pointer;
}

.btn-icon:hover {
  background-color: #F5F7FA;
}
```

#### Small Button
**Purpose**: Compact button for tables, cards

**Specifications**:
- Padding: 8px 16px
- Height: 32px
- Font Size: 13px
- All other specs same as primary

**CSS Example**:
```css
.btn-sm {
  padding: 8px 16px;
  font-size: 13px;
  min-height: 32px;
}
```

#### Large Button
**Purpose**: Prominent actions, CTAs

**Specifications**:
- Padding: 16px 32px
- Height: 48px
- Font Size: 16px
- Font Weight: 600

**CSS Example**:
```css
.btn-lg {
  padding: 16px 32px;
  font-size: 16px;
  min-height: 48px;
}
```

### Button Groups
**Purpose**: Group related buttons together

**HTML Example**:
```html
<div class="btn-group">
  <button class="btn btn-primary">Save</button>
  <button class="btn btn-secondary">Cancel</button>
  <button class="btn btn-tertiary">Delete</button>
</div>
```

**CSS Example**:
```css
.btn-group {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
```

### Button Loading State
**Purpose**: Show loading indicator during async action

**HTML Example**:
```html
<button class="btn btn-primary is-loading">
  <span class="btn-spinner"></span>
  <span class="btn-text">Saving...</span>
</button>
```

**CSS Example**:
```css
.btn.is-loading {
  pointer-events: none;
  opacity: 0.8;
}

.btn-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #FFFFFF;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## Card Component

### Standard Card
**Purpose**: Container for related information

**Specifications**:
- Background: #FFFFFF
- Border: 1px solid #E8EBF0
- Border Radius: 8px
- Padding: 24px
- Box Shadow: 0 1px 3px rgba(0, 0, 0, 0.08)
- Transition: 0.2s ease

**HTML Example**:
```html
<div class="card">
  <h3 class="card-title">Card Title</h3>
  <p class="card-text">Card content goes here.</p>
  <button class="btn btn-primary">Action</button>
</div>
```

**CSS Example**:
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

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #2C3E50;
}

.card-text {
  font-size: 14px;
  line-height: 1.6;
  color: #555;
}
```

### Elevated Card
**Purpose**: Card that appears "lifted" for emphasis

**Specifications**:
- Same as standard card but with stronger shadow
- Box Shadow: 0 4px 12px rgba(0, 0, 0, 0.12)
- Used for primary content areas

### Interactive Card
**Purpose**: Clickable card with hover feedback

**Specifications**:
- Cursor: pointer
- Enhanced hover shadow
- Border changes to primary color on hover

**CSS Example**:
```css
.card.interactive {
  cursor: pointer;
}

.card.interactive:hover {
  border-color: #0088FF;
  box-shadow: 0 8px 16px rgba(0, 136, 255, 0.15);
}
```

### Card with Header
**Purpose**: Card with header section

**HTML Example**:
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Section Title</h3>
    <button class="btn btn-icon" aria-label="More options">
      <span>⋯</span>
    </button>
  </div>
  <div class="card-body">
    <p>Card content...</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-secondary">Cancel</button>
    <button class="btn btn-primary">Save</button>
  </div>
</div>
```

**CSS Example**:
```css
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #E8EBF0;
  margin-bottom: 16px;
}

.card-body {
  padding: 16px 0;
}

.card-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #E8EBF0;
  margin-top: 16px;
}
```

### Bordered Card (Status)
**Purpose**: Card with colored left border for status indication

**CSS Example**:
```css
.card.border-success {
  border-left: 4px solid #28A745;
}

.card.border-warning {
  border-left: 4px solid #FFC107;
}

.card.border-danger {
  border-left: 4px solid #DC3545;
}
```

---

## Table Component

### Basic Table
**Purpose**: Display structured data in rows and columns

**HTML Example**:
```html
<table class="table">
  <thead>
    <tr>
      <th>Device ID</th>
      <th>Status</th>
      <th>Battery SOC</th>
      <th>Temperature</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>SNC_1</td>
      <td><span class="badge badge-success">Online</span></td>
      <td>75%</td>
      <td>25°C</td>
      <td>
        <button class="btn btn-sm btn-secondary">View</button>
      </td>
    </tr>
  </tbody>
</table>
```

### Table Specifications
- **Header Background**: #F5F7FA
- **Row Height**: 48px
- **Cell Padding**: 16px 24px
- **Row Border**: 1px solid #E8EBF0
- **Text Color**: #2C3E50 (dark gray)
- **Secondary Text**: #6C757D (medium gray)

**CSS Example**:
```css
.table {
  width: 100%;
  border-collapse: collapse;
  background-color: #FFFFFF;
  border: 1px solid #E8EBF0;
  border-radius: 8px;
  overflow: hidden;
}

.table thead {
  background-color: #F5F7FA;
  border-bottom: 2px solid #E8EBF0;
}

.table th {
  padding: 16px 24px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: #2C3E50;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.table th:hover {
  background-color: #EEF1F6;
}

.table tbody tr {
  border-bottom: 1px solid #E8EBF0;
  transition: background-color 0.2s ease;
  height: 48px;
}

.table tbody tr:hover {
  background-color: #F9FAFB;
}

.table td {
  padding: 16px 24px;
  font-size: 14px;
  color: #555;
  vertical-align: middle;
}
```

### Sortable Columns
**Purpose**: Allow sorting by clicking column headers

**HTML Example**:
```html
<th class="sortable sort-asc" data-column="device_id">
  Device ID
  <span class="sort-icon">↑</span>
</th>
```

**CSS Example**:
```css
.table th.sortable {
  cursor: pointer;
  user-select: none;
}

.table th.sortable:hover {
  background-color: #EEF1F6;
}

.table th.sort-asc .sort-icon::after {
  content: ' ↑';
}

.table th.sort-desc .sort-icon::after {
  content: ' ↓';
}

.sort-icon {
  margin-left: 8px;
  display: inline-block;
  font-size: 12px;
  opacity: 0.5;
}

.table th.sortable:hover .sort-icon {
  opacity: 1;
}
```

### Selectable Rows
**Purpose**: Allow selecting multiple rows

**HTML Example**:
```html
<table class="table selectable">
  <thead>
    <tr>
      <th>
        <input type="checkbox" class="select-all" aria-label="Select all">
      </th>
      <th>Device ID</th>
      <!-- more headers -->
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <input type="checkbox" class="row-select" value="1">
      </td>
      <td>SNC_1</td>
      <!-- more data -->
    </tr>
  </tbody>
</table>
```

**CSS Example**:
```css
.table.selectable tbody tr.selected {
  background-color: #EEF1F6;
}

.table.selectable tbody tr.selected td {
  background-color: transparent;
}
```

### Table with Row Actions
**Purpose**: Show action buttons/menu in last column

**HTML Example**:
```html
<td class="actions">
  <button class="btn btn-sm btn-secondary">Edit</button>
  <button class="btn btn-icon" aria-label="More">
    <span>⋯</span>
  </button>
</td>
```

**CSS Example**:
```css
.table td.actions {
  text-align: right;
  white-space: nowrap;
}

.table td.actions .btn {
  margin-left: 8px;
}
```

### Sticky Header Table
**Purpose**: Keep header visible when scrolling

**CSS Example**:
```css
.table-container {
  overflow-x: auto;
  max-height: 600px;
}

.table thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #F5F7FA;
}
```

### Table Row Hover Details
- Background color change to light blue (#F9FAFB)
- No animation, instant change
- Shadow: None on row

---

## Form Inputs

### Text Input
**Purpose**: Single-line text entry

**HTML Example**:
```html
<div class="form-group">
  <label for="input-1" class="form-label">Field Label</label>
  <input 
    type="text" 
    id="input-1" 
    class="form-input" 
    placeholder="Enter value..."
  >
</div>
```

**Specifications**:
- Height: 40px
- Padding: 10px 16px
- Border: 1px solid #D0D0D0
- Border Radius: 6px
- Font Size: 14px
- Background: White

**States**:
- **Default**: Light gray border
- **Focus**: Blue border (#0088FF) + shadow
- **Filled**: Dark gray text
- **Disabled**: Gray background, no interaction
- **Error**: Red border + error message below

**CSS Example**:
```css
.form-input {
  width: 100%;
  height: 40px;
  padding: 10px 16px;
  border: 1px solid #D0D0D0;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  background-color: #FFFFFF;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #0088FF;
  box-shadow: 0 0 0 3px rgba(0, 136, 255, 0.1);
}

.form-input:disabled {
  background-color: #F5F7FA;
  color: #999;
  cursor: not-allowed;
}

.form-input.error {
  border-color: #DC3545;
}

.form-input.error:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}
```

### Form Group
**Purpose**: Wrapper for label + input + error message

**HTML Example**:
```html
<div class="form-group">
  <label for="email" class="form-label">Email Address</label>
  <input 
    type="email" 
    id="email" 
    class="form-input" 
    value="john@example.com"
  >
  <span class="form-error" role="alert">Invalid email format</span>
  <span class="form-helper">We'll never share your email</span>
</div>
```

**CSS Example**:
```css
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #2C3E50;
}

.form-error {
  font-size: 12px;
  color: #DC3545;
  display: block;
}

.form-helper {
  font-size: 12px;
  color: #6C757D;
  display: block;
}

.form-input.error + .form-error {
  display: block;
}
```

### Textarea
**Purpose**: Multi-line text entry

**HTML Example**:
```html
<div class="form-group">
  <label for="message" class="form-label">Message</label>
  <textarea 
    id="message" 
    class="form-input form-textarea" 
    placeholder="Enter your message..."
    rows="4"
  ></textarea>
</div>
```

**CSS Example**:
```css
.form-textarea {
  resize: vertical;
  min-height: 120px;
  padding: 12px 16px;
}
```

### Select Dropdown
**Purpose**: Choose from predefined options

**HTML Example**:
```html
<div class="form-group">
  <label for="status" class="form-label">Status</label>
  <select id="status" class="form-select">
    <option value="">Select status...</option>
    <option value="online">Online</option>
    <option value="offline">Offline</option>
    <option value="warning">Warning</option>
  </select>
</div>
```

**CSS Example**:
```css
.form-select {
  width: 100%;
  height: 40px;
  padding: 10px 16px 10px 16px;
  border: 1px solid #D0D0D0;
  border-radius: 6px;
  font-size: 14px;
  background-color: #FFFFFF;
  cursor: pointer;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>');
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
}

.form-select:focus {
  outline: none;
  border-color: #0088FF;
  box-shadow: 0 0 0 3px rgba(0, 136, 255, 0.1);
}
```

### Checkbox
**Purpose**: Toggle single option

**HTML Example**:
```html
<div class="form-group">
  <label class="checkbox-label">
    <input type="checkbox" class="checkbox" name="agree">
    <span>I agree to the terms and conditions</span>
  </label>
</div>
```

**CSS Example**:
```css
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
}

.checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  appearance: none;
  border: 2px solid #D0D0D0;
  border-radius: 4px;
  background-color: #FFFFFF;
  transition: all 0.2s ease;
}

.checkbox:checked {
  background-color: #0088FF;
  border-color: #0088FF;
  background-image: url('data:image/svg+xml;utf8,<svg width="16" height="16" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 3.5L6 11L2.5 7.5" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  background-repeat: no-repeat;
  background-position: center;
}

.checkbox:focus {
  box-shadow: 0 0 0 3px rgba(0, 136, 255, 0.1);
}
```

### Radio Button
**Purpose**: Toggle one option from group

**HTML Example**:
```html
<div class="form-group">
  <label>Choose an option:</label>
  <div class="radio-group">
    <label class="radio-label">
      <input type="radio" name="option" value="1" class="radio">
      <span>Option 1</span>
    </label>
    <label class="radio-label">
      <input type="radio" name="option" value="2" class="radio">
      <span>Option 2</span>
    </label>
  </div>
</div>
```

**CSS Example**:
```css
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
}

.radio {
  width: 20px;
  height: 20px;
  cursor: pointer;
  appearance: none;
  border: 2px solid #D0D0D0;
  border-radius: 50%;
  background-color: #FFFFFF;
  transition: all 0.2s ease;
}

.radio:checked {
  border-color: #0088FF;
  box-shadow: inset 0 0 0 4px #FFFFFF, inset 0 0 0 6px #0088FF;
}
```

### Date Input
**Purpose**: Date selection

**HTML Example**:
```html
<div class="form-group">
  <label for="date" class="form-label">Date</label>
  <input type="date" id="date" class="form-input">
</div>
```

### Date Range Picker
**Purpose**: Select start and end dates

**HTML Example**:
```html
<div class="date-range-picker">
  <div class="form-group">
    <label for="start-date" class="form-label">From</label>
    <input type="date" id="start-date" class="form-input">
  </div>
  <div class="form-group">
    <label for="end-date" class="form-label">To</label>
    <input type="date" id="end-date" class="form-input">
  </div>
</div>
```

**CSS Example**:
```css
.date-range-picker {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 768px) {
  .date-range-picker {
    grid-template-columns: 1fr;
  }
}
```

---

## Badge & Status Components

### Status Badge
**Purpose**: Display status with color coding

**HTML Example**:
```html
<span class="badge badge-success">Online</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-danger">Offline</span>
<span class="badge badge-info">In Progress</span>
```

**Specifications**:
- Padding: 6px 12px
- Border Radius: 4px
- Font Size: 12px
- Font Weight: 600
- Display: inline-block

**CSS Example**:
```css
.badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.badge-success {
  background-color: #D4EDDA;
  color: #155724;
}

.badge-warning {
  background-color: #FFF3CD;
  color: #856404;
}

.badge-danger {
  background-color: #F8D7DA;
  color: #721C24;
}

.badge-info {
  background-color: #D1ECF1;
  color: #0C5460;
}

.badge-gray {
  background-color: #E8E8E8;
  color: #666;
}
```

### Status Indicator (Dot)
**Purpose**: Quick visual status indicator

**HTML Example**:
```html
<span class="status-dot status-online" title="Online"></span>
<span class="status-dot status-offline" title="Offline"></span>
```

**CSS Example**:
```css
.status-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.status-online {
  background-color: #28A745;
}

.status-offline {
  background-color: #DC3545;
}

.status-warning {
  background-color: #FFC107;
}

.status-disabled {
  background-color: #6C757D;
}
```

### Health Score Badge
**Purpose**: Show health percentage with color

**HTML Example**:
```html
<div class="health-badge">
  <span class="health-value">92%</span>
  <span class="health-label">Excellent</span>
</div>
```

**CSS Example**:
```css
.health-badge {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  background-color: #D4EDDA;
}

.health-badge.warning {
  background-color: #FFF3CD;
}

.health-badge.critical {
  background-color: #F8D7DA;
}

.health-value {
  font-size: 18px;
  font-weight: 600;
}

.health-label {
  font-size: 11px;
  text-transform: uppercase;
  opacity: 0.8;
}
```

---

## Modal & Dialog

### Basic Modal
**Purpose**: Overlay dialog for user interaction

**HTML Example**:
```html
<div class="modal" id="modal-1">
  <div class="modal-overlay"></div>
  <div class="modal-content">
    <div class="modal-header">
      <h2 class="modal-title">Modal Title</h2>
      <button class="btn btn-icon modal-close" aria-label="Close">
        <span>✕</span>
      </button>
    </div>
    <div class="modal-body">
      <p>Modal content goes here.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary modal-close">Cancel</button>
      <button class="btn btn-primary">Save</button>
    </div>
  </div>
</div>
```

**CSS Example**:
```css
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}

.modal.active {
  display: flex;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.2s ease;
}

.modal-content {
  position: relative;
  margin: auto;
  background-color: #FFFFFF;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 32px 24px;
  border-bottom: 1px solid #E8EBF0;
}

.modal-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #2C3E50;
}

.modal-close {
  flex-shrink: 0;
}

.modal-body {
  padding: 24px 32px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 24px 32px;
  border-top: 1px solid #E8EBF0;
  background-color: #F5F7FA;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

### Alert Modal
**Purpose**: Confirmation dialog for important actions

**HTML Example**:
```html
<div class="modal alert-modal" id="alert-modal">
  <div class="modal-overlay"></div>
  <div class="modal-content modal-alert">
    <div class="alert-icon">
      <span class="icon-warning">⚠</span>
    </div>
    <h2 class="alert-title">Confirm Delete</h2>
    <p class="alert-message">
      Are you sure you want to delete this device? This action cannot be undone.
    </p>
    <div class="modal-footer">
      <button class="btn btn-secondary modal-close">Cancel</button>
      <button class="btn btn-danger">Delete</button>
    </div>
  </div>
</div>
```

**CSS Example**:
```css
.modal-alert {
  max-width: 400px;
  text-align: center;
}

.alert-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.alert-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px;
  color: #2C3E50;
}

.alert-message {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 32px;
}
```

---

## Navigation Components

### Sidebar Navigation
**Purpose**: Left navigation menu

**HTML Example**:
```html
<nav class="sidebar">
  <div class="sidebar-header">
    <div class="logo">Array Monitoring</div>
  </div>
  
  <ul class="nav-menu">
    <li class="nav-item">
      <a href="/dashboard" class="nav-link active">
        <span class="nav-icon">▦</span>
        <span>Dashboard</span>
      </a>
    </li>
    <li class="nav-item">
      <a href="/projects" class="nav-link">
        <span class="nav-icon">📁</span>
        <span>Projects</span>
      </a>
    </li>
    <!-- more items -->
  </ul>
  
  <div class="sidebar-footer">
    <button class="btn btn-icon sidebar-toggle">☰</button>
  </div>
</nav>
```

**Specifications**:
- Width: 240px (desktop), collapsible
- Background: #003D6B (Navy)
- Text: White
- Item height: 48px
- Padding: 16px 24px

**CSS Example**:
```css
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 240px;
  height: 100vh;
  background-color: #003D6B;
  overflow-y: auto;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  font-size: 18px;
  font-weight: 600;
  color: #FFFFFF;
  white-space: nowrap;
}

.nav-menu {
  list-style: none;
  padding: 16px 0;
  margin: 0;
  flex: 1;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  color: #FFFFFF;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background-color: #0088FF;
  font-weight: 600;
}

.nav-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 16px;
}

.sidebar-footer {
  padding: 16px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Breadcrumb Navigation
**Purpose**: Show page hierarchy

**HTML Example**:
```html
<nav class="breadcrumb" aria-label="Breadcrumb">
  <ol class="breadcrumb-list">
    <li><a href="/dashboard">Dashboard</a></li>
    <li><a href="/devices">Devices</a></li>
    <li aria-current="page">SNC_1</li>
  </ol>
</nav>
```

**CSS Example**:
```css
.breadcrumb {
  padding: 12px 0;
  background-color: transparent;
}

.breadcrumb-list {
  display: flex;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.breadcrumb-list li::before {
  content: '/';
  margin-right: 8px;
  color: #999;
}

.breadcrumb-list li:first-child::before {
  content: '';
  margin-right: 0;
}

.breadcrumb-list a {
  color: #0088FF;
  text-decoration: none;
  font-size: 14px;
}

.breadcrumb-list a:hover {
  text-decoration: underline;
}

.breadcrumb-list li[aria-current="page"] {
  color: #666;
  font-size: 14px;
}
```

### Tabs Navigation
**Purpose**: Switch between related content sections

**HTML Example**:
```html
<div class="tabs">
  <div class="tab-nav">
    <button class="tab-btn active" data-tab="tab-1">Tab 1</button>
    <button class="tab-btn" data-tab="tab-2">Tab 2</button>
    <button class="tab-btn" data-tab="tab-3">Tab 3</button>
  </div>
  
  <div class="tab-content">
    <div class="tab-panel active" id="tab-1">Content 1</div>
    <div class="tab-panel" id="tab-2">Content 2</div>
    <div class="tab-panel" id="tab-3">Content 3</div>
  </div>
</div>
```

**CSS Example**:
```css
.tabs {
  border-bottom: 1px solid #E8EBF0;
}

.tab-nav {
  display: flex;
  gap: 0;
  list-style: none;
  margin: 0;
  padding: 0;
}

.tab-btn {
  padding: 16px 24px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: #0088FF;
  border-bottom-color: #0088FF;
}

.tab-btn.active {
  color: #0088FF;
  border-bottom-color: #0088FF;
  font-weight: 600;
}

.tab-panel {
  display: none;
  padding: 24px 0;
}

.tab-panel.active {
  display: block;
}
```

---

## Search & Filter

### Search Bar
**Purpose**: Quick search functionality

**HTML Example**:
```html
<div class="search-bar">
  <span class="search-icon">🔍</span>
  <input 
    type="text" 
    class="search-input" 
    placeholder="Search devices..."
    aria-label="Search"
  >
  <button class="search-clear" aria-label="Clear search" style="display: none;">✕</button>
</div>
```

**Specifications**:
- Height: 40px
- Padding: 10px 16px
- Icon on left (16px from edge)
- Clear button on right (when input has value)
- Border: 1px solid #D0D0D0
- Border Radius: 6px

**CSS Example**:
```css
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  font-size: 18px;
  opacity: 0.5;
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 40px;
  padding: 10px 40px 10px 40px;
  border: 1px solid #D0D0D0;
  border-radius: 6px;
  font-size: 14px;
  background-color: #FFFFFF;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #0088FF;
  box-shadow: 0 0 0 3px rgba(0, 136, 255, 0.1);
}

.search-clear {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #999;
  padding: 8px;
}

.search-clear:hover {
  color: #0088FF;
}
```

### Filter Panel
**Purpose**: Advanced filtering options

**HTML Example**:
```html
<div class="filter-panel">
  <div class="filter-section">
    <label class="filter-label">Status</label>
    <div class="filter-options">
      <label class="checkbox-label">
        <input type="checkbox" name="status" value="online">
        <span>Online</span>
      </label>
      <label class="checkbox-label">
        <input type="checkbox" name="status" value="offline">
        <span>Offline</span>
      </label>
    </div>
  </div>
  
  <div class="filter-section">
    <label class="filter-label">Project</label>
    <select class="form-select">
      <option value="">All Projects</option>
      <option value="rsp">Roadrunner Solar</option>
    </select>
  </div>
  
  <div class="filter-actions">
    <button class="btn btn-secondary">Reset</button>
    <button class="btn btn-primary">Apply Filters</button>
  </div>
</div>
```

**CSS Example**:
```css
.filter-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background-color: #F5F7FA;
  border-radius: 8px;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-label {
  font-weight: 600;
  font-size: 14px;
  color: #2C3E50;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #DDD;
}
```

### Active Filters Display
**Purpose**: Show currently applied filters

**HTML Example**:
```html
<div class="active-filters">
  <span class="filter-badge">
    Status: Online
    <button class="badge-remove" aria-label="Remove filter">✕</button>
  </span>
  <span class="filter-badge">
    Project: Roadrunner
    <button class="badge-remove" aria-label="Remove filter">✕</button>
  </span>
  <button class="btn btn-link">Clear all</button>
</div>
```

**CSS Example**:
```css
.active-filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  padding: 12px 0;
}

.filter-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background-color: #EEF1F6;
  border: 1px solid #0088FF;
  border-radius: 4px;
  font-size: 13px;
  color: #0088FF;
}

.badge-remove {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  opacity: 0.7;
}

.badge-remove:hover {
  opacity: 1;
}
```

---

## Pagination

### Pagination Controls
**Purpose**: Navigate through pages of data

**HTML Example**:
```html
<div class="pagination">
  <button class="btn btn-secondary" aria-label="Previous page">← Previous</button>
  
  <div class="page-numbers">
    <button class="page-btn">1</button>
    <button class="page-btn active">2</button>
    <button class="page-btn">3</button>
    <span class="page-ellipsis">...</span>
    <button class="page-btn">10</button>
  </div>
  
  <button class="btn btn-secondary" aria-label="Next page">Next →</button>
  
  <div class="pagination-info">
    <span>Showing <strong>21</strong> to <strong>40</strong> of <strong>2,456</strong> results</span>
  </div>
  
  <div class="rows-per-page">
    <label for="rows-select">Rows per page:</label>
    <select id="rows-select" class="form-select">
      <option value="10">10</option>
      <option value="25" selected>25</option>
      <option value="50">50</option>
      <option value="100">100</option>
    </select>
  </div>
</div>
```

**CSS Example**:
```css
.pagination {
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0;
  flex-wrap: wrap;
}

.page-numbers {
  display: flex;
  gap: 4px;
  align-items: center;
}

.page-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  background: none;
  border: 1px solid #E8EBF0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.page-btn:hover:not(.active) {
  border-color: #0088FF;
  color: #0088FF;
}

.page-btn.active {
  background-color: #0088FF;
  color: #FFFFFF;
  border-color: #0088FF;
}

.page-ellipsis {
  color: #999;
}

.pagination-info {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
}

.rows-per-page {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.rows-per-page .form-select {
  width: 80px;
}
```

---

## Charts & Visualizations

### Chart Container
**Purpose**: Wrapper for chart elements

**HTML Example**:
```html
<div class="chart-card">
  <div class="chart-header">
    <h3 class="chart-title">Battery SOC Trend</h3>
    <div class="chart-controls">
      <button class="btn btn-icon">⋮</button>
    </div>
  </div>
  
  <div class="chart-body">
    <div class="chart-container">
      <!-- Chart library renders here -->
      <svg class="chart" width="100%" height="300"></svg>
    </div>
  </div>
  
  <div class="chart-legend">
    <span class="legend-item">
      <span class="legend-color" style="background-color: #0088FF;"></span>
      <span>Actual SOC</span>
    </span>
    <span class="legend-item">
      <span class="legend-color" style="background-color: #D0D0D0;"></span>
      <span>Expected SOC</span>
    </span>
  </div>
</div>
```

**CSS Example**:
```css
.chart-card {
  background-color: #FFFFFF;
  border: 1px solid #E8EBF0;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #E8EBF0;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #2C3E50;
}

.chart-controls {
  display: flex;
  gap: 8px;
}

.chart-body {
  flex: 1;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-container {
  width: 100%;
}

.chart-legend {
  display: flex;
  gap: 24px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #E8EBF0;
  font-size: 13px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  display: inline-block;
}
```

### Chart Loading State
**Purpose**: Show loading while chart renders

**CSS Example**:
```css
.chart-container.loading {
  background-image: linear-gradient(90deg, #F5F7FA 25%, #EEF1F6 50%, #F5F7FA 75%);
  background-size: 200% 100%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## Notifications & Alerts

### Toast Notification
**Purpose**: Brief dismissible message

**HTML Example**:
```html
<div class="toast toast-success" role="status">
  <span class="toast-icon">✓</span>
  <span class="toast-message">Settings saved successfully!</span>
  <button class="btn btn-icon toast-close" aria-label="Close">✕</button>
</div>
```

**CSS Example**:
```css
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background-color: #FFFFFF;
  border: 1px solid #E8EBF0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 2000;
  animation: slideIn 0.3s ease;
  max-width: 400px;
}

.toast-success {
  border-left: 4px solid #28A745;
}

.toast-error {
  border-left: 4px solid #DC3545;
}

.toast-warning {
  border-left: 4px solid #FFC107;
}

.toast-info {
  border-left: 4px solid #0088FF;
}

.toast-icon {
  font-size: 18px;
  font-weight: 600;
}

.toast-message {
  font-size: 14px;
  color: #2C3E50;
  flex: 1;
}

.toast-close {
  flex-shrink: 0;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### Alert Box
**Purpose**: Persistent notification/warning

**HTML Example**:
```html
<div class="alert alert-danger" role="alert">
  <span class="alert-icon">⚠</span>
  <div class="alert-content">
    <h4 class="alert-title">Error</h4>
    <p class="alert-message">Unable to save changes. Please check your connection and try again.</p>
  </div>
  <button class="btn btn-icon alert-close" aria-label="Close alert">✕</button>
</div>
```

**CSS Example**:
```css
.alert {
  display: flex;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 6px;
  border: 1px solid;
  margin-bottom: 24px;
}

.alert-danger {
  background-color: #F8D7DA;
  border-color: #F5C6CB;
  color: #721C24;
}

.alert-warning {
  background-color: #FFF3CD;
  border-color: #FFEAA7;
  color: #856404;
}

.alert-success {
  background-color: #D4EDDA;
  border-color: #C3E6CB;
  color: #155724;
}

.alert-info {
  background-color: #D1ECF1;
  border-color: #BEE5EB;
  color: #0C5460;
}

.alert-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-title {
  margin: 0 0 4px;
  font-weight: 600;
  font-size: 14px;
}

.alert-message {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
}

.alert-close {
  flex-shrink: 0;
  margin-top: -2px;
}
```

---

## Loading States

### Skeleton Screen
**Purpose**: Placeholder while content loads

**HTML Example**:
```html
<div class="skeleton">
  <div class="skeleton-text skeleton-text-lg" style="width: 60%;"></div>
  <div class="skeleton-text" style="width: 100%;"></div>
  <div class="skeleton-text" style="width: 90%;"></div>
</div>
```

**CSS Example**:
```css
.skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-text {
  height: 16px;
  background: linear-gradient(90deg, #F5F7FA 25%, #EEF1F6 50%, #F5F7FA 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

.skeleton-text-lg {
  height: 24px;
}

@keyframes pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Spinner
**Purpose**: Rotating loader icon

**HTML Example**:
```html
<div class="spinner"></div>
```

**CSS Example**:
```css
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #E8EBF0;
  border-top-color: #0088FF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Progress Bar
**Purpose**: Show progress of a task

**HTML Example**:
```html
<div class="progress">
  <div class="progress-bar" style="width: 65%;"></div>
</div>
<div class="progress-text">65% Complete</div>
```

**CSS Example**:
```css
.progress {
  height: 8px;
  background-color: #E8EBF0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #0088FF;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
  text-align: center;
}
```

---

## Empty & Error States

### Empty State
**Purpose**: Message when no data available

**HTML Example**:
```html
<div class="empty-state">
  <div class="empty-icon">📊</div>
  <h3 class="empty-title">No Data Available</h3>
  <p class="empty-message">There are no devices matching your filters. Try adjusting your search criteria.</p>
  <button class="btn btn-primary">Clear Filters</button>
</div>
```

**CSS Example**:
```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  color: #999;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #2C3E50;
  margin: 0 0 8px;
}

.empty-message {
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 24px;
  max-width: 400px;
}
```

### Error State
**Purpose**: Message when error occurs

**HTML Example**:
```html
<div class="error-state">
  <div class="error-icon">⚠</div>
  <h3 class="error-title">Unable to Load Data</h3>
  <p class="error-message">An error occurred while fetching the data. Please check your connection and try again.</p>
  <button class="btn btn-primary">Retry</button>
  <button class="btn btn-tertiary">Contact Support</button>
</div>
```

**CSS Example**:
```css
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  color: #721C24;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.error-title {
  font-size: 18px;
  font-weight: 600;
  color: #DC3545;
  margin: 0 0 8px;
}

.error-message {
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 24px;
  max-width: 400px;
}
```

---

## Common Patterns

### Confirmation Dialog Pattern
**Usage**: Before destructive action (delete, disable, etc.)

**Implementation**:
1. User clicks destructive button
2. Modal opens with:
   - Clear warning message
   - Item being affected
   - Two buttons: Cancel | Confirm
3. Confirm button disabled for 1 second (prevents accidental clicks)
4. On confirm: Execute action + show success toast
5. On cancel: Close modal, no changes

### Multi-Step Form Pattern
**Usage**: Complex data entry across multiple screens

**Implementation**:
1. Progress indicator at top (Step 1/3, Step 2/3, etc.)
2. Single step visible at a time
3. Previous/Next buttons at bottom
4. Validate before moving to next step
5. Show summary on final step before submission

### Filter & Search Pattern
**Usage**: Narrow down large datasets

**Implementation**:
1. Search bar at top (real-time filtering)
2. Filter panel below (advanced options)
3. Show active filters with remove buttons
4. Results count updates dynamically
5. [Reset All] button to clear everything

### Refresh Pattern
**Usage**: Reload data without page refresh

**Implementation**:
1. Refresh button in header (rotating icon on click)
2. Show loading state (opacity 0.6 or skeleton)
3. Keep scroll position if possible
4. Show "Updated X seconds ago" timestamp
5. Auto-refresh option in settings (optional)

### Master-Detail Pattern
**Usage**: List with details sidebar/modal

**Implementation**:
1. List view on left
2. Detail view on right (or modal on click)
3. Selecting item highlights it + loads details
4. Close detail view to focus on list
5. Back button in detail view

---

End of Components & Patterns Library
