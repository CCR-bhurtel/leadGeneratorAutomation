const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const util = require('util');
const User = require('../models/User');

module.exports = catchAsync(async (req, res, next) => {
    // Get token from the header
    const token = req.header('x-auth-token');

    //   Check if no token
    if (!token) return next(new AppError('No token, authorization denied', 401, '/login'));

    //   Verify token
    const decodedPayload = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decodedPayload.id);

    req.user = currentUser;
    next();
});
