require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const hbs = require('hbs');
const path = require('path');

const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const adminRoutes = require('./routes/admin');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// Configure hbs as view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Register partials
hbs.registerPartials(path.join(__dirname, 'views/partials'));

hbs.registerHelper('eq', function (a, b) {
    return a === b;
});


// Middleware to make user session available in all views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null; // Pass user data or null if not logged in
    next();
});

// Routes
app.use('/', homeRoutes);
app.use('/', authRoutes);
app.use('/tickets', ticketRoutes);
app.use('/admin', adminRoutes);



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
