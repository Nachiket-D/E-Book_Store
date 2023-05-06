const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/users', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
  });

app.post('/register', async (req, res) => {
  let user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  user = await user.save();
  res.send(user);
});

app.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user) {
    return res.status(400).send('Invalid username or password.');
  }

  if (user.password !== req.body.password) {
    return res.status(400).send('Invalid username or password.');
  }

  res.send('Logged in successfully.');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
