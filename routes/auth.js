const express = require('express');
const { protect } = require('../middlewares/auth');
const {
    register,
    login,
} = require('../controllers/auth');
const router = express.Router();

router.post('/register', register);

router.post('./login', login)


module.exports = router;