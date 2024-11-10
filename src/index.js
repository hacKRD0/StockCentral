import express from 'express';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import cors from 'cors';

import authRoute from './routes/auth.route.js';
import portfolioRoute from './routes/portfolio.route.js';

const app = express();
const server = new createServer(app);
const port = process.env.PORT || 3000;
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Allow your frontend origin
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['*'], // Allowed headers from the client
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(bodyParser.urlencoded({ limit: '25mb', extended: true }));
app.use(bodyParser.json({ limit: '25mb' }));
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/auth', authRoute);
app.use('/portfolio', portfolioRoute);

app.use('*', (req, res) => {
  res.status(404).json({
    err: 'not found',
  });
});

server.listen(port, () => {
  console.log(`App ${process.env.APP_NAME} listening on port ${port}`);
});
