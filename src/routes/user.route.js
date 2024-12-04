const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { auth, isAdmin } = require('../middleware/auth');

router.get('/profile', auth, userController.getProfile);
router.get('/all', auth, isAdmin, userController.getAllUsers);
router.post('/address', auth, userController.addAddress);
router.put('/update', auth, userController.updateUserInfo);
router.put('/address/:addressId', auth, userController.updateAddress);
router.delete('/address/:addressId', auth, userController.deleteAddress);
router.put('/change-password', auth, userController.changePassword);

module.exports = router;
