const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    enquiryId: { type: String, unique: true }, // e.g., 806642
    createdAt: { type: Date, default: Date.now },

    // Personal Info
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },
    landline: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },
    birthDate: { type: Date },
    anniversaryDate: { type: Date },
    address: { type: String },

    // Professional Info
    occupation: { type: String },
    jobProfile: { type: String },
    companyName: { type: String },
    emergencyContact: {
        name: { type: String },
        number: { type: String }
    },

    // Gym Info
    commitmentDate: { type: Date },
    source: { type: String }, // Where did you hear about us
    isExercising: { type: String, enum: ['Yes', 'No'] },
    currentActivities: { type: String }, // If exercising, what activities
    dropoutReason: { type: String },

    // Health
    hasHealthChallenges: { type: String, enum: ['Yes', 'No'] },
    healthIssueDescription: { type: String },

    // Goals & Services
    fitnessGoal: { type: String },
    gymServices: [{ type: String }], // Array of services

    // Trial & Sales
    trialBooked: { type: String, default: 'No' }, // Yes, No, Clear
    trialStartDate: { type: Date },
    trialEndDate: { type: Date },

    // Lead Management
    handleBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }, // Assigned trainer/staff ref
    leadType: { type: String, enum: ['Hot', 'Warm', 'Cold'], default: 'Cold' },
    personalityType: { type: String }, // Gym Donor, Gym Goer, etc.
    referralMember: { type: String },

    // System
    status: { type: String, default: 'Open' }, // Open, Closed, etc.
    remark: { type: String },
    createdBy: { type: String }
}, { timestamps: true });

// Virtual for full name
enquirySchema.virtual('name').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Pre-save to generate ID
// Pre-save to generate ID
enquirySchema.pre('save', async function () {
    if (!this.enquiryId) {
        this.enquiryId = Math.floor(100000 + Math.random() * 900000).toString();
    }
});

module.exports = mongoose.model('Enquiry', enquirySchema);
