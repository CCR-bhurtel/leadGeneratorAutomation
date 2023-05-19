const jwt = require('jsonwebtoken');

const signInToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, res, statusCode) => {
    const token = signInToken(user._id);
    //   const cookieOptions = {
    //     expires: new Date(
    //       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    //     ),
    //     httpOnly: true,
    //   };
    //   if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
    //   res.cookie("jwt", token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        user,
    });
};

module.exports = createSendToken;