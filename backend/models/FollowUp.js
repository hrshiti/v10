const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: String, required: true },
    type: { type: String, required: true }, // Balance Due, Membership Renewal, etc.
    dateTime: { type: Date, required: true },
    status: { type: String, default: 'Hot' }, // Hot, Warm, Cold
    comment: { type: String },
    isDone: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('FollowUp', followUpSchema);
