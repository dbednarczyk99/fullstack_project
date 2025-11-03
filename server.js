// server.js

// Importting dependencies
const express = require('express');
const cors = require('cors');
const socket = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');

// Importing routes
const adsRoutes = require('./routes/ads.routes');
const authRoutes = require('./routes/auth.routes');

// App initialization
const app = express();
const PORT = process.env.PORT || 8000;

// Environment variables, database connection
dotenv.config();
mongoose.connect(process.env.MONGO_URI);

// Server and socket.io setup
const server = app.listen(PORT, () => { 
  console.log(`Server is running on port ${PORT}`);
});
const io = socket(server);
io.on('connection', (socket) => {
  console.log('New socket!');
});
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Express middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Session middleware
app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  }
}));


// API routes
app.use('/api', adsRoutes);
app.use('/auth', authRoutes);

// Frontend handling
app.use(express.static(path.join(__dirname, '/client/build')));
app.use(express.static(path.join(__dirname, '/public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});
app.use((req, res) => {
  res.status(404).send('404 not found...');
});

// Database handling
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to the database');
});
db.on('error', err => console.log('Error ' + err));