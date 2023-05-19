const User = require('../../models/User');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const createSendToken = require('../../utils/createSendToken');

module.exports = signup = catchAsync(async (req, res, next) => {
    //   Return the json web token as a cookie
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError('Please input all fields', 400));

    const user = await User.create(req.body);

    createSendToken(user, res, 201);
});
