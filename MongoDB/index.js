// // index.js (Server Side)
// const express = require('express');
// const mysql = require('mysql');
// const session = require('express-session');
// require('dotenv').config();

// const app = express();
// app.use(express.json());
// app.use(cors());

// // Create a MySQL connection
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
// });

// // Connect to MySQL
// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     return;
//   }
//   console.log('Connected to MySQL');
// });

// // Define the port
// const port = process.env.PORT || 5000;

// // Use sessions
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true
// }));

// // Basic route
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// // Register route
// app.post('/register', (req, res) => {
//   const { username, password } = req.body;
//   const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
//   db.query(sql, [username, password], (err, result) => {
//     if (err) {
//       console.error('Error inserting user:', err);
//       res.status(500).send('Error registering user');
//       return;
//     }
//     res.send('User registered');
//   });
// });

// // Login route
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
//   const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
//   db.query(sql, [username, password], (err, results) => {
//     if (err) {
//       console.error('Error fetching user:', err);
//       res.status(500).send('Error logging in');
//       return;
//     }
//     if (results.length > 0) {
//       req.session.user = username;
//       res.send('Login successful');
//     } else {
//       res.status(401).send('Invalid credentials');
//     }
//   });
// });

// // Logout route
// app.post('/logout', (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       res.status(500).send('Error logging out');
//     } else {
//       res.send('Logout successful');
//     }
//   });
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

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

app.post('/api/users/register', async (req, res) => {
  const { username, password } = req.body;
  try {
      // Check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
          username,
          password: hashedPassword
      });

      // Save the user to the database
      await newUser.save();

      res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
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

      res.status(200).json({ message: 'Login successful' });
  } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Internal server error' });
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
  });
});

// Define the port
const port = process.env.PORT || 5000;

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
