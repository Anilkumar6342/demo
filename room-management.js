// Hospital Room Management System
class RoomManagement {
    constructor() {
        // Initialize room data structure
        this.roomTypes = {
            'General Ward': {
                name: 'General Ward',
                capacity: 15,
                price: 500,
                rooms: []
            },
            'Private Room': {
                name: 'Private Room',
                capacity: 10,
                price: 1500,
                rooms: []
            },
            'ICU': {
                name: 'ICU (Intensive Care Unit)',
                capacity: 8,
                price: 3000,
                rooms: []
            },
            'Emergency': {
                name: 'Emergency Ward',
                capacity: 12,
                price: 800,
                rooms: []
            },
            'Maternity': {
                name: 'Maternity Ward',
                capacity: 6,
                price: 2000,
                rooms: []
            },
            'Pediatric': {
                name: 'Pediatric Ward',
                capacity: 8,
                price: 1200,
                rooms: []
            }
        };

        // Initialize rooms for each type
        this.initializeRooms();
        
        // Store patients data
        this.patients = JSON.parse(localStorage.getItem('hospitalPatients')) || [];
        
        // Initialize the system
        this.init();
    }

    initializeRooms() {
        // Generate room numbers for each room type
        Object.keys(this.roomTypes).forEach(type => {
            const capacity = this.roomTypes[type].capacity;
            const prefix = this.getRoomPrefix(type);
            
            for (let i = 1; i <= capacity; i++) {
                this.roomTypes[type].rooms.push({
                    number: `${prefix}${i.toString().padStart(3, '0')}`,
                    isOccupied: false,
                    patientId: null
                });
            }
        });
    }

    getRoomPrefix(roomType) {
        const prefixes = {
            'General Ward': 'GW',
            'Private Room': 'PR',
            'ICU': 'IC',
            'Emergency': 'ER',
            'Maternity': 'MT',
            'Pediatric': 'PD'
        };
        return prefixes[roomType] || 'RM';
    }

    init() {
        // Set today's date as default
        document.getElementById('admissionDate').value = new Date().toISOString().split('T')[0];
        
        // Load room types
        this.loadRoomTypes();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load existing data
        this.loadExistingData();
        
        // Render initial views
        this.renderRoomOverview();
        this.renderPatientList();
    }

    setupEventListeners() {
        // Room type selection
        document.getElementById('roomType').addEventListener('change', (e) => {
            this.handleRoomTypeChange(e.target.value);
        });

        // Save patient
        document.getElementById('savePatient').addEventListener('click', () => {
            this.savePatient();
        });

        // Discharge patient
        document.getElementById('confirmDischarge').addEventListener('click', () => {
            this.dischargePatient();
        });
    }

    loadRoomTypes() {
        const roomTypeSelect = document.getElementById('roomType');
        roomTypeSelect.innerHTML = '<option value="">Select Room Type</option>';
        
        Object.keys(this.roomTypes).forEach(type => {
            const availableRooms = this.getAvailableRooms(type).length;
            const totalRooms = this.roomTypes[type].rooms.length;
            
            const option = document.createElement('option');
            option.value = type;
            option.textContent = `${type} (${availableRooms}/${totalRooms} available)`;
            
            // Disable if no rooms available
            if (availableRooms === 0) {
                option.disabled = true;
                option.textContent += ' - Full';
            }
            
            roomTypeSelect.appendChild(option);
        });
    }

