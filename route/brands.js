// routes/brands.js
const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

router.get('/', async (req, res) => {
  const brands = await prisma.productBrand.findMany({
    include: { productCatalogs: true },
  });
  res.json(brands);
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const brand = await prisma.productBrand.findUnique({
    where: { id },
    include: { productCatalogs: true },
  });
  if (!brand) return res.status(404).json({ error: 'Brand not found' });
  res.json(brand);
});

// POST create brand
router.post('/', async (req, res) => {
  const { brand_name } = req.body;
  const brand = await prisma.productBrand.create({
    data: { brand_name },
  });
  res.status(201).json(brand);
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { brand_name } = req.body;
  try {
    const updated = await prisma.productBrand.update({
      where: { id },
      data: { brand_name },
    });
    res.json(updated);
  } catch (err) {
    res.status(404).json({ error: 'Brand not found' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.productBrand.delete({ where: { id } });
    res.json({ message: 'Brand deleted' });
  } catch {
    res.status(404).json({ error: 'Brand not found' });
  }
});

module.exports = router;
