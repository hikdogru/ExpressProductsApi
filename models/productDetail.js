const mongoose = require("mongoose");


const productDetailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    images: {
        type: [String]
    },

    vendor: String,
    description: String,
    features: [{
        name: {
            type: String
        },
        value: {
            type: String
        }
    }],
    productId: String
})



const ProductDetail = new mongoose.model("ProductDetail", productDetailSchema);



module.exports = ProductDetail;