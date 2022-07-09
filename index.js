if (process.env.NODE_ENV === "production") {
    require("dotenv").config();
}


const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const port = 2000;
const Product = require("./models/product");
const swaggerUi = require("swagger-ui-express"),
    swaggerDocument = require("./swagger.json");
const cors = require('cors');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set('json spaces', 2)


app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

app.use(cors({
    origin: "*"
}));

const remoteMongoConnectionString = process.env.DB_URL || "mongodb://localhost:27017/shopApp";
mongoose.connect(remoteMongoConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo Connection Open!!!");
    }).catch((err) => {
        console.log("Error", err);
    });


app.get("/", (req, res) => {
    res.redirect("/api-docs");
})

app.get("/bestSellers", async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const productCount = await Product.find({ productType: "bestSeller" }).count().exec();
    const totalPages = Math.ceil(productCount / limit);
    Product.find({ productType: "bestSeller" }, (err, products) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json({
                data: products,
                paging: {
                    total: productCount,
                    pageCount: totalPages,
                    page: parseInt(page)
                }
            });
        }
    }).limit(limit * 1)
        .skip((page - 1) * limit)
        .clone();;
})

app.get("/electronic", async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const productCount = await Product.find({ productType: "electronic" }).count().exec();
    const totalPages = Math.ceil(productCount / limit);
    Product.find({ productType: "electronic" }, (err, products) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json({
                data: products,
                paging: {
                    total: productCount,
                    pageCount: totalPages,
                    page: parseInt(page)
                }
            });
        }
    }).limit(limit * 1)
        .skip((page - 1) * limit)
        .clone();
})

app.get("/search", async (req, res) => {
    const { q } = req.query;
    const query = { name: new RegExp(q, 'i') };
    const product = await Product.find(query).exec();
    res.json((Array.from(product)).filter((value, index, array) => {
        return array.indexOf(value) === index
    }));
})


app.listen(process.env.PORT || port, () => {
    console.log("App is listening!");
});
