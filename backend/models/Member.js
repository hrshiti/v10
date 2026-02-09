const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    memberId: { type: String, unique: true },

    // Personal Info (Similar to Enquiry)
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    dob: { type: Date },
    address: { type: String },
    photo: { type: String }, // URL to image
    weight: { type: Number },
    height: { type: Number },
    age: { type: Number },

    emergencyContact: {
        name: { type: String },
        number: { type: String }
    },

    // Membership Details
    membershipType: {
        type: String,
        enum: ['General Training', 'Personal Training'],
        default: 'General Training'
    },
    packageName: { type: String, required: true }, // e.g. "Yearly Gold"
    durationMonths: { type: Number, default: 1 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    admissionDate: { type: Date, default: Date.now },

    // Status
    status: {
        type: String,
        enum: ['Active', 'Expired', 'Frozen', 'Pending', 'Inactive'],
        default: 'Active'
    },

    // Financials
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    dueAmount: { type: Number, default: 0 },

    // Documents
    documents: [{
        name: { type: String },
        url: { type: String },
        publicId: { type: String },
        uploadedAt: { type: Date, default: Date.now }
    }],

    // System
    enquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enquiry' }, // Link to original enquiry if any
    createdBy: { type: String },

    // Reporting Fields
    assignedTrainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }, // Link to Employee
    closedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }, // Link to Employee
    discount: { type: Number, default: 0 }, // Discount given on current plan
    commitmentDate: { type: Date } // Date member committed to pay due
}, { timestamps: true });

// Virtual for full name
memberSchema.virtual('name').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Auto-generate Member ID
memberSchema.pre('save', async function () {
    if (!this.memberId) {
        // Simple random ID, in production maybe incrementing
        this.memberId = 'M' + Math.floor(10000 + Math.random() * 90000).toString();
    }

    // Calculate Due Amount automation
    this.dueAmount = Number(this.totalAmount) - (Number(this.paidAmount) + Number(this.discount || 0));

    // Auto Update Status based on dates
    const today = new Date();
    if (this.endDate < today) {
        this.status = 'Expired';
    }
});

module.exports = mongoose.model('Member', memberSchema);
