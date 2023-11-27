// require('dotenv').config();
const User = require('../models/User');
const Post = require('../models/Post');
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

// get - home
module.exports.home_get = async (req, res) => {
    const locals = {
        title: 'Home'
    };
    try {
        const data = await Post.find();
        res.render('home', { locals, data })
    } catch (error) {

    }
};

// get - signup
module.exports.signup_get = (req, res) => {
    const locals = {
        title: 'Sign Up'
    };
    res.render('signup', { locals });
};

// get - login
module.exports.login_get = (req, res) => {
    const locals = { 
        title: 'Log In'
    }
    res.render('login', { locals });
};

// get - logout
module.exports.logout_get = (req,res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};

// post - signup
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

// post - login
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

// get - blog
module.exports.blog_get = async (req, res) => {
    try {
        const email = req.params.email;
        const token = req.cookies.jwt;
        if (token) {
            const decodedToken = jwt.verify(token, process.env.SECRET);
            let { email: tokenEmail} = await User.findById(decodedToken.id);
            if (tokenEmail === email) {
                /////////////////////
            }
        }
        const data = await Post.find({ email });
        const { nickName } = await User.findOne({ email });
        const locals = {
            title: `${nickName}'s Blog`
        }
        res.render('blog', { locals, data });
    } catch (error) {
        console.log(error);
    }
}

// get - add blog
module.exports.add_blog_get = (req, res) => {
    const locals = {
        title: 'Add New Post'
    };
    res.render('add-blog', { locals });
};

// post - add blog
module.exports.add_blog_post = async (req, res) => {
    try {
    const { title, body } = req.body;
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    let { nickName, email } = await User.findById(decodedToken.id);
    const post = await Post.create({ nickName, email, title, body });
    res.status(200).json(post)
    } catch (error) {
        console.log(error);
    }
};

// get - each post
module.exports.post_get = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.findById(id);
        const { nickName: host } = await User.findOne({ email: post.email});
        const locals = {
            title: post.title
        };
        res.render('post', { locals, post, host });
    } catch (error) {
        console.log(error);
    }
};