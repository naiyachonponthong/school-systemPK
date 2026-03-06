const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const sequelize = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const configRoutes = require('./routes/config');
const dashboardRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/users');
const portfolioRoutes = require('./routes/portfolio');
const meetingRoutes = require('./routes/meetings');
const dutyRoutes = require('./routes/duties');
const auditRoutes = require('./routes/audit');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3000;

// Security
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/config', configRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/duties', dutyRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/upload', uploadRoutes);

// Serve frontend for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handler
app.use(errorHandler);

// Database sync & start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Sync all models (create tables if not exist)
    await sequelize.sync({ alter: false });
    console.log('Database tables synced.');

    // Seed default data
    try {
      const { seedDefaultData } = require('./seeders/001-default-data');
      await seedDefaultData();
    } catch (seedError) {
      console.log('Seed skipped:', seedError.message);
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer();

module.exports = app;
