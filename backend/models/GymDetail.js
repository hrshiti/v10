const mongoose = require('mongoose');

const gymDetailSchema = new mongoose.Schema({
    name: { type: String, default: 'V-10 Fitness' },
    logo: { type: String }, // URL or filename
    contactNumber: { type: String },
    address: { type: String },
    gstNo: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('GymDetail', gymDetailSchema);
