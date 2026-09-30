import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { pinoHttp } from 'pino-http';

import swaggerUi from 'swagger-ui-express';

import { logger } from './utils/logger.js';

import { errorHandler, notFoundHandler } from './middleware/error-handler.js';

import authRoutes from './features/auth/auth.routes.js';
import postRoutes from './features/post/post.routes.js';
import userRoutes from './features/user/user.routes.js';
import { globalLimiter } from './middleware/rate-limit.js';
import { swaggerSpec } from './docs/swagger.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use(
  pinoHttp({
    logger,
    redact: [
      'req.headers.cookie',
      'req.headers.authorization',
      'res.headers["set-cookie"]',
    ],
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(globalLimiter);

app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