    handleRoomTypeChange(selectedType) {
        const roomNumberSelect = document.getElementById('roomNumber');
        
        if (!selectedType) {
            roomNumberSelect.innerHTML = '<option value="">First select room type</option>';
            roomNumberSelect.disabled = true;
            return;
        }

        // Get available rooms for selected type
        const availableRooms = this.getAvailableRooms(selectedType);
        
        roomNumberSelect.innerHTML = '<option value="">Select Room Number</option>';
        
        if (availableRooms.length === 0) {
            roomNumberSelect.innerHTML = '<option value="">No rooms available</option>';
            roomNumberSelect.disabled = true;
            return;
        }

        availableRooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room.number;
            option.textContent = `Room ${room.number}`;
            roomNumberSelect.appendChild(option);
        });
        
        roomNumberSelect.disabled = false;
    }

    getAvailableRooms(roomType) {
        return this.roomTypes[roomType].rooms.filter(room => !room.isOccupied);
    }

    savePatient() {
        const form = document.getElementById('patientForm');
        const formData = new FormData(form);
        
        // Validate form
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Get form values
        const patientData = {
            id: Date.now().toString(),
            name: document.getElementById('patientName').value,
            age: document.getElementById('patientAge').value,
            gender: document.getElementById('patientGender').value,
            phone: document.getElementById('patientPhone').value,
            address: document.getElementById('patientAddress').value,
            roomType: document.getElementById('roomType').value,
            roomNumber: document.getElementById('roomNumber').value,
            admissionDate: document.getElementById('admissionDate').value,
            doctorName: document.getElementById('doctorName').value,
            status: 'Admitted'
        };

        // Validate room selection
        if (!patientData.roomType || !patientData.roomNumber) {
            alert('Please select both room type and room number');
            return;
        }

        // Check if room is still available
        const room = this.roomTypes[patientData.roomType].rooms.find(r => r.number === patientData.roomNumber);
        if (!room || room.isOccupied) {
            alert('Selected room is no longer available. Please select another room.');
            this.loadRoomTypes();
            this.handleRoomTypeChange(patientData.roomType);
            return;
        }

        // Allocate room
        room.isOccupied = true;
        room.patientId = patientData.id;

        // Add patient to list
        this.patients.push(patientData);

        // Save to localStorage
        this.saveData();

        // Update UI
        this.loadRoomTypes();
        this.renderRoomOverview();
        this.renderPatientList();

        // Reset form and close modal
        form.reset();
        document.getElementById('admissionDate').value = new Date().toISOString().split('T')[0];
        bootstrap.Modal.getInstance(document.getElementById('addPatientModal')).hide();

        // Show success message
        this.showAlert('Patient added successfully!', 'success');
    }

    dischargePatient() {
        const patientId = document.getElementById('confirmDischarge').dataset.patientId;
        const patient = this.patients.find(p => p.id === patientId);
        
        if (!patient) return;

        // Free up the room
        const room = this.roomTypes[patient.roomType].rooms.find(r => r.number === patient.roomNumber);
        if (room) {
            room.isOccupied = false;
            room.patientId = null;
        }

        // Remove patient from list
        this.patients = this.patients.filter(p => p.id !== patientId);

        // Save data
        this.saveData();

        // Update UI
        this.loadRoomTypes();
        this.renderRoomOverview();
        this.renderPatientList();

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('dischargeModal')).hide();

        // Show success message
        this.showAlert('Patient discharged successfully!', 'warning');
    }

    loadExistingData() {
        // Load patients and update room occupancy
        this.patients.forEach(patient => {
            const room = this.roomTypes[patient.roomType]?.rooms.find(r => r.number === patient.roomNumber);
            if (room) {
                room.isOccupied = true;
                room.patientId = patient.id;
            }
        });
    }

    renderRoomOverview() {
        const container = document.getElementById('roomOverview');
        container.innerHTML = '';

        Object.keys(this.roomTypes).forEach(type => {
            const roomType = this.roomTypes[type];
            const occupiedRooms = roomType.rooms.filter(r => r.isOccupied).length;
            const totalRooms = roomType.rooms.length;
            const availableRooms = totalRooms - occupiedRooms;
            const occupancyPercentage = Math.round((occupiedRooms / totalRooms) * 100);

            const card = document.createElement('div');
            card.className = `card mb-3 room-card ${availableRooms === 0 ? 'room-type-disabled' : 'room-available'}`;
            card.innerHTML = `
                <div class="card-body">
                    <h6 class="card-title">${type}</h6>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <small class="text-muted">Available: ${availableRooms}/${totalRooms}</small>
                        </div>
                        <div>
                            <span class="badge ${availableRooms === 0 ? 'bg-danger' : 'bg-success'}">
                                ${availableRooms === 0 ? 'Full' : 'Available'}
                            </span>
                        </div>
                    </div>
                    <div class="progress mt-2" style="height: 6px;">
                        <div class="progress-bar ${occupancyPercentage === 100 ? 'bg-danger' : 'bg-info'}" 
                             style="width: ${occupancyPercentage}%"></div>
                    </div>
                    <small class="text-muted">${occupancyPercentage}% occupied</small>
                </div>
            `;
            container.appendChild(card);
        });
    }

    renderPatientList() {
        const container = document.getElementById('patientList');
        container.innerHTML = '';

        if (this.patients.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> No patients currently admitted.
                </div>
            `;
            return;
        }

        this.patients.forEach(patient => {
            const patientCard = document.createElement('div');
            patientCard.className = 'card mb-3 patient-card';
            patientCard.innerHTML = `
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-8">
                            <h6 class="card-title mb-1">${patient.name}</h6>
                            <p class="card-text mb-1">
                                <small class="text-muted">
                                    <i class="bi bi-person"></i> ${patient.age} years, ${patient.gender} |
                                    <i class="bi bi-telephone"></i> ${patient.phone || 'N/A'} |
                                    <i class="bi bi-calendar"></i> Admitted: ${new Date(patient.admissionDate).toLocaleDateString()}
                                </small>
                            </p>
                            <p class="card-text mb-1">
                                <i class="bi bi-geo-alt"></i> ${patient.address || 'Address not provided'}
                            </p>
                            ${patient.doctorName ? `<p class="card-text mb-0"><i class="bi bi-person-badge"></i> Dr. ${patient.doctorName}</p>` : ''}
                        </div>
                        <div class="col-md-4 text-end">
                            <div class="mb-2">
                                <span class="badge bg-primary fs-6">${patient.roomType}</span>
                            </div>
                            <div class="mb-2">
                                <span class="badge bg-secondary fs-6">Room ${patient.roomNumber}</span>
                            </div>
                            <button class="btn btn-warning btn-sm" onclick="roomManager.showDischargeModal('${patient.id}', '${patient.name}')">
                                <i class="bi bi-box-arrow-right"></i> Discharge
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(patientCard);
        });
    }

    showDischargeModal(patientId, patientName) {
        document.getElementById('dischargePatientName').textContent = patientName;
        document.getElementById('confirmDischarge').dataset.patientId = patientId;
        new bootstrap.Modal(document.getElementById('dischargeModal')).show();
    }

    saveData() {
        localStorage.setItem('hospitalPatients', JSON.stringify(this.patients));
    }

    showAlert(message, type = 'info') {
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alertDiv);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 3000);
    }

    // Get room statistics
    getRoomStats() {
        const stats = {};
        Object.keys(this.roomTypes).forEach(type => {
            const rooms = this.roomTypes[type].rooms;
            stats[type] = {
                total: rooms.length,
                occupied: rooms.filter(r => r.isOccupied).length,
                available: rooms.filter(r => !r.isOccupied).length
            };
        });
        return stats;
    }

    // Search functionality
    searchPatients(query) {
        return this.patients.filter(patient => 
            patient.name.toLowerCase().includes(query.toLowerCase()) ||
            patient.roomNumber.toLowerCase().includes(query.toLowerCase()) ||
            patient.doctorName?.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Export data functionality
    exportData() {
        const data = {
            patients: this.patients,
            roomStats: this.getRoomStats(),
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `hospital-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }
}

// Initialize the room management system when page loads
let roomManager;

document.addEventListener('DOMContentLoaded', function() {
    roomManager = new RoomManagement();
    
    // Additional event listeners for form validation
    const form = document.getElementById('patientForm');
    const inputs = form.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    });

    // Reset form validation when modal is closed
    document.getElementById('addPatientModal').addEventListener('hidden.bs.modal', function() {
        form.reset();
        form.classList.remove('was-validated');
        inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });
        
        // Reset room selection
        document.getElementById('roomNumber').innerHTML = '<option value="">First select room type</option>';
        document.getElementById('roomNumber').disabled = true;
        
        // Reset date
        document.getElementById('admissionDate').value = new Date().toISOString().split('T')[0];
    });
});

// Utility functions for data management
function clearAllData() {
    if (confirm('Are you sure you want to clear all patient data? This action cannot be undone.')) {
        localStorage.removeItem('hospitalPatients');
        location.reload();
    }
}

function exportHospitalData() {
    roomManager.exportData();
}

// Auto-save functionality
setInterval(() => {
    if (roomManager) {
        roomManager.saveData();
    }
}, 30000); // Auto-save every 30 seconds