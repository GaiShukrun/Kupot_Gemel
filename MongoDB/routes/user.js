
const express = require('express');
const router = express.Router();
const User = require('../Models/Users');
const Answer = require('../Models/Answer');



// Route to register a new user
router.post('/register', async (req, res) => {
    const { username, password, firstname, lastname, securityQuestion, securityAnswer, role } = req.body;

    try {
        const newUser = new User({ username, password, firstname, lastname, securityQuestion, securityAnswer, role });
        await newUser.save();
        res.status(201).send('User registered');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
});


// Route to save user answers
router.post('/answers', async (req, res) => {
    const { username, answers } = req.body;
    console.log('Received request to save answers:', { username, answers });

    try {
        const existingAnswer = await Answer.findOne({ username });
        if (existingAnswer) {
            console.log('Answers already submitted for this user:', username);
            return res.status(400).json({ message: 'Answers already submitted' });
        }

        const newAnswer = new Answer({ username, answers });
        await newAnswer.save();
        res.status(201).json({ message: 'Answers saved successfully' });
    } catch (error) {
        console.error('Error saving answers:', error);
        res.status(500).json({ message: 'Error saving answers', error: error.message });
    }
});

// Route to get user answers
router.get('/answers/:username', async (req, res) => {
    const { username } = req.params;
    console.log('Received request to get answers for user:', username);

    try {
        const answers = await Answer.findOne({ username });
        if (!answers) {
            console.log('No answers found for user:', username);
            return res.status(404).json({ message: 'No answers found for this user' });
        }
        res.status(200).json(answers);
    } catch (error) {
        console.error('Error fetching answers:', error);
        res.status(500).json({ message: 'Error fetching answers', error: error.message });
    }
});

// Route to update user answers
router.put('/answers/:username', async (req, res) => {
    const { username } = req.params;
    const { answers } = req.body;
    console.log('Received request to update answers:', { username, answers });

    try {
        const updatedAnswer = await Answer.findOneAndUpdate({ username }, { answers }, { new: true });
        if (!updatedAnswer) {
            console.log('No answers found for user to update:', username);
            return res.status(404).json({ message: 'No answers found for this user' });
        }
        res.status(200).json({ message: 'Answers updated successfully' });
    } catch (error) {
        console.error('Error updating answers:', error);
        res.status(500).json({ message: 'Error updating answers', error: error.message });
    }
});

module.exports = router;
