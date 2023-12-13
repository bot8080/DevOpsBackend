
const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
    lastName: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    address1: {
        type: String,
        required: true,
    },
    address2: String,
    city: {
        type: String,
        required: true,
    },
    postalCode: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    productNotes: {
        type: String
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;