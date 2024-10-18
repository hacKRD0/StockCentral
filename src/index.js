import express from 'express';
import bodyParser from 'body-parser';
import { createServer } from 'http';

import portfolioRoute from './routes/portfolio.route.js';

const app = express();
const server = new createServer(app);
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ limit: '25mb', extended: true }));
app.use(bodyParser.json({ limit: '25mb' }));
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/portfolio', portfolioRoute);

app.use('*', (req, res) => {
  res.status(404).json({
    err: 'not found',
  });
});

server.listen(port, () => {
  console.log(`App ${process.env.APP_NAME} listening on port ${port}`);
});
