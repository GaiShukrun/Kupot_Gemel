const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./Models/Users');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Session configuration
const secretKey = 'your_secret_key_here'; // Replace with a securely generated string
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true
}));

const cors = require('cors');
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));




// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});




////////////////////////////////////// Register //////////////////////////////////////
app.post('/api/users/register', async (req, res) => {
  const { username, password, firstname, lastname, securityQuestion, securityAnswer, role } = req.body;
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
          role
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




//////////////////////////////////////// Login /////////////////////////////////////////////////
app.post('/api/users/login', async (req, res) => {
  const { username, password } = req.body;
  try {
      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Check if the password matches
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid password' });
      }

      res.status(200).json({ message: 'Login successful', user: { username: user.username, role: user.role } });
  } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Internal server error' });
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
  });
});
///////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////// fetchUsers for Admin Panel //////////////////////////////////////////
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////// Deleting user from Admin Panel ///////////////////////////////////////
app.delete('/api/users/:userId', async (req, res) => {
  try {
      const userId = req.params.userId;
      console.log(`Attempting to delete user with id: ${userId}`);
      
      const deletedUser = await User.findByIdAndDelete(userId);
      
      if (!deletedUser) {
          console.error(`User not found: ${userId}`);
          return res.status(404).json({ message: 'User not found' });
      }
      
      console.log(`User deleted successfully: ${userId}`);
      res.json({ message: 'User deleted successfully' });
  } catch (error) {
      console.error(`Error deleting user with id ${userId}:`, error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////// Get security question for a user ///////////////////////////////
app.get('/api/users/security-question/:username', async (req, res) => {
  try {
      const user = await User.findOne({ username: req.params.username });
      if (!user) {
          console.log(`User not found: ${req.params.username}`);
          return res.status(404).json({ message: 'User not found' });
      }
      res.json({ securityQuestion: user.securityQuestion });
  } catch (error) {
      console.error('Error occurred while fetching security question:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////// Verify security answer ///////////////////////////////////
app.post('/api/users/verify-security-answer', async (req, res) => {
  try {
      const { username, securityAnswer } = req.body;
      const user = await User.findOne({ username });
      if (!user || user.securityAnswer !== securityAnswer) {
          console.log(`Invalid security answer for user: ${username}`);
          return res.status(400).json({ message: 'Invalid username or security answer' });
      }
      res.json({ message: 'Security answer verified' });
  } catch (error) {
      console.error('Error occurred while verifying security answer:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////// Reset password ///////////////////////////////////////
app.post('/api/users/reset-password', async (req, res) => {
  try {
      const { username, newPassword } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
          console.log(`User not found: ${username}`);
          return res.status(404).json({ message: 'User not found' });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      res.json({ message: 'Password reset successfully' });
  } catch (error) {
      console.error('Error occurred while resetting password:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////


// Define the port
const port = process.env.PORT || 5000;

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
