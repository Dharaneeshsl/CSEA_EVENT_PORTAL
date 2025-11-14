import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import round3Routes from './routes/round3Routes.js';
import { verifyToken, onlyFirstYears, onlySecondYears } from './middleware/authMiddleware.js';


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 5000;

connectDB();

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/v1/round3', round3Routes);


app.get('/api/poratal/year1', verifyToken, onlyFirstYears, (req, res) => {
  res.status(200).json({ message: 'Welcome, First Year!', user: req.user });
});

app.get('/api/portal/year2', verifyToken, onlySecondYears, (req, res) => {
  res.status(200).json({ message: 'Welcome, Second Year!', user: req.user });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
  
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
