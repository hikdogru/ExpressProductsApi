if (process.env.NODE_ENV === "production") {
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


app.get("/", (req, res) => {
    res.send("Hello!");
})

app.get("/bestSellers", (req, res) => {
    Product.find({ productType: "bestSeller" }, (err, products) => {

        if (err) {
            console.log(err);
        }
        else {
            res.json(products);
        }
    });
})

app.get("/electronic", (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    Product.find({ productType: "electronic" }, (err, products) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json(products)
        }
    }).limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
})


const paginate = (model) => {
    console.log(model);
    return (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const result = {};

        if (endIndex < model.length) {
            result.next = {
                page: page + 1,
                limit: limit
            };
        }

        if (startIndex > 0) {
            result.previous = {
                page: page - 1,
                limit: limit
            };
        }

        result.results = model.slice(startIndex, endIndex);
        res.paginatedResult = result;
        next();
    }
}


app.listen(process.env.PORT || port, () => {
    console.log("App is listening!");
});
