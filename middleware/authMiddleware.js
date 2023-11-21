require('dotenv').config();
const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
    const token = req.cookies.jwt;
    
    // check json web token exists and verified
    if (token) {
        jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next()
            }
        });
    } else {
        res.redirect('/login');
    }
}

module.exports = { requireAuth };