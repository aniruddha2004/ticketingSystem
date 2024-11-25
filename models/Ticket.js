const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: String }, // Optional: store author's name or ID
    createdAt: { type: Date, default: Date.now },
});

const TicketSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, default: 'Open' }, // Open, In Progress, Closed
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [CommentSchema], // Array of comments
});

module.exports = mongoose.model('Ticket', TicketSchema);
