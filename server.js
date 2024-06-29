const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

const hashedPassword = bcrypt.hashSync('admin', 10);
const users = [
  { id: 1, username: 'admin', password: hashedPassword }
];

const allowedIP = '178.134.63.32';

// Middleware to check IP address
const checkIP = (req, res, next) => {
  const clientIP = req.ip;
  if (clientIP === allowedIP) {
    next();
  } else {
    res.status(404).send('Not Found');
  }
};

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Login endpoint with IP check
app.post('/login', checkIP, (req, res) => {
  const { username, password } = req.body;
  console.log('Login request received:', username, password);

  const user = users.find(u => u.username === username);

  if (!user) {
    console.log('User not found:', username);
    return res.status(404).json({ error: 'User not found' });
  }

  // Compare password
  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      console.log('Authentication failed:', username);
      return res.status(401).json({ error: 'Authentication failed' });
    }

    console.log('Authentication successful for:', username);
    res.json({ success: true });
  });
});

// Example protected admin route (optional)
app.get('/admin', (req, res) => {
  res.send('Welcome to the admin page.');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));