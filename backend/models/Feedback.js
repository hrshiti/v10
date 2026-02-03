const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    userName: { type: String, required: true },
    type: { type: String, enum: ['Compliment', 'Complaint', 'Suggestion'], default: 'Suggestion' },
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 }, // 1-5 Stars
    status: { type: String, enum: ['New', 'Read', 'Replied'], default: 'New' },

    // Admin Reply
    replyMessage: { type: String },
    replyDate: { type: Date },
    repliedBy: { type: String }, // Admin Name
    feedbackId: { type: String, unique: true }

}, { timestamps: true });

// Auto-generate Unique Feedback ID
feedbackSchema.pre('save', async function () {
    if (!this.feedbackId) {
        // Simple alphanumeric ID based on time and random
        this.feedbackId = 'FB' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
