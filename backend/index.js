const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

// Load env vars
// Load env vars
dotenv.config();
console.log('JWT_SECRET Status:', process.env.JWT_SECRET ? 'Loaded' : 'MISSING');

// Connect to database
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'https://v10-five-xi.vercel.app',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:3000',

    'https://www.v10fitnesslab.in',
    'v10fitnesslab.in'
]


app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            console.log('Origin not allowed by CORS:', origin);
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/v10_profiles', express.static(path.join(__dirname, 'v10_profiles')));



// Rate Limiting - More permissive in development
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? (process.env.RATE_LIMIT_MAX || 100) : 10000, // 10000 requests in dev, 100 in production
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skip: (req) => process.env.NODE_ENV === 'development' && req.ip === '::1' || req.ip === '127.0.0.1', // Skip rate limiting for localhost in dev
});

app.use(limiter);

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
app.use('/api/admin/follow-ups', require('./routes/admin/followUpRoutes'));
app.use('/api/admin/expenses', require('./routes/admin/expenseRoutes'));
app.use('/api/admin/gym-details', require('./routes/admin/gymRoutes'));
app.use('/api/admin/stories', require('./routes/admin/storyRoutes'));
app.use('/api/admin/workout-library', require('./routes/admin/workoutLibraryRoutes'));

// User Routes
app.use('/api/user/auth', require('./routes/user/authRoutes'));
app.use('/api/user', require('./routes/user/userRoutes'));
app.use('/api/user/water-intake', require('./routes/user/waterIntakeRoutes'));

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development',
        db: {
            state: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
            code: mongoose.connection.readyState,
            host: mongoose.connection.host || 'none'
        },
        config: {
            jwt: process.env.JWT_SECRET ? 'configured' : 'missing',
            mongo_uri: process.env.MONGO_URI ? 'present' : 'using_fallback',
            port: process.env.PORT || 5000
        }
    });
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

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log('Allowed Origins:', allowedOrigins);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
    console.log(`Uncaught Exception: ${err.message}`);
});
