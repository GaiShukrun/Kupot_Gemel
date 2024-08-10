const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const userRoutes = require('./routes/api2');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { getBestFunds } = require('./Services/fundRecommendation'); 
const User = require('./Models/Users');
const Answer = require('./Models/Answer');
const Fund = require('./Models/Data');
const Ticket = require('./Models/Ticket');

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


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
/////////////////////////////// Get User-Specific Tickets ///////////////////////////////
app.get('/api/get-user-tickets/:userId', authenticateToken, async (req, res) => {
  const {userId } = req.params;
  try {
    const tickets = await Ticket.find({ createdBy: userId}).populate('createdBy', 'username');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});
//////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////// Create new ticket ///////////////////////////////
app.post('/api/create-ticket', authenticateToken, async (req, res) => {
  const {userId ,title, description } = req.body;
  // Validation
  if (!title || !description) {
    return res.status(400).json({ msg: 'Please include both title and description' });
  }
  
  try {
    // Create a new ticket instance
    const newTicket = new Ticket({
      title,
      description,
      createdBy: userId
    });

    // Save the ticket to the database
    const ticket = await newTicket.save();
    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});
//////////////////////////////////////////////////////////////////////////////////////

app.post('/api/users/:userId/remove-favorite', authenticateToken, async (req, res) => {
  const { fundId } = req.body;
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove the fund from the user's favoriteFunds array
    user.favoriteFunds = user.favoriteFunds.filter(fund => fund.fundId !== fundId);
    await user.save();
    
    res.status(200).json({ message: 'Fund removed from favorites successfully' });
  } catch (error) {
    console.error('Error removing fund from favorites:', error);
    res.status(500).json({ message: 'Error removing fund from favorites', error: error.message });
  }
});

app.get('/api/users/:userId/favorite-funds', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('favoriteFunds');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.favoriteFunds);
  } catch (error) {
    console.error('Error fetching favorite funds:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/users/addFavorite', authenticateToken, async (req, res) => {
  const { fund } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if the fund already exists in the user's favorites
    const fundExists = user.favoriteFunds.some(favFund => favFund.fundName === fund.fundName);
    
    if (fundExists) {
      return res.status(400).json({ message: 'Fund already exists in favorites' });
    }
    
    // Add the favorite fund to the user's favoriteFunds array
    user.favoriteFunds.push(fund);
    await user.save();
    
    res.status(200).json({ message: 'Fund added to favorites successfully' });
  } catch (error) {
    console.error('Error adding fund to favorites:', error);
    res.status(500).json({ message: 'Error adding fund to favorites', error: error.message });
  }
});

app.use('/api/users', userRoutes);

///////////////////////////////// Fetch all funds ///////////////////////////////////////
app.get('/api/funds', async (req, res) => {
  console.log('Received request to fetch all funds');

  try {
    const funds = await Fund.find();
    console.log(`Found ${funds.length} funds`);
    res.status(200).json(funds);
  } catch (error) {
    console.error('Error fetching funds:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////// Fetch single funds ///////////////////////////////////////

app.get('/api/funds/:fundName', async (req, res) => {
  try {
    const funds = await Fund.find({ fundName: req.params.fundName }).sort({ reportPeriod: 1 });
    if (funds.length === 0) {
      return res.status(404).json({ message: 'Fund not found' });
    }
    res.json(funds);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////




//////////////////////////// Get the top 3 recommended funds /////////////////////////////////

async function getUserAnswers(username) {
  const answers = await Answer.findOne({ username });
  if (!answers) {
    return null;
  }
  return answers.answers; 
}

app.get('/api/users/recommend-funds/:username', async (req, res) => {
  try {
    const {username} = req.params;
    const userAnswers = await getUserAnswers(username);
    //console.log("@@@@@@@@",userAnswers,"@@@@@@@@");
    const bestFunds = await getBestFunds(userAnswers);
    //console.log("########",bestFunds,"########");

    res.json(bestFunds);
  } catch (error) {
    console.error('Error recommending funds:', error);
    res.status(500).json({ message: 'Error recommending funds' });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////// Did the user answered the questions? ///////////////////////////////////////
app.get('/api/users/isAnswered/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const result = await Answer.find({username});
    res.json(result.length > 0);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////// Get user answers ////////////////////////
app.get('/api/users/get-answers/:username', async (req, res) => {
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
////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////// Saving user's questions-answers ///////////////////////////////////////
app.post('/api/users/:answers/:username', async (req, res) => {
  console.log("@@@@@@@ USING INDEX.JS @@@@@@@");  
  const { username, answers } = req.body;

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
app.post('/api/user/register', async (req, res) => {

  const { username, password, firstname, lastname, securityQuestion, securityAnswer , role } = req.body;
  console.log('Registration route hit');

  try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(400).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("before hasing: "+password + "after hasing: " + hashedPassword   );
      const newUser = new User({
          username,
          password: hashedPassword,
          firstname,
          lastname,
          securityQuestion,
          securityAnswer,
          role: role ,
          favoriteFunds: []
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
  console.log('Login route hit');

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("Input Password " +password + " DataBase Password " +user.password);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role , firstname: user.firstname, lastname: user.lastname },
      process.env.JWT_SECRET, // Make sure to set this in your .env file
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.status(200).json({ 
      message: 'Login successful', 
      token,
      user: { username: user.username, role: user.role, userId: user._id } 
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