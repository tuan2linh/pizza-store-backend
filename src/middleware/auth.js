const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const isAdmin = async (req, res, next) => {
  auth(req, res, () => {
    if(req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }
  });
};

const isUser = async (req, res, next) => {
  auth(req, res, () => {
    if(req.user && req.user.role === 'user') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. User rights required.' });
    }
  });
};

const generateToken = (user) => {
  const payload = {
    userId: user._id,
    username: user.username,
    role: user.role
  };
  return jwt.sign(payload , process.env.JWT_SECRET, {
    expiresIn: '1h'  // Changed to 1 hour for better security
  });
};

module.exports = {
  auth,
  generateToken,
  isAdmin,
  isUser
};
