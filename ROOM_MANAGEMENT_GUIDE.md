# Hospital Room Management System

## Overview
यह एक comprehensive hospital room management system है जो आपके Tapovan Hospital project के लिए बनाया गया है। इस system में multiple room types और dynamic room allocation की सुविधा है।

## Features

### 🏥 Room Types
1. **General Ward** - 15 rooms (GW001-GW015) - ₹500/day
2. **Private Room** - 10 rooms (PR001-PR010) - ₹1500/day  
3. **ICU** - 8 rooms (IC001-IC008) - ₹3000/day
4. **Emergency Ward** - 12 rooms (ER001-ER012) - ₹800/day
5. **Maternity Ward** - 6 rooms (MT001-MT006) - ₹2000/day
6. **Pediatric Ward** - 8 rooms (PD001-PD008) - ₹1200/day

### 🎯 Key Functionality

#### Patient Registration
- Complete patient information form
- Dynamic room type selection
- Room number selection based on availability
- Automatic room allocation

#### Room Management
- Real-time room availability tracking
- Automatic disable of occupied rooms
- Disable room type when all rooms are full
- Visual status indicators

#### Patient Management
- View all current patients
- Patient discharge functionality
- Room deallocation on discharge
- Patient search functionality

## Files Created

1. **`room-management.html`** - Main room management interface
2. **`room-management.js`** - Core JavaScript functionality
3. **`room-management.css`** - Styling and animations
4. **`hospital-dashboard.html`** - Dashboard with statistics and overview

## How to Use

### 1. Adding a Patient
1. Click "Add Patient" button
2. Fill patient details (Name, Age, Gender, etc.)
3. Select Room Type from dropdown
4. Select available Room Number
5. Set admission date and doctor name
6. Click "Add Patient"

### 2. Room Selection Logic
- First select room type
- Only available rooms will show in room number dropdown
- If room type is full, it will be disabled
- If all rooms in a type are occupied, the type shows as "Full"

### 3. Discharge Patient
1. Click "Discharge" button next to patient
2. Confirm discharge
3. Room automatically becomes available

### 4. Dashboard Features
- View total patients, available rooms, occupancy rate
- Recent admissions list
- Room alerts for high occupancy
- Export data functionality
- Generate reports

## Technical Details

### Data Structure
```javascript
roomTypes = {
    'General Ward': {
        name: 'General Ward',
        capacity: 15,
        price: 500,
        rooms: [
            { number: 'GW001', isOccupied: false, patientId: null },
            // ... more rooms
        ]
    },
    // ... other room types
}
```

### Patient Data
```javascript
patient = {
    id: 'unique_timestamp',
    name: 'Patient Name',
    age: 25,
    gender: 'Male',
    phone: '9876543210',
    address: 'Patient Address',
    roomType: 'General Ward',
    roomNumber: 'GW001',
    admissionDate: '2024-01-15',
    doctorName: 'Dr. Smith',
    status: 'Admitted'
}
```

### Local Storage
- Patient data is automatically saved in browser's localStorage
- Data persists between browser sessions
- Auto-save every 30 seconds

## Integration with Existing Project

The room management system has been integrated with your existing `index.html`:
- Added "HOSPITAL MANAGEMENT" dropdown in navigation
- Links to Dashboard and Room Management pages
- Maintains your existing design theme

## Usage Instructions

1. **Start with Dashboard**: Open `hospital-dashboard.html` for overview
2. **Add Patients**: Use `room-management.html` for patient registration
3. **View Status**: Dashboard shows real-time statistics
4. **Export Data**: Use export functionality for reports

## Room Allocation Rules

1. ✅ Patient must select room type first
2. ✅ Only available rooms are shown
3. ✅ Once selected, room becomes unavailable
4. ✅ Room type disabled when all rooms occupied
5. ✅ Room freed when patient discharged
6. ✅ Real-time updates across all views

## Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile responsive design

## Future Enhancements
- Room booking advance booking
- Payment integration
- Doctor scheduling
- Patient medical records
- Bed transfer functionality
- Room maintenance tracking

---

**Developer**: Created for Tapovan Hospital Management System
**Version**: 1.0
**Last Updated**: January 2024