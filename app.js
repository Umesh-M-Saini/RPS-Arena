const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { setAuthState } = require('./middleware/auth');
const pagesRouter = require('./routes/pages');
const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api');

require('dotenv').config();

const app = express();

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
  })
  .catch((err) => {
    console.log('❌ MongoDB Error:', err);
  });

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(setAuthState(process.env.JWT_SECRET || 'change-me'));
app.use(helmet({
    contentSecurityPolicy: false, // Disable for easier local testing with external icons/scripts if needed
}));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/auth', authLimiter);

// Routes
app.use('/', pagesRouter);
app.use('/auth', authRouter);
app.use('/api', apiRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).render('landing', {
      isAuthenticated: res.locals.isAuthenticated
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('landing', {
      isAuthenticated: res.locals.isAuthenticated
  });
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
