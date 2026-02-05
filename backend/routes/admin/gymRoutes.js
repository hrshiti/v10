const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../../config/cloudinary');
const upload = multer({ storage });
const { getGymDetails, updateGymDetails } = require('../../controllers/admin/gymController');
const { protect } = require('../../middlewares/authMiddleware');

router.use(protect);

router.get('/', getGymDetails);
router.put('/', upload.single('logo'), updateGymDetails);

module.exports = router;
