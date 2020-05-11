const express = require('express');
const { protect } = require('../middlewares/auth');
const {
    register,
    login,
    logout,
    profile,
} = require('../controllers/auth');
const router = express.Router();

router.post('/register', register);

router.post('/login', login)

router.post('/logout', logout)

router.use(protect);

router.get('/profile', profile);




module.exports = router;