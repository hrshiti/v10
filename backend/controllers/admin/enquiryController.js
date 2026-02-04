const asyncHandler = require('express-async-handler');
const Enquiry = require('../../models/Enquiry');

// @desc    Get All Enquiries with Pagination & Filters
// @route   GET /api/admin/enquiries
// @access  Private/Admin
const getEnquiries = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            $or: [
                { firstName: { $regex: req.query.keyword, $options: 'i' } },
                { lastName: { $regex: req.query.keyword, $options: 'i' } },
                { mobile: { $regex: req.query.keyword, $options: 'i' } }
            ]
        }
        : {};

    let query = { ...keyword };

    if (req.query.status) {
        query.status = req.query.status;
    }
    if (req.query.leadType) {
        query.leadType = req.query.leadType;
    }
    if (req.query.gender) {
        query.gender = req.query.gender;
    }
    if (req.query.handleBy) {
        query.handleBy = req.query.handleBy;
    }

    const count = await Enquiry.countDocuments(query);
    const enquiries = await Enquiry.find(query)
        .populate('handleBy', 'firstName lastName')
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ createdAt: -1 });

    res.json({ enquiries, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Get Enquiry Stats (Top Cards)
// @route   GET /api/admin/enquiries/stats
// @access  Private/Admin
const getEnquiryStats = asyncHandler(async (req, res) => {
    const open = await Enquiry.countDocuments({ status: 'Open' });
    const closed = await Enquiry.countDocuments({ status: 'Closed' });
    const notInterested = await Enquiry.countDocuments({ status: 'Not Interested' });
    const callDone = await Enquiry.countDocuments({ status: 'Call Done' });
    const callNotConnected = await Enquiry.countDocuments({ status: 'Call Not Connected' });

    res.json([
        { label: 'Open Enquiry', value: open },
        { label: 'Close Enquiry', value: closed },
        { label: 'Not Interested', value: notInterested },
        { label: 'Call Done', value: callDone },
        { label: 'Call Not Connected', value: callNotConnected },
    ]);
});

// @desc    Create New Enquiry
// @route   POST /api/admin/enquiries
// @access  Private/Admin
const createEnquiry = asyncHandler(async (req, res) => {
    // Destructure all possible fields from body
    const {
        firstName,
        lastName,
        mobile,
        email,
        landline,
        gender,
        maritalStatus,
        birthDate,
        anniversaryDate,
        address,
        occupation,
        jobProfile,
        companyName,
        emergencyContactName,
        emergencyContactNumber,
        commitmentDate,
        source,
        isExercising,
        currentActivities,
        dropoutReason,
        hasHealthChallenges,
        healthIssueDescription,
        fitnessGoal,
        gymServices,
        trialBooked,
        trialStartDate,
        trialEndDate,
        assignTo, // Maps to handleBy
        leadType,
        personalityType,
        referralMember,
        status,
        remark
    } = req.body;

    // Basic Validation
    if (!firstName || !lastName || !mobile) {
        res.status(400);
        throw new Error('Please provide First Name, Last Name and Mobile Number');
    }

    const enquiry = new Enquiry({
        firstName,
        lastName,
        mobile,
        email,
        landline,
        gender,
        maritalStatus,
        birthDate,
        anniversaryDate,
        address,
        occupation,
        jobProfile,
        companyName,
        emergencyContact: {
            name: emergencyContactName,
            number: emergencyContactNumber
        },
        commitmentDate,
        source,
        isExercising,
        currentActivities,
        dropoutReason,
        hasHealthChallenges,
        healthIssueDescription,
        fitnessGoal,
        gymServices,
        trialBooked,
        trialStartDate,
        trialEndDate,
        handleBy: assignTo || null,
        leadType: leadType || 'Cold',
        personalityType,
        referralMember,
        status: status || 'Open',
        remark,
        createdBy: 'Admin' // TODO: Get from logged in user
    });

    const createdEnquiry = await enquiry.save();
    res.status(201).json(createdEnquiry);
});

// @desc    Update Enquiry
// @route   PUT /api/admin/enquiries/:id
// @access  Private/Admin
const updateEnquiry = asyncHandler(async (req, res) => {
    const enquiry = await Enquiry.findById(req.params.id);

    if (enquiry) {
        // Allow updating any field that is sent in body
        // Using Object.assign or manual check - sticking to explicit for clarity
        const fields = [
            'firstName', 'lastName', 'mobile', 'email', 'landline', 'gender', 'maritalStatus',
            'birthDate', 'anniversaryDate', 'address', 'occupation', 'jobProfile', 'companyName',
            'commitmentDate', 'source', 'isExercising', 'currentActivities', 'dropoutReason',
            'hasHealthChallenges', 'healthIssueDescription', 'fitnessGoal', 'gymServices',
            'trialBooked', 'trialStartDate', 'trialEndDate', 'leadType', 'personalityType',
            'referralMember', 'status', 'remark'
        ];

        fields.forEach(field => {
            if (req.body[field] !== undefined) {
                enquiry[field] = req.body[field];
            }
        });

        // Special handling for nested or mapped fields
        if (req.body.emergencyContactName) enquiry.emergencyContact.name = req.body.emergencyContactName;
        if (req.body.emergencyContactNumber) enquiry.emergencyContact.number = req.body.emergencyContactNumber;
        if (req.body.assignTo !== undefined) enquiry.handleBy = req.body.assignTo || null;

        const updatedEnquiry = await enquiry.save();
        res.json(updatedEnquiry);
    } else {
        res.status(404);
        throw new Error('Enquiry not found');
    }
});

// @desc    Delete Enquiry
// @route   DELETE /api/admin/enquiries/:id
// @access  Private/Admin
const deleteEnquiry = asyncHandler(async (req, res) => {
    const enquiry = await Enquiry.findById(req.params.id);

    if (enquiry) {
        await enquiry.deleteOne();
        res.json({ message: 'Enquiry removed' });
    } else {
        res.status(404);
        throw new Error('Enquiry not found');
    }
});

module.exports = {
    getEnquiries,
    getEnquiryStats,
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
};
