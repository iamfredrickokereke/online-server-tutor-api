const express = require('express');
const homepage = require('../controllers/index');
const homepageRouter = express.Router();
homepageRouter.get('/', homepage);
module.exports = homepageRouter;


