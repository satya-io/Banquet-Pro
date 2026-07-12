import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeCosmosDB } from './config/cosmos.js';
import authRoutes from './routes/auth.js';
import enquiriesRoutes from './routes/enquiries.js';
import bookingsRoutes from './routes/bookings.js';
import menuRoutes from './routes/menu.js';
import venuesRoutes from './routes/venues.js';
import settingsRoutes from './routes/settings.js';
import tenantsRoutes from './routes/tenants.js';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/venues', venuesRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/tenants', tenantsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Banquet Pro API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'An unexpected error occurred.',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
async function startServer() {
  try {
    await initializeCosmosDB();
    
    app.listen(PORT, () => {
      console.log('');
      console.log('╔══════════════════════════════════════════════╗');
      console.log('║        🏛️  Banquet Pro API Server            ║');
      console.log('╠══════════════════════════════════════════════╣');
      console.log(`║  🌐 Server:   http://localhost:${PORT}          ║`);
      console.log(`║  📡 API:      http://localhost:${PORT}/api      ║`);
      console.log(`║  💊 Health:   http://localhost:${PORT}/api/health║`);
      console.log('║  📋 Version:  1.0.0                          ║');
      console.log('╚══════════════════════════════════════════════╝');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
