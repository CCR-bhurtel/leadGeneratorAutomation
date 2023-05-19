const mongoose = require('mongoose');
const validator = require('validator');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
// const gravatar = require("gravatar");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please include a valid email'],
        unique: [true, 'This email is already taken, please provide another'],
        validate: [validator.isEmail, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please enter a password with 6 or more character'],
        minlength: 6,
        select: false,
    },

    date: {
        type: Date,
        default: new Date(),
    },

    passwordChangedAt: Date,
});
// User.
//   findOne({ name: 'Val' }).
//   populate({
//     path: 'friends',
//     // Get friends of friends - populate the 'friends' array for every friend
//     populate: { path: 'friends' }
//   });
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = catchAsync(async function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
});

module.exports = User = mongoose.model('User', userSchema);
