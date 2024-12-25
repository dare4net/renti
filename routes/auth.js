const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleWare');
const router = express.Router();
const queryDatabase = require('../util/queryDatabase');
const generateUserId = require('../util/generateUserId');

const users = []; // In-memory user storage. Replace with a database in production.

// Register a new user
router.post('/register', async (req, res) => {
  console.log("called api/auth/register");
  const { firstname, lastname, password, email, usertype } = req.body;
  let userid = generateUserId();

  if (!email || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  userid = usertype == 'seeker' ? 'se_'+userid : 'ag_'+userid; // to generate the user id with prefix
  const sql = `INSERT INTO users (user_type, first_name, last_name, email, user_id, password_hash) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [usertype, firstname, lastname, email, userid, hashedPassword];
  querydb = await queryDatabase(sql, values);
  //users.push({ firstname, password: hashedPassword });
  res.status(201).json({ message: 'User registered successfully' });
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  sql = `SELECT user_id, password_hash FROM users WHERE email=?`;
  let user = await queryDatabase(sql, email);
  user = user[0];
  console.log(user);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  //res.status(200).json({ message: 'logged in!' });
  // Compare password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  // If your code is here it means the credentials is correct
  const userid = user.user_id; //store user id from database
  // Generate access token
  const accessToken = jwt.sign(
    { userid },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '1h' } // Access token expires in 1 hour
  );

  // Generate refresh token
  const refreshToken = jwt.sign(
    { userid },
    process.env.JWT_REFRESH_SECRET, // Use a separate secret for refresh tokens
    { expiresIn: '7d' } // Refresh token expires in 7 days
  );

  // Optional: Store the refresh token in a database or memory
  // Example: Save to user object (adjust as needed for your database)
  sql = `UPDATE users SET refresh_token=? WHERE user_id=?`;
  query = queryDatabase(sql, [refreshToken, userid]);
  console.log("refresh token stored successfully");
  //user.refreshToken = refreshToken; WRITE a query to store it in

  // Respond with tokens
  console.log("login successfully");
  res.json({ accessToken, refreshToken });
});

// Get user profile (protected route)
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'Profile data', user: req.user });
});

module.exports = router;
