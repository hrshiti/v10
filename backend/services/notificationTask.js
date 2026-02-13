const cron = require('node-cron');
const Member = require('../models/Member');
const Admin = require('../models/Admin');
const GymDetail = require('../models/GymDetail');
const { sendMulticastNotification } = require('../utils/pushNotification');

/**
 * Task to check for dues today and notify both admins and users
 */
const notifyDuesTask = async () => {
    try {
        console.log('Running daily dues notification task...');

        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const gym = await GymDetail.findOne();
        const logoIcon = gym?.logo || 'https://res.cloudinary.com/db776v7px/image/upload/v1738745269/gym_logo_v10.png';

        // 1. Find members with dueAmount > 0 and commitmentDate for today
        const membersWithDues = await Member.find({
            dueAmount: { $gt: 0 },
            commitmentDate: { $gte: startOfDay, $lte: endOfDay }
        });

        if (membersWithDues.length > 0) {
            console.log(`Found ${membersWithDues.length} members with dues today.`);

            // Get all admin tokens to notify them
            const admins = await Admin.find({ fcmTokens: { $exists: true } });
            const adminTokens = admins.flatMap(a => [a.fcmTokens?.web, a.fcmTokens?.app]).filter(t => t);

            for (const member of membersWithDues) {
                // A. Notify Member
                if (member.fcmTokens) {
                    const memberTokens = [member.fcmTokens.web, member.fcmTokens.app].filter(t => t);
                    if (memberTokens.length > 0) {
                        await sendMulticastNotification(
                            memberTokens,
                            'Payment Reminder',
                            `Hello ${member.firstName}, this is a reminder that your payment of ₹${member.dueAmount} is due today.`,
                            { click_action: '/profile', icon: logoIcon }
                        );
                    }
                }

                // B. Notify Admin (one aggregated notification per member might be too many, but the request says notify admin also)
                if (adminTokens.length > 0) {
                    await sendMulticastNotification(
                        adminTokens,
                        'Daily Due Reminder',
                        `Member ${member.firstName} ${member.lastName} has a payment of ₹${member.dueAmount} due today.`,
                        { click_action: `/admin/members/profile/${member._id}`, icon: logoIcon }
                    );
                }
            }
        } else {
            console.log('No dues found for today.');
        }

    } catch (error) {
        console.error('Error in notifyDuesTask:', error);
    }
};

// Schedule to run every day at 10:00 AM
// '0 10 * * *'
const initNotificationTasks = () => {
    // For testing/dev, you might want it more frequent, but for production 10am is good
    // Running every day at 10 AM
    cron.schedule('0 10 * * *', notifyDuesTask);

    console.log('Push notification tasks scheduled.');
};

module.exports = { initNotificationTasks, notifyDuesTask };
