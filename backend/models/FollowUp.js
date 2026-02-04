const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: String, required: true },
    type: { type: String, required: true }, // Call, Visit, Message, Membership Renewal, Balance Due, etc.
    dateTime: { type: Date, required: true },
    status: { type: String, default: 'Hot' }, // Hot, Warm, Cold
    comment: { type: String },
    isDone: { type: Boolean, default: false },
    enquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enquiry' },
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    createdBy: { type: String, default: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('FollowUp', followUpSchema);
