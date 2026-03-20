const cron = require('node-cron');
const Member = require('../models/Member');
const FollowUp = require('../models/FollowUp');

/**
 * Task to check for member events (Birthdays, Anniversaries, Expirations, Dues)
 * and create FollowUp records automatically.
 */
const generateAutoFollowUps = async () => {
    try {
        console.log('Running daily automatic follow-up generation task...');

        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        const endOfToday = new Date(today.setHours(23, 59, 59, 999));
        
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();

        // 1. Birthdays
        const birthdayMembers = await Member.find({
            $expr: {
                $and: [
                    { $eq: [{ $month: '$dob' }, currentMonth] },
                    { $eq: [{ $dayOfMonth: '$dob' }, currentDay] }
                ]
            }
        });
        await createFollowUps(birthdayMembers, 'Birthday', 'System generated: Birthday Today');

        // 2. Anniversaries
        const anniversaryMembers = await Member.find({
            $expr: {
                $and: [
                    { $eq: [{ $month: '$anniversaryDate' }, currentMonth] },
                    { $eq: [{ $dayOfMonth: '$anniversaryDate' }, currentDay] }
                ]
            }
        });
        await createFollowUps(anniversaryMembers, 'Anniversary', 'System generated: Wedding Anniversary Today');

        // 3. Today Expirations (Membership Renewal)
        const expiredMembers = await Member.find({
            endDate: { $gte: startOfToday, $lte: endOfToday }
        });
        await createFollowUps(expiredMembers, 'Membership Renewal', 'System generated: Membership Expiring Today');

        // 4. Today Due Payments (Balance Due)
        const dueMembers = await Member.find({
            dueAmount: { $gt: 0 },
            commitmentDate: { $gte: startOfToday, $lte: endOfToday }
        });
        await createFollowUps(dueMembers, 'Balance Due', `System generated: Payment Due Today (₹${dueMembers.dueAmount || '0'})`);

        console.log('Automatic follow-up generation completed.');

    } catch (error) {
        console.error('Error in generateAutoFollowUps:', error);
    }
};

/**
 * Helper to create follow-up records if they don't already exist for today
 */
async function createFollowUps(members, type, defaultComment) {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    for (const member of members) {
        // Check if follow-up of this type already exists for this member today
        const existing = await FollowUp.findOne({
            memberId: member._id,
            type: type,
            createdAt: { $gte: startOfToday, $lte: endOfToday }
        });

        if (!existing) {
            await FollowUp.create({
                name: `${member.firstName} ${member.lastName}`,
                number: member.mobile,
                type: type,
                dateTime: new Date(),
                status: 'Hot',
                comment: type === 'Balance Due' ? `System generated: Payment Due Today (₹${member.dueAmount})` : defaultComment,
                memberId: member._id,
                handledBy: member.assignedTrainer || undefined,
                createdBy: 'System'
            });
            console.log(`Created ${type} follow-up for ${member.firstName} ${member.lastName}`);
        }
    }
}

/**
 * Schedule the task to run every day at 6:00 AM
 * Also runs once immediately upon server startup.
 */
const initFollowUpTasks = () => {
    // Run once at startup
    generateAutoFollowUps();

    // Every day at 6 AM
    // '0 6 * * *'
    cron.schedule('0 6 * * *', generateAutoFollowUps);
    console.log('Automatic follow-up tasks scheduled at 6:00 AM daily (and running initial check now).');
};

module.exports = { initFollowUpTasks, generateAutoFollowUps };
