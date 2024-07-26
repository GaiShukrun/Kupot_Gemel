const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    username: { type: String, required: true },
    answers: { type: Map, of: String, required: true }
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
