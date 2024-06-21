const express = require('express');
const router = express.Router();
const User = require('../Models/Users');

// Route to register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).send('User registered');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
});

module.exports = router;
