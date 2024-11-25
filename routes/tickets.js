const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// Ticket Dashboard
router.get('/', async (req, res) => {
    const user = req.session.user;
    if (!user) return res.redirect('/login');

    const tickets = await Ticket.find({ user: user._id });
    res.render('dashboard', { tickets });
});

// Create Ticket
router.post('/create', async (req, res) => {
    const user = req.session.user;
    if (!user) return res.redirect('/login');

    const { title, description } = req.body;

    try {
        const newTicket = new Ticket({ title, description, user: user._id });
        await newTicket.save();
        res.redirect('/tickets');
    } catch (err) {
        console.error(err);
        res.redirect('/tickets');
    }
});

module.exports = router;
