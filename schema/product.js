const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    Colour: {
        type: String,
        required: true
    },
    Manufacturer: {
        type: String,
        required: true
    },
    StartingDateAvailable: {
        type: Date,
        required: true
    },
    EndingDateAvailable: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return this.StartingDateAvailable && value > this.StartingDateAvailable;
            },
            message: props => `Ending date (${props.value}) must be later than the starting date (${props.instance.StartingDateAvailable})`
        }
    },
    Image: {
        type: String,
        required: false
    },
    Description: {
        type: String,
        required: false
    },
    // Additional fields
    ProductId: {
        type: String,
        required: false
    },
    PremiumBrand: {
        type: Boolean,
        required: false
    },
    SalePrice: {
        type: Number,
        required: false
    },
    ProducedBy: {
        type: String,
        required: false
    }
});

// Convert schema into a model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;