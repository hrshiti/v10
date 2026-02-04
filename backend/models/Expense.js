const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    expenseType: {
        type: String,
        required: [true, 'Please add an expense type']
    },
    description: {
        type: String
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount']
    },
    date: {
        type: Date,
        required: [true, 'Please add a date']
    },
    paymentMode: {
        type: String,
        required: [true, 'Please select a payment mode'],
        enum: ["Credit Card", "Debit Card", "Google Pay", "BHIM", "NEFT", "RTGS", "IMPS", "Cash", "Cheque"]
    },
    staffName: {
        type: String,
        required: [true, 'Please select a staff name']
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);
