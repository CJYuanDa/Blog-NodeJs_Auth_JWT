require('dotenv').config();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// create token
const maxAge = 3 * 24 * 60 * 60;
function createToken(id) {
    return jwt.sign({ id }, process.env.SECRET, {
        expiresIn: maxAge
    });
}

// handle errors
function handelErrors(err) {
    console.log('Message:', err.message, '\nError Code:', err.code,'\n');
    let errors = { nickName:'', email: '', password: ''};

    // validation errors
    if (err.message.includes('user validation failed')) {
        // console.log(err, '\n');
        // To see details => console.log(Object.values(err.errors))
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    // login error
    if (err.message === 'Incorrect email') {
        errors.email = 'The email is invalid.';
    } 
    if (err.message === 'Incorrect password') {
        errors.password = 'The password is invalid.';
    }

    // duplicate error code
    if (err.code == 11000) {
        errors.email = 'The email is already registered';
        return errors;
    }
    return errors;
};

// get
module.exports.signup_get = (req, res) => {
    res.render('signup');
};

module.exports.login_get = (req, res) => {
    res.render('login');
};

module.exports.logout_get = (req,res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};

// post
module.exports.signup_post = async (req, res) => {
    const  { nickName, email, password } = req.body; 
    try {
        const user = await User.create({ nickName, email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000, sameSite: 'lax'});
        res.status(201).json({ user: user._id });
    } catch (error) {
        let errors = handelErrors(error);
        res.status(400).send({ errors });
    }
};

module.exports.login_post = async (req, res) => {
    const  { email, password } = req.body; 
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000, sameSite: 'lax'});
        res.status(201).json({ user: user._id });
    } catch (error) {
        let errors = handelErrors(error);
        res.status(400).send({ errors });
    }
};