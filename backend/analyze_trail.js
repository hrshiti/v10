const mongoose = require('mongoose');
const Member = require('./models/Member');
const Subscription = require('./models/Subscription');
const Sale = require('./models/Sale');
require('dotenv').config();

const test = async () => {
    try {
        await mongoose.connect('mongodb+srv://mayurchadokar14:Mayur123@cluster0.uc7l30b.mongodb.net/v10');

        const member = await Member.findOne({ firstName: /Amit/i, lastName: /Mankar/i });
        if (!member) {
            console.log('Member not found');
            process.exit();
        }

        console.log(`\n--- Detailed Trail for ${member.firstName} ${member.lastName} ---`);
        console.log(`Member Master: Total: ${member.totalAmount}, Paid: ${member.paidAmount}, Disc: ${member.discount}, Due: ${member.dueAmount}`);

        const subs = await Subscription.find({ memberId: member._id });
        console.log('\nSubscriptions:');
        let subTotalSum = 0;
        subs.forEach(s => {
            console.log(`- ${s.packageName}: Total ₹${s.totalAmount}, Paid ₹${s.paidAmount}, Disc ₹${s.discount || 0}, Status: ${s.status}`);
            subTotalSum += (s.totalAmount || 0);
        });
        console.log(`Sum of Subscription totalAmount: ₹${subTotalSum}`);

        const sales = await Sale.find({ memberId: member._id });
        console.log('\nSales (Cash Collected):');
        let salePaidSum = 0;
        let saleDiscSum = 0;
        sales.forEach(s => {
            console.log(`- ${s.type}: Amount ₹${s.amount}, Discount ₹${s.discountAmount || 0}, Date: ${s.createdAt.toLocaleDateString()}`);
            salePaidSum += (s.amount || 0);
            saleDiscSum += (s.discountAmount || 0);
        });
        console.log(`Sum of Sales Amount (Paid): ₹${salePaidSum}`);
        console.log(`Sum of Sales Discounts: ₹${saleDiscSum}`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

test();
