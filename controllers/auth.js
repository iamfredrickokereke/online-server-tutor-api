const asyncHandler = require('express-async-handler');
const errorHandler = require('../_helpers/error-handler')
const User = require('../models/User');


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
        data: user,
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



// User Login
// General routes
// POST request
// /api/v1/login


exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }
    sendTokenResponse(user, 200, res);
});



//User Logout
// General routes
// get request
// /api/v1/logout
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        data: {},
    });
});


// get profile Informations
// Private Route
// Get request
// /api/v1/profile
exports.profile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        payload: user,
    });
});


// basically , 1000 uses here just for converting second to miliseconds.
// number of seconds in a day. 24 * 60 * 60 = 86400 sec
// 1 sec = 1000 milliseconds
// so after calculating expression,result is in milliseconds
// days * 24 * 60 * 60 * 1000 = days * 86400000 ms  