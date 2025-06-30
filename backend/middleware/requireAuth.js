const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
  // First we need to get the authorization 
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).json({error: 'Authorization not provided'})
  }
  const token = authorization.split(' ')[1];
  // Now we need to verify the token: valid = attach user to request (req.user = _id), invalid return error!
  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findById(_id).select('_id username')
    next()
  }
  catch (error) {
    res.status(401).json({error: 'Request is not authorized. You must be logged in.'})
  }
}

module.exports = requireAuth