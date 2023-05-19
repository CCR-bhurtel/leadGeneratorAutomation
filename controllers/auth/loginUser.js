const User = require('../../models/User');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const createSendToken = require('../../utils/createSendToken');

module.exports = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please provide both email and password', 400));
    }
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect Email or Password', 401));
    }

    createSendToken(user, res, 200);
});
