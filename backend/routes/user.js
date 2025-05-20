const express = require('express');
const {
  completeRegisterCtrl,
  uploadProfilePictureCtrl,
  updateProfileCtrl,
  getUserProfileCtrl,
  changePasswordCtrl,
  deleteUserCtrl,
  reactivateUserCtrl,
} = require('../controllers/user');
const {
  validatorCompleteRegister,
  validatorProfilePicture,
  validatorUpdateProfile,
  validatorChangePassword,
} = require('../validators/user');
const { authMiddleware } = require('../middleware/session');
const { uploadMiddlewareMemory } = require('../middleware/storage');

const router = express.Router();

router.put('/complete-register', authMiddleware, validatorCompleteRegister, completeRegisterCtrl);
router.patch(
  '/profile-picture',
  authMiddleware,
  uploadMiddlewareMemory.single('profilePicture'),
  validatorProfilePicture,
  uploadProfilePictureCtrl
);
router.patch('/update-profile', authMiddleware, validatorUpdateProfile, updateProfileCtrl);
router.put('/change-password', authMiddleware, validatorChangePassword, changePasswordCtrl);
router.get('/', authMiddleware, getUserProfileCtrl);
router.delete('/', authMiddleware, deleteUserCtrl);
router.post('/reactivate/:id', authMiddleware, reactivateUserCtrl);

module.exports = router;
