const User = require('../models/User');

// handle errors
function handelErrors(err) {
    console.log('Message:', err.message, '\nError Code:', err.code,'\n');
    let errors = { email: '', password: ''};

    // validation errors
    if (err.message.includes('user validation failed')) {
        console.log(err, '\n');
        // To see details => console.log(Object.values(err.errors))
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    // duplicate error code
    if (err.code == 11000) {
        errors[email] = 'The email is already registered';
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

// post
module.exports.signup_post = async (req, res) => {
    const  { email, password } = req.body; 
    try {
        const user = await User.create({ email, password });
        res.status(200).json(user);
    } catch (error) {
        let errors = handelErrors(error);
        res.status(400).send(errors);
    }
};

module.exports.login_post = (req, res) => {
    const  { email, password } = req.body; 
    console.log(email, password);
    res.send('new login');
};