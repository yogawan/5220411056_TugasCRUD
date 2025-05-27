// index.js
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

const brandRoutes = require('./routes/brands');
const productRoutes = require('./routes/products');

app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
