const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Open', 'In progress', 'Closed'],
    default: 'Open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  response: { type: String },
  
  // Add the forwardToAdmin field
  forwardToAdmin: { type: Boolean, default: false }  // New field to track forwarded tickets
});

const Ticket = mongoose.model('Ticket', TicketSchema);

module.exports = Ticket;
