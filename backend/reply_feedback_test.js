const mongoose = require('mongoose');
require('dotenv').config();
const Feedback = require('./models/Feedback');

async function replyToFeedback() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const feedbackId = 'FB677594380';
        const replyText = 'Thank you so much for your kind words! We are thrilled that you are enjoying your experience at V10 Gym. Keep grinding!';

        const updated = await Feedback.findOneAndUpdate(
            { feedbackId: feedbackId },
            {
                replyMessage: replyText,
                status: 'Replied'
            },
            { new: true }
        );

        if (updated) {
            console.log('Feedback Replied Successfully!');
            console.log('FeedbackID:', updated.feedbackId);
            console.log('Reply:', updated.replyMessage);
            console.log('Status:', updated.status);
        } else {
            console.log('Feedback not found with ID:', feedbackId);
        }

    } catch (err) {
        console.error('Error replying to feedback:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

replyToFeedback();
