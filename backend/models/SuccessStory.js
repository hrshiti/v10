const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    title: { type: String, required: true },
    memberName: { type: String, required: true },
    description: { type: String },
    beforeImage: { type: String, required: true }, // URL
    afterImage: { type: String, required: true }, // URL
    duration: { type: String }, // e.g. "3 Months"
    approved: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('SuccessStory', successStorySchema);
