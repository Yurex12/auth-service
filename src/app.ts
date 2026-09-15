import express from 'express';
import cookieParser from 'cookie-parser';
import { pinoHttp } from 'pino-http';

import { logger } from './utils/logger.js';

import { errorHandler, notFoundHandler } from './middleware/error-handler.js';

import authRoutes from './features/auth/auth.routes.js';
import postRoutes from './features/post/post.routes.js';
import userRoutes from './features/user/user.routes.js';
import { globalLimiter } from './middleware/rate-limit.js';

const app = express();

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
