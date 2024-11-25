const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// Admin Dashboard
router.get('/', async (req, res) => {
    const user = req.session.user;
    if (!user || !user.isAdmin) return res.redirect('/login');

    const tickets = await Ticket.find().populate('user', 'fullName email');
    res.render('admin', { tickets });
});

// Update Ticket Status
router.post('/update/:id', async (req, res) => {
    const user = req.session.user;
    if (!user || !user.isAdmin) {
        return res.status(403).send('Access denied');
    }

    const { id } = req.params;
    const { status, comments } = req.body;

    try {
        const updateData = { status };

        // Add a comment only if provided
        if (comments) {
            updateData.$push = {
                comments: { text: comments, author: user.fullName }, // Admin's name as author
            };
        }

        await Ticket.findByIdAndUpdate(id, updateData);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.redirect('/admin');
    }
});

// Delete Ticket
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Ticket.findByIdAndDelete(id);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.redirect('/admin');
    }
});


module.exports = router;
