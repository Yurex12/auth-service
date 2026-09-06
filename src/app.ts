import express from 'express';
import cookieParser from 'cookie-parser';

import { errorHandler, notFoundHandler } from './middleware/error-handler.js';

import authRoutes from './features/auth/auth.routes.js';
import { globalLimiter } from './middleware/rate-limit.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(globalLimiter);

app.get('/', (req, res) => res.send('API is running...'));
app.use('/auth', authRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
