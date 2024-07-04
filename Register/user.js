
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: {type:String, require:true},
    lastname: {type:String, require:true},
    securityQuestion: {type:String, require:true},
    securityAnswer: { type:String, require:true},
    role: { type: String, enum: ['user', 'admin','tech'], default: 'user' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;