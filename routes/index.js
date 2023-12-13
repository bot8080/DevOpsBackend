const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../schema/product');

// GET all products
router.get('/products', (req, res) => {
  Product.find()
    .then(products => {
      const productsData = products.map(p => p.toObject());
      res.json(productsData); 
    })
    .catch(err => res.status(404).json({ msg: 'No product found' }));
});

// GET method to return the IDs of all products
router.get('/products/identifiers', (req, res) => {
  Product.find({}, '_id')
    .then(products => {
      const productIds = products.map(product => product._id);
      res.json({ productIds });
    })
    .catch(err => res.status(500).json({ msg: 'Error fetching product IDs', error: err.message }));
});

router.get('/products/:images/:field', (req, res) => {
  const { id, field } = req.params;

  // Validate the field
  if (!Product.schema.paths[field]) {
    return res.status(400).json({ msg: `Field '${field}' not found in Product schema` });
  }

  Product.findById(id, { [field]: 1, _id: 0 })
    .then(product => {
      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }
      res.json({ [field]: product[field] });
    })
    .catch(err => res.status(500).json({ msg: 'Error fetching product data', error: err.message }));
});

// GET method to return the IDs of all products
router.get('/products/identifiers', (req, res) => {
  Product.find({}, '_id')
    .then(products => {
      const productIds = products.map(product => product._id);
      res.json({ productIds });
    })
    .catch(err => res.status(500).json({ msg: 'Error fetching product IDs', error: err.message }));
});

router.get('/product/images/:id', (req, res) => {
  const id = req.params.id;

  Product.findById(id, { Image: 1, _id: 0 })
    .then(product => {
      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }
      const imagePath = path.join(__dirname, 'public/images', product.Image); // Adjust 'public' to your images folder

      // Check if the image file exists
      if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
      } else {
        res.status(404).send('Image file not found');
      }
    })
    .catch(err => res.status(500).send('Error fetching product image'))
  
});

// POST add a new product
router.post('/add-product', (req, res) => {
  const newProduct = new Product({
    Name: req.body.Name,
    Price: req.body.Price,
    Colour: req.body.Colour,
    Manufacturer: req.body.Manufacturer,
    StartingDateAvailable: req.body.StartingDateAvailable,
    EndingDateAvailable: req.body.EndingDateAvailable,
    Image: req.body.Image,
    Description: req.body.Description
  });

  newProduct.save()
    .then(product => res.json(product)) 
    .catch(err => res.status(500).json({ msg: 'Unable to add product', error: err.message }));
});

// GET a specific product by ID
router.get('/edit-product/:id', (req, res) => {
  Product.findById(req.params.id)
    .then(product => {
      res.json(product); 
    })
    .catch(err => res.status(404).json({ msg: 'No product found' }));
});

// PUT update a specific product
router.put('/edit-product/:id', (req, res) => {
  Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(product => res.json(product)) // Send the updated product as JSON
    .catch(err => res.status(500).json({ msg: 'Unable to edit product' }));
});

// DELETE a product
router.delete('/delete-product/:id', (req, res) => {
  Product.deleteOne({ _id: req.params.id })
    .then(() => res.json({ msg: 'Product deleted successfully' }))
    .catch(err => res.status(500).json({ msg: 'Unable to delete product' }));
});

module.exports = router;
