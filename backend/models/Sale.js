const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },

    // Invoice Details
    invoiceNumber: { type: String, unique: true }, // Auto-generate if not provided
    description: { type: String },

    // Financials
    amount: { type: Number, required: true }, // The final paid amount for this transaction
    subTotal: { type: Number }, // Amount before Tax/Discount
    taxAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },

    // Meta
    type: { type: String, required: true }, // 'New Membership', 'Renewal', 'PT', 'Product'
    date: { type: Date, default: Date.now },
    paymentMode: { type: String, default: 'Cash' }, // Cash, UPI, Card

    // Staff Links
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }, // Link to Employee
    closedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }, // Link to Employee
    transactionId: { type: String } // For UPI/Online payments
}, { timestamps: true });

// Auto-generate Invoice Number
saleSchema.pre('save', async function (next) {
    if (!this.invoiceNumber) {
        const date = new Date();
        const year = date.getFullYear();
        const random = Math.floor(10000 + Math.random() * 90000);
        this.invoiceNumber = `INV-${year}-${random}`;
    }
    next();
});

module.exports = mongoose.model('Sale', saleSchema);
