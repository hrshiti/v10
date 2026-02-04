const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' }, // Optional if package is deleted later

    // Plan Details (Snapshot as packages might change)
    packageName: { type: String, required: true },
    duration: { type: Number, required: true },
    durationType: { type: String, enum: ['Months', 'Days'], default: 'Months' },
    sessions: { type: Number },

    // Validity
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    // Financials
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    dueAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },

    // Status
    status: {
        type: String,
        enum: ['Active', 'Expired', 'Upcoming', 'Frozen', 'Transferred', 'Cancelled'],
        default: 'Active'
    },

    // Lifecycle Tracking
    isCurrent: { type: Boolean, default: true },

    // Freeze History
    freezeHistory: [{
        startDate: { type: Date },
        endDate: { type: Date },
        reason: { type: String },
        durationDays: { type: Number },
        unfrozenAt: { type: Date }
    }],

    // Audit
    assignedTrainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    remarks: { type: String }
}, { timestamps: true });

// Auto-calculate status before saving
subscriptionSchema.pre('save', async function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(this.startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(this.endDate);
    end.setHours(0, 0, 0, 0);

    if (this.status !== 'Frozen' && this.status !== 'Transferred' && this.status !== 'Cancelled') {
        if (today < start) {
            this.status = 'Upcoming';
        } else if (today > end) {
            this.status = 'Expired';
        } else {
            this.status = 'Active';
        }
    }

    this.dueAmount = this.totalAmount - this.paidAmount;
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
