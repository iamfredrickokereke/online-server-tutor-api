const asyncHandler = require('express-async-handler');
const errorHandler = require('../_helpers/error-handler')
const User = require('../models/user');


//function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Creates token from thr user model function
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
    });
};


// User Registration 
// General Routes
// POST request
exports.register = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, password, role, isAdmin } = req.body;
    if (role === 'admin')
        return next(new ErrorResponse('You can\'t regsiter as an Admin', 400));
    // Register a new User
    const user = await User.create({
        firstName,
        lastName,
        email,
        isAdmin,
        password,
        role,
    });
    sendTokenResponse(user, 200, res);
});


// basically , 1000 uses here just for converting second to miliseconds.
// number of seconds in a day. 24 * 60 * 60 = 86400 sec
// 1 sec = 1000 milliseconds
// so after calculating expression,result is in milliseconds
// days * 24 * 60 * 60 * 1000 = days * 86400000 ms  