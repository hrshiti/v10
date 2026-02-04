const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employeeId: { type: String, unique: true },
    photo: { type: String }, // URL to image
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    maritalStatus: { type: String, enum: ['Single', 'Married'] },
    birthDate: { type: Date, required: true },
    anniversaryDate: { type: Date },
    language: [{ type: String }],
    gymRole: [{ type: String }], // Multi-select: Trainer, Manager, etc.
    gymActivities: [{ type: String }], // Services they handle
    address: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    employeeType: { type: String, enum: ['Full Time', 'Shift Time'], default: 'Full Time' },
    active: { type: Boolean, default: true }
}, { timestamps: true });

// Auto-generate Employee ID
employeeSchema.pre('save', async function () {
    if (!this.employeeId) {
        this.employeeId = 'EMP' + Math.floor(100000 + Math.random() * 900000).toString();
    }
});

module.exports = mongoose.model('Employee', employeeSchema);
