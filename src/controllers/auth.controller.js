const User = require('../models/user.model');
const { generateToken } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    try {
        const { username, email, password, fullName, phoneNumber } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Create new user - password will be hashed by pre-save middleware
        const user = new User({ username, email, password, fullName, phoneNumber });
        await user.save();

        const token = generateToken(user);
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        
        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            token,
            refreshToken,
            username: user.username,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Không tìm thấy tên người dùng' });
        }
        if (!await user.comparePassword(password)) {
            return res.status(401).json({ message: 'Mật khẩu không đúng' });
        }
        const token = generateToken(user);
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        
        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            message: 'Login successful',
            token,
            refreshToken,
            username: user.username,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (user) {
            user.refreshToken = null;
            await user.save();
        }
        res.json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token required' });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const newToken = generateToken(user);
        res.json({ token: newToken });
    } catch (error) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

module.exports = {
    register,
    login,
    logout,
    refreshToken
};
