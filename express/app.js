import express from 'express';
const app = express();
app.listen(3000, () => console.log('Server is running on port 3000'));

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import routes from './routes/index.js';
app.use('/api/v1', routes);
