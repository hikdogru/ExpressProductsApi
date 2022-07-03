if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}


const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const port = 2000;
const Product = require("./models/product");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set('json spaces', 2)


const remoteMongoConnectionString = process.env.DB_URL || "mongodb://localhost:27017/shopApp";
mongoose.connect(remoteMongoConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo Connection Open!!!");
    }).catch((err) => {
        console.log("Error", err);
    });


app.get("/bestSellers", (req, res) => {
    const products = Product.find({}, (err, products) => {

        if (err) {
            console.log(err);
        }
        else {
            res.header("Content-Type", 'application/json');
            res.json(products);
        }

    });

})



app.listen(process.env.PORT || port, () => {
    console.log("App is listening!");
});
