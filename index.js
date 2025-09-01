const express = require('express');
const cors = require('cors');
const logger = require('./middlewares/logger');
const { notFound, errorHandler } = require('./middlewares/errors');
require('dotenv').config();

const app = express();

app.use(logger);
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
const recipesRouter = require('./routes/recipes');
app.use('/api/recipes', recipesRouter);

// 404 + error format
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Recipes API listening on http://localhost:${PORT}`);
});
