const express = require('express');
const path = require('path');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const webRoutes = require('./routes/web');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api', apiRoutes);
app.use('/', webRoutes);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;