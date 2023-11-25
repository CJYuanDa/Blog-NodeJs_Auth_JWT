const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// signup
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);

// login
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);

// logout
router.get('/logout', authController.logout_get);

// add-blog
router.get('/add-blog', authController.add_blog_get);
router.post('/add-blog', authController.add_blog_post);

// blog
router.get('/blog/:email', authController.blog_get);

// each post
router.get('/post/:id', authController.post_get);

module.exports = router;