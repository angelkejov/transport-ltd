require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Serve uploads directory as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve React static files from build directory (assume build is in monorepo root)
app.use(express.static(path.join(__dirname, '../build')));

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get('/', (req, res) => {
  res.send('API is running');
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/user');
const galleryRoutes = require('./routes/gallery');
const orderRoutes = require('./routes/order');
const adminRoutes = require('./routes/admin');
const ratingRoutes = require('./routes/rating');

app.use('/api/user', userRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/rating', ratingRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// 404 handler
// Use app.use for the catch-all route to handle all HTTP methods
app.use((req, res) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return res.status(404).json({ message: 'Route not found' });
  }
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
}); 