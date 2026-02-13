const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    memberId: { type: String, unique: true },

    // Personal Info
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

    // Field for storage (old records or caching)
    packageNameStatic: { type: String, alias: 'packageName' }, // Aliased to packageName for legacy data
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    membershipType: {
        type: String,
        enum: ['General Training', 'Personal Training'],
        default: 'General Training'
    },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: Number },
    durationType: { type: String, enum: ['Months', 'Days'], default: 'Months' },
    durationMonths: { type: Number }, // For backward compatibility if needed
    admissionDate: { type: Date, default: Date.now },

    // Status
    status: {
        type: String,
        enum: ['Active', 'Expired', 'Frozen', 'Pending', 'Inactive'],
        default: 'Active'
    },
    isBlocked: {
        type: Boolean,
        default: false
    },

    // Financials
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    dueAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },

    // Documents
    documents: [{
        name: { type: String },
        url: { type: String },
        publicId: { type: String },
        uploadedAt: { type: Date, default: Date.now }
    }],

    // System
    enquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enquiry' },
    createdBy: { type: String },

    // Reporting Fields
    assignedTrainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    closedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    commitmentDate: { type: Date },
    fcmTokens: {
        web: { type: String },
        app: { type: String }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for dynamic Package Name from linked Package schema
// For compatibility with frontend, use a virtual named packageName
// This will override the field but can access it via the alias or _doc
memberSchema.virtual('packageName').get(function () {
    return this.packageId?.name || this.packageNameStatic || 'N/A';
});

memberSchema.set('toJSON', { virtuals: true });
memberSchema.set('toObject', { virtuals: true });

// Virtual for full name
memberSchema.virtual('name').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Auto-generate Member ID and handle financials
memberSchema.pre('save', async function () {
    if (!this.memberId) {
        this.memberId = 'M' + Math.floor(10000 + Math.random() * 90000).toString();
    }

    // Calculate Due Amount
    const total = Number(this.totalAmount) || 0;
    const paid = Number(this.paidAmount) || 0;
    const disc = Number(this.discount || 0) || 0;
    this.dueAmount = Math.max(0, total - (paid + disc));

    // Auto Update Status
    const today = new Date();
    if (this.endDate < today) {
        this.status = 'Expired';
    }
});

module.exports = mongoose.model('Member', memberSchema);
