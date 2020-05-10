const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
// const dotenv = require("dotenv");
// Env Variables
require('dotenv').config()
// Calling routes
const homepageRouter = require('./routes/index');
const connectDatabase = require('./config/db.config');
const errorHandler = require('./middlewares/error');
// Connect to database
connectDatabase();
const app = express();
// Body parser for parsing our requests
app.use(express.json());
// Cookie parser
app.use(cookieParser());
// log middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// Sanitizing our data
app.use(mongoSanitize());
// Enable CORS
app.use(cors());
// mounting routers
app.use('/', homepageRouter);
// handle error
app.use(errorHandler);
const PORT = process.env.PORT || 8080;
const server = app.listen(
    PORT,
    console.log(
        `Server running on ${process.env.NODE_ENV} mode on port ${PORT}`
    )
);
// Handle unhandle promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});