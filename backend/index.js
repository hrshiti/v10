const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');

// Load env vars
// Load env vars
dotenv.config();
console.log('JWT_SECRET Status:', process.env.JWT_SECRET ? 'Loaded' : 'MISSING');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// Admin Routes
app.use('/api/admin/auth', require('./routes/admin/authRoutes'));
app.use('/api/admin/dashboard', require('./routes/admin/dashboardRoutes'));
app.use('/api/admin/enquiries', require('./routes/admin/enquiryRoutes'));
app.use('/api/admin/members', require('./routes/admin/memberRoutes'));
app.use('/api/admin/packages', require('./routes/admin/packageRoutes'));
app.use('/api/admin/workouts', require('./routes/admin/workoutRoutes'));
app.use('/api/admin/sales', require('./routes/admin/saleRoutes'));
app.use('/api/admin/feedback', require('./routes/admin/feedbackRoutes'));
app.use('/api/admin/reports', require('./routes/admin/reportRoutes'));
app.use('/api/admin/employees', require('./routes/admin/employeeRoutes'));
app.use('/api/admin/diet-plans', require('./routes/admin/dietRoutes'));

// User Routes
app.use('/api/user/auth', require('./routes/user/authRoutes'));
app.use('/api/user', require('./routes/user/userRoutes'));

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
 
