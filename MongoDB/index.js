const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const userRoutes = require('./routes/user');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./Models/Users');
const Answer = require('./Models/Answer');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

const jwt = require('jsonwebtoken');


const uri = process.env.MONGODB_URI;


mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});


app.use('/api/users', userRoutes);



///////////////////////////////// Saving user's questions-answers ///////////////////////////////////////
app.post('/api/users/:answers/:username', async (req, res) => {
    const { username, answers } = req.body;

    try {
        const newAnswer = new Answer({ username, answers });
        await newAnswer.save();
        res.status(201).json({ message: 'Answers saved successfully' });
    } catch (error) {
        console.error('Error saving answers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////// Updating user's questions-answers ///////////////////////////////////////
app.put('/api/users/:answers/:username', async (req, res) => {
  const { username,answers } = req.body;
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
////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////// Deleting user's questions-answers ///////////////////////////////////////
app.delete('/api/users/answers/:username', async (req, res) => {
  const { username } = req.params;
  console.log('Received request to delete answers for user:', username);

  try {
      const deletedAnswer = await Answer.findOneAndDelete({ username });
      if (!deletedAnswer) {
          console.log('No answers found for user to delete:', username);
          return res.status(404).json({ message: 'No answers found for this user' });
      }
      res.status(200).json({ message: 'Answers deleted successfully' });
  } catch (error) {
      console.error('Error deleting answers:', error);
      res.status(500).json({ message: 'Error deleting answers', error: error.message });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////// Deleting user from Admin Panel ///////////////////////////////////////
app.delete('/api/users/:userId', async (req, res) => {

  try {
      const userId = req.params.userId;

      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////// Get security question for a user ///////////////////////////////
app.get('/api/users/security-question', async (req, res) => {
  const { username } = req.query;
  try {
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ securityQuestion: user.securityQuestion });
  } catch (error) {
      console.error('Error fetching security question:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////




//////////////////////////////// Verify security answer ///////////////////////////////////
app.post('/api/users/verify-security-answer', async (req, res) => {
  const { username, securityAnswer } = req.body;
  try {
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      if (user.securityAnswer !== securityAnswer) {
          return res.status(401).json({ message: 'Incorrect security answer' });
      }
      res.status(200).json({ message: 'Security answer verified' });
  } catch (error) {
      console.error('Error verifying security answer:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////// Reset password ///////////////////////////////////////
app.post('/api/users/reset-password', async (req, res) => {
  const { username, newPassword } = req.body;
  try {
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////// Register //////////////////////////////////////
app.post('/api/users/register', async (req, res) => {
  const { username, password, firstname, lastname, securityQuestion, securityAnswer , role } = req.body;
  try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(400).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
          username,
          password: hashedPassword,
          firstname,
          lastname,
          securityQuestion,
          securityAnswer,
          role: role 
      });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
///////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////// Login /////////////////////////////////////////////////
app.post('/api/users/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET, // Make sure to set this in your .env file
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.status(200).json({ 
      message: 'Login successful', 
      token,
      user: { username: user.username, role: user.role } 
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////// fetchUsers for Admin Panel //////////////////////////////////////////
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['user', 'tech'] } });

      res.json(users);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////// Logout ////////////////////////////////////////////
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send('Error logging out');
    } else {
      res.send('Logout successful');

    }
})});
///////////////////////////////////////////////////////////////////////////////////////////////



// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});