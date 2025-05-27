// routes/products.js
const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

router.get('/', async (req, res) => {
  const products = await prisma.productCatalog.findMany({
    include: { brand: true },
  });
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const product = await prisma.productCatalog.findUnique({
    where: { id },
    include: { brand: true },
  });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

router.post('/', async (req, res) => {
  const { product_name, type, brand_id } = req.body;
  const product = await prisma.productCatalog.create({
    data: {
      product_name,
      type,
      brand_id,
    },
  });
  res.status(201).json(product);
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { product_name, type, brand_id } = req.body;
  try {
    const updated = await prisma.productCatalog.update({
      where: { id },
      data: { product_name, type, brand_id },
    });
    res.json(updated);
  } catch {
    res.status(404).json({ error: 'Product not found' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.productCatalog.delete({ where: { id } });
    res.json({ message: 'Product deleted' });
  } catch {
    res.status(404).json({ error: 'Product not found' });
  }
});

module.exports = router;
