require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

// create PORT
const PORT = 3000 || process.env.PORT;

// create application
const app = express();

// set view engine
app.use(expressLayout);
app.set('layout', './main');
app.set('view engine', 'ejs');

// set middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

// connecting to database
mongoose.connect(process.env.MONGODB_URI)
    .then((result) => {
        console.log("Database connneted");
        return app.listen(PORT);
    })
    .catch((err) => console.log(err));

// set route
app.get('/', (req, res) => {
    res.render('main');
})
app.use(authRoutes);