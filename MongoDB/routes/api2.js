
const express = require('express');
const router = express.Router();
const { getBestFunds } = require('../Services/fundRecommendation');
const User = require('../Models/Users');
const Answer = require('../Models/Answer');



// // Route to register a new user
// router.post('/register', async (req, res) => {
//     const { username, password, firstname, lastname, securityQuestion, securityAnswer, role } = req.body;

//     try {
//         const newUser = new User({ username, password, firstname, lastname, securityQuestion, securityAnswer, role });
//         await newUser.save();
//         res.status(201).send('User registered');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error registering user');
//     }
// });



///////////////////////////////////////////////////////////////////




module.exports = router;