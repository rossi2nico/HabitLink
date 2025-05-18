const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
  // Check for auth header
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1]; // Bearer <token>
  console.log("Incoming token:", token);


  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    // Attach user to request (only _id for now)
    req.user = await User.findById(_id).select('_id');
    
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ error: 'Request is not authorized' });
  }
};

module.exports = requireAuth;
