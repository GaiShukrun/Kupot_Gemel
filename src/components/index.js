
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./Models/Users');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

// MongoDB connection string
const uri = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});


// Register endpoint in server-side code (index.js)
app.post('/api/users/register', async (req, res) => {
  const { username, password, firstname, lastname, securityQuestion, securityAnswer } = req.body;
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
          role: 'user' // Default to 'user' if role is not provided
      });

     

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/api/users/login', async (req, res) => {

  const { username, password, } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Assuming 'role' is stored in your user schema, include it in the response
    console.log(user.role)
    res.status(200).json({ message: 'Login successful', user: { username: user.username, role: user.role } });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/api/users', async (req, res) => {
  try {
      const users = await User.find({ role: 'user' });
      console.log(users);
      res.json(users);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send('Error logging out');
    } else {
      res.send('Logout successful');

    }
})});

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
