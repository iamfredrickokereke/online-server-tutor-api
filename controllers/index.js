const homepage = (req, res, next) => {
    res.status(200).json({ message: 'Welcome to my Online Tutor App: Nodejs task Ptoject by StartNG' });
};
module.exports = homepage;