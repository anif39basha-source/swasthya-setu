const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables FIRST
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Load database configuration
// Do NOT call connectDB() here.
require('./src/config/database');

// Middleware
app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    }
});

app.use('/api/', limiter);

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'SwasthyaSetu API is running',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            facilities: '/api/facilities',
            appointments: '/api/appointments',
            referrals: '/api/referrals',
            medicines: '/api/medicines',
            doctors: '/api/doctors',
            notifications: '/api/notifications',
            healthWorker: '/api/health-worker',
            admin: '/api/admin'
        }
    });
});

// Import routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const facilityRoutes = require('./src/routes/facilities');
const appointmentRoutes = require('./src/routes/appointments');
const referralRoutes = require('./src/routes/referrals');
const medicineRoutes = require('./src/routes/medicines');
const doctorRoutes = require('./src/routes/doctors');
const notificationRoutes = require('./src/routes/notifications');
const healthWorkerRoutes = require('./src/routes/healthWorker');
const adminRoutes = require('./src/routes/admin');
const aiRoutes = require('./src/routes/ai');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/health-worker', healthWorkerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        message: 'Server is healthy'
    });
});

// 404 Handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack
        })
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📖 API docs: http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down gracefully...');

    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

module.exports = app;