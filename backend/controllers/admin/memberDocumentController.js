const asyncHandler = require('express-async-handler');
const Member = require('../../models/Member');
const { cloudinary } = require('../../config/cloudinaryDocuments');

// @desc    Upload member documents
// @route   POST /api/admin/members/:id/documents
// @access  Private/Admin
const uploadMemberDocument = asyncHandler(async (req, res) => {
    const member = await Member.findById(req.params.id);

    if (!member) {
        res.status(404);
        throw new Error('Member not found');
    }

    if (!req.files || req.files.length === 0) {
        res.status(400);
        throw new Error('No files uploaded');
    }

    // Process uploaded files
    const documents = req.files.map(file => ({
        name: file.originalname,
        url: file.path,
        publicId: file.filename
    }));

    // Add documents to member
    member.documents.push(...documents);
    await member.save();

    res.status(201).json({
        message: 'Documents uploaded successfully',
        documents: member.documents
    });
});

// @desc    Get member documents
// @route   GET /api/admin/members/:id/documents
// @access  Private/Admin
const getMemberDocuments = asyncHandler(async (req, res) => {
    const member = await Member.findById(req.params.id).select('documents');

    if (!member) {
        res.status(404);
        throw new Error('Member not found');
    }

    res.json(member.documents);
});

// @desc    Delete member document
// @route   DELETE /api/admin/members/:id/documents/:documentId
// @access  Private/Admin
const deleteMemberDocument = asyncHandler(async (req, res) => {
    const member = await Member.findById(req.params.id);

    if (!member) {
        res.status(404);
        throw new Error('Member not found');
    }

    const document = member.documents.id(req.params.documentId);

    if (!document) {
        res.status(404);
        throw new Error('Document not found');
    }

    // Delete from Cloudinary
    if (document.publicId) {
        try {
            await cloudinary.uploader.destroy(document.publicId, { resource_type: 'auto' });
        } catch (error) {
            console.error('Error deleting from Cloudinary:', error);
        }
    }

    // Remove from member documents array
    member.documents.pull(req.params.documentId);
    await member.save();

    res.json({ message: 'Document deleted successfully' });
});

module.exports = {
    uploadMemberDocument,
    getMemberDocuments,
    deleteMemberDocument
};
