const mongoose = require('mongoose');
const crypto = require('crypto');

const gymDetailSchema = new mongoose.Schema({
    name: { type: String, default: 'V-10 Fitness' },
    logo: { type: String }, // URL or filename
    contactNumber: { type: String },
    address: { type: String },
    gstNo: { type: String },
    gymCode: {
        type: String,
        unique: true,
        // Auto-generated unique code if not provided
        default: () => `V10GYM_${crypto.randomBytes(8).toString('hex').toUpperCase()}`
    }
}, { timestamps: true });

module.exports = mongoose.model('GymDetail', gymDetailSchema);
