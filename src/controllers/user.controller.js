const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password -refreshToken');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password -refreshToken');
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addAddress = async (req, res) => {
    try {
        const { address, recipientName, recipientEmail, recipientPhone } = req.body;
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.addresses.push({ address, recipientName, recipientEmail, recipientPhone });
        await user.save();

        res.status(201).json({ 
            success: true,
            message: 'Address added successfully', 
            addresses: user.addresses 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserInfo = async (req, res) => {
    try {
        const { fullName, phoneNumber } = req.body;
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.fullName = fullName || user.fullName;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        await user.save();

        res.json({ 
            success: true,
            message: 'User information updated successfully', 
            user 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const { address, recipientName, recipientEmail, recipientPhone } = req.body;
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const addressToUpdate = user.addresses.id(addressId);
        if (!addressToUpdate) {
            return res.status(404).json({ message: 'Address not found' });
        }

        addressToUpdate.address = address || addressToUpdate.address;
        addressToUpdate.recipientName = recipientName || addressToUpdate.recipientName;
        addressToUpdate.recipientEmail = recipientEmail || addressToUpdate.recipientEmail;
        addressToUpdate.recipientPhone = recipientPhone || addressToUpdate.recipientPhone;

        await user.save();

        res.json({ 
            success: true,
            message: 'Address updated successfully', 
            addresses: user.addresses 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const addressToDelete = user.addresses.id(addressId);
        if (!addressToDelete) {
            return res.status(404).json({ message: 'Address not found' });
        }

        user.addresses.pull(addressId);
        await user.save();

        res.json({ 
            success: true,
            message: 'Address deleted successfully', 
            addresses: user.addresses 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        // Chỉ cần gán password mới, pre-save middleware sẽ tự động hash
        user.password = newPassword;
        await user.save();

        res.json({ 
            success: true,
            message: 'Password changed successfully' 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProfile,
    getAllUsers,
    addAddress,
    updateUserInfo,
    updateAddress,
    deleteAddress,
    changePassword
};