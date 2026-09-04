import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { closeDriver } from './config/database.js';

// Import routes
import onboardingRouter from './routes/onboarding.js';
import graphRouter from './routes/graph.js';
import importRouter from './routes/import.js';
import matchRouter from './routes/match.js';

// Load env
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/onboarding', onboardingRouter);
app.use('/api/graph', graphRouter);
app.use('/api/import', importRouter);
app.use('/api/match', matchRouter);

// Basic health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something broke!' });
});

const server = app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down gracefully...');
  server.close(async () => {
    console.log('HTTP server closed.');
    await closeDriver();
    console.log('Database driver closed.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
