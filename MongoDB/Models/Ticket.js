const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Ticket Response Schema
// const TicketResponseSchema = new Schema({
//   content: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
//   respondedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
// });

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
  //assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  response: { type: String }
});

const Ticket = mongoose.model('Ticket', TicketSchema);

module.exports = Ticket;