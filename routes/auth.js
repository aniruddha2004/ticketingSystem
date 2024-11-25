const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Register Page
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

// Register Logic
router.post('/register', async (req, res) => {
    const { fullName, email, phone, password } = req.body;
    try {
        const newUser = new User({ fullName, email, phone, password });
        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.redirect('/register');
    }
});

// Login Page
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Login Logic
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            req.session.user = user;
            return res.redirect(user.isAdmin ? '/admin' : '/tickets');
        }
        res.render('login', { title: 'Login', error: 'Invalid email or password' });
    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
