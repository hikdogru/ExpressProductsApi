const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
    ,
    price: {
        type: Number,
        required: true
    },
    productType : {
        type : String,
        enum : ["bestSeller", "electronic"]
    },
    description: String,
    images: [String],
    rating: String,
    detailUrl : String
    // categories: [String]
});



const Product = new mongoose.model("Product", productSchema);


module.exports = Product;
