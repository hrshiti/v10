const asyncHandler = require('express-async-handler');
const Employee = require('../../models/Employee');
const EmployeeAttendance = require('../../models/EmployeeAttendance');
const SuccessStory = require('../../models/SuccessStory');

// @desc    Get currently present trainers for member dashboard
// @route   GET /api/user/trainers/present
// @access  Private/User
const getPresentTrainers = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const activeAttendance = await EmployeeAttendance.find({
        date: { $gte: today, $lt: tomorrow },
        outTime: { $exists: false }
    }).populate({
        path: 'employeeId',
        select: 'firstName lastName photo gymActivities experience gymRole active'
    });

    const presentTrainers = activeAttendance
        .filter(record => {
            const emp = record.employeeId;
            if (!emp || !emp.active) return false;
            const roles = emp.gymRole || [];
            return roles.some(role => typeof role === 'string' && role.toLowerCase().includes('trainer'));
        })
        .map(record => record.employeeId);

    res.json(presentTrainers);
});

// @desc    Mark trainer attendance via QR scan
// @route   POST /api/user/trainer/scan
// @access  Private/Trainer
const trainerScanQR = asyncHandler(async (req, res) => {
    const trainer = req.user;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const employee = await Employee.findById(trainer._id);
    if (!employee) {
        res.status(403);
        throw new Error('Trainer record not found. Please contact admin.');
    }

    const existingAttendance = await EmployeeAttendance.findOne({
        employeeId: employee._id,
        date: today
    });

    if (existingAttendance) {
        if (!existingAttendance.outTime) {
            existingAttendance.outTime = new Date();
            const diff = existingAttendance.outTime - existingAttendance.inTime;
            existingAttendance.totalHours = (diff / (1000 * 60 * 60)).toFixed(2);
            await existingAttendance.save();
            return res.json({
                success: true,
                message: 'Punch-out marked successfully',
                type: 'checkout'
            });
        } else {
            return res.json({
                success: false,
                message: 'Attendance already completed for today'
            });
        }
    }

    await EmployeeAttendance.create({
        employeeId: employee._id,
        date: today,
        inTime: new Date(),
        status: 'Present',
        shift: employee.employeeType || 'Full Time'
    });

    res.status(201).json({
        success: true,
        message: 'Punch-in marked successfully',
        type: 'checkin'
    });
});

// @desc    Create Success Story
// @route   POST /api/user/trainer/story
// @access  Private/Trainer
const createSuccessStory = asyncHandler(async (req, res) => {
    const { title, memberName, description, duration } = req.body;

    let beforeImage = '';
    let afterImage = '';

    if (req.files) {
        if (req.files.beforeImage && req.files.beforeImage[0]) {
            beforeImage = req.files.beforeImage[0].path;
        }
        if (req.files.afterImage && req.files.afterImage[0]) {
            afterImage = req.files.afterImage[0].path;
        }
    }

    if (!beforeImage || !afterImage) {
        res.status(400);
        throw new Error('Both Before and After images are required');
    }

    const story = await SuccessStory.create({
        trainerId: req.user._id,
        title,
        memberName,
        description,
        beforeImage,
        afterImage,
        duration
    });

    res.status(201).json(story);
});

// @desc    Get All Success Stories (For Users to see)
// @route   GET /api/user/trainer/stories
// @access  Private/User
const getSuccessStories = asyncHandler(async (req, res) => {
    const stories = await SuccessStory.find({ approved: true })
        .populate('trainerId', 'firstName lastName photo')
        .sort({ createdAt: -1 });
    res.json(stories);
});

// @desc    Get Trainer's Own Stories
// @route   GET /api/user/trainer/my-stories
// @access  Private/Trainer
const getTrainerStories = asyncHandler(async (req, res) => {
    const stories = await SuccessStory.find({ trainerId: req.user._id })
        .sort({ createdAt: -1 });
    res.json(stories);
});

// @desc    Update Success Story
// @route   PUT /api/user/trainer/story/:id
// @access  Private/Trainer
const updateSuccessStory = asyncHandler(async (req, res) => {
    const story = await SuccessStory.findById(req.params.id);
    if (!story) {
        res.status(404);
        throw new Error('Story not found');
    }

    if (story.trainerId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this story');
    }

    const { title, memberName, description, duration } = req.body;

    story.title = title || story.title;
    story.memberName = memberName || story.memberName;
    story.description = description || story.description;
    story.duration = duration || story.duration;

    if (req.files) {
        if (req.files.beforeImage && req.files.beforeImage[0]) {
            story.beforeImage = req.files.beforeImage[0].path;
        }
        if (req.files.afterImage && req.files.afterImage[0]) {
            story.afterImage = req.files.afterImage[0].path;
        }
    }

    const updatedStory = await story.save();
    res.json(updatedStory);
});

// @desc    Delete Success Story
// @route   DELETE /api/user/trainer/story/:id
// @access  Private/Trainer
const deleteSuccessStory = asyncHandler(async (req, res) => {
    const story = await SuccessStory.findById(req.params.id);
    if (!story) {
        res.status(404);
        throw new Error('Story not found');
    }

    if (story.trainerId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this story');
    }

    await story.deleteOne();
    res.json({ message: 'Story removed' });
});

const Member = require('../../models/Member');
const MemberAttendance = require('../../models/MemberAttendance');

// @desc    Get Trainer Dashboard Stats
// @route   GET /api/user/trainer/stats
// @access  Private/Trainer
const getTrainerStats = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await EmployeeAttendance.findOne({
        employeeId: req.user._id,
        date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
    });

    const employee = await Employee.findById(req.user._id).select('firstName lastName photo active');

    const storyCount = await SuccessStory.countDocuments({ trainerId: req.user._id });

    // Count members currently in the gym (Auto-timeout after 60 mins)
    const sixtyMinutesAgo = new Date(Date.now() - 60 * 60 * 1000);
    const membersInGym = await MemberAttendance.countDocuments({
        checkIn: { $gte: sixtyMinutesAgo },
        checkOut: { $exists: false }
    });

    const frozenMembersCount = await Member.countDocuments({ status: 'Frozen' });
    const totalActiveMembers = await Member.countDocuments({ status: 'Active' });

    res.json({
        user: {
            firstName: employee.firstName,
            lastName: employee.lastName,
            photo: employee.photo,
        },
        storyCount,
        membersInGym,
        frozenMembersCount,
        totalActiveMembers,
        userStatus: {
            isPresent: !!attendance,
            type: attendance ? (attendance.outTime ? 'checkout' : 'checkin') : null
        }
    });
});

// @desc    Update Trainer Profile
// @route   PUT /api/user/trainer/profile
// @access  Private/Trainer
const updateTrainerProfile = asyncHandler(async (req, res) => {
    const employee = await Employee.findById(req.user._id);

    if (employee) {
        if (req.body.firstName) employee.firstName = req.body.firstName;
        if (req.body.lastName) employee.lastName = req.body.lastName;
        if (req.body.email) employee.email = req.body.email;
        if (req.body.gender) employee.gender = req.body.gender;
        if (req.body.birthDate) employee.birthDate = req.body.birthDate;
        if (req.body.maritalStatus) employee.maritalStatus = req.body.maritalStatus;
        if (req.body.address) employee.address = req.body.address;
        if (req.body.city) employee.city = req.body.city;
        if (req.body.state) employee.state = req.body.state;
        if (req.body.country) employee.country = req.body.country;
        if (req.body.experience) employee.experience = req.body.experience;
        if (req.body.language) {
            employee.language = Array.isArray(req.body.language)
                ? req.body.language
                : JSON.parse(req.body.language);
        }
        if (req.body.gymActivities) {
            employee.gymActivities = Array.isArray(req.body.gymActivities)
                ? req.body.gymActivities
                : JSON.parse(req.body.gymActivities);
        }

        if (req.file) {
            employee.photo = req.file.path;
        }

        const updatedEmployee = await employee.save();
        res.json({
            _id: updatedEmployee._id,
            firstName: updatedEmployee.firstName,
            lastName: updatedEmployee.lastName,
            email: updatedEmployee.email,
            photo: updatedEmployee.photo,
            role: 'trainer'
        });
    } else {
        res.status(404);
        throw new Error('Trainer not found');
    }
});

module.exports = {
    getPresentTrainers,
    trainerScanQR,
    createSuccessStory,
    getSuccessStories,
    getTrainerStories,
    getTrainerStats,
    updateSuccessStory,
    deleteSuccessStory,
    updateTrainerProfile
};
