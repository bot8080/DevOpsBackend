const express = require('express');
const router = express.Router();
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

// GET a specific product by id
router.get('/products/:id', (req, res) => {
	Product.findById(req.params.id)
		.then(product => res.json(product))
		.catch(err => res.status(400).json('Error: ' + err));
});

// GET a specific field of a specific product by id
router.get('/products/:id/:field', (req, res) => {
	const { id, field } = req.params;

	// Validate the field
	if (!Product.schema.paths[field]) {
		return res.status(400).json({ msg: `Field '${field}' not found in Product schema` });
	}

	Product.findById(id)
		.then(product => {
			if (!product) {
				return res.status(404).json({ msg: 'Product not found' });
			}

			res.json({ [field]: product[field] });
		})
		.catch(err => res.status(400).json('Error: ' + err));
});

// GET an image by filename
router.get('/products/images/:filename', (req, res) => {
	console.log("HELLO");
	const filename = req.params.filename;
	const dir = path.resolve(__dirname, 'public/images');
		console.log(filename, dir);

	fs.access(path.join(dir, filename), fs.constants.F_OK, (err) => {
		if (err) {
			return res.status(404).json({ message: 'Image not found' });
		}

		res.sendFile(filename, { root: dir });
	});
});

// Apart from the documentation, you can also refer to the following code snippets for help:
// GET the image of a product by id
router.get('/products/:id/image', (req, res) => {
	const id = req.params.id;

	Product.findById(id, { Image: 1, _id: 0 })
		.then(product => {
			if (!product) {
				return res.status(404).json({ msg: 'Product not found' });
			}

			if (!product.Image) {
				return res.status(404).json({ msg: 'Image not found for this product' });
			}

			const imagePath = path.join(__dirname, 'public/images', product.Image); // Adjust 'public' to your images folder

			// Check if the image file exists
			if (fs.existsSync(imagePath)) {
				res.sendFile(imagePath);
			} else {
				res.status(404).send('Image file not found');
			}
		})
		.catch(err => {
			console.error(err); // Log the error
			res.status(500).send('Error fetching product image');
		});
});

// POST add a new product
router.post('/products', (req, res) => {
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

// PUT update a specific product
router.put('/products/:id', (req, res) => {
	Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then(product => res.json(product)) // Send the updated product as JSON
		.catch(err => res.status(500).json({ msg: 'Unable to edit product' }));
});

// DELETE a product
router.delete('/products/:id', (req, res) => {
	Product.deleteOne({ _id: req.params.id })
		.then(() => res.json({ msg: 'Product deleted successfully' }))
		.catch(err => res.status(500).json({ msg: 'Unable to delete product' }));
});

module.exports = router;