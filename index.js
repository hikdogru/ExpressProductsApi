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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const remoteMongoConnectionString = process.env.DB_URL || "mongodb://localhost:27017/shopApp";
mongoose.connect(remoteMongoConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo Connection Open!!!");
    }).catch((err) => {
        console.log("Error", err);
    });


app.get("/", (req, res) => {
    res.redirect("/api-docs");
});

app.get("/products/bestSellers", async (req, res) => {
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
});

app.get("/products/electronic", async (req, res) => {
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
});

app.get("/products/:id", async (req, res) => {
    const { id } = req.params;
    const products = await Product.findById(id);
    if (products === null)
        res.status(404).send("<h3 style='color:red'>Product not found!</h3>");
    res.send(products);
});

app.get("/allproducts", async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const productCount = await Product.find().count().exec();
    const totalPages = Math.ceil(productCount / limit);
    const product = await Product.find({}, (err, products) => {
        if (err) {
            res.status(400).send(err);
        }

        const uniqProducts = (Array.from(product)).filter((value, index, array) => {
            return array.indexOf(value) === index
        });

        res.json({
            data: uniqProducts,
            paging: {
                total: productCount,
                pageCount: totalPages,
                page: parseInt(page)
            }
        });
    }).limit(limit * 1)
        .skip((page - 1) * limit)
        .clone();;
});

app.get("/products", async (req, res) => {
    const { q } = req.query;
    const query = { name: new RegExp(q, 'i') };
    const product = await Product.find(query);
    res.json((Array.from(product)).filter((value, index, array) => {
        return array.indexOf(value) === index
    }));
});


app.post("/products", async (req, res) => {
    await Product.create(req.body, (err, doc) => {
        if (err) {
            res.status(400).send(err);
        }
        res.status(200).send(doc);
    });
});

app.put("/products/update/:id", async (req, res) => {
    const { id } = req.params;
    let product = new Product(req.body);
    product._id = id;
    await product.validate().then(data => {

        Product.findByIdAndUpdate(id, product, { runValidators: true, new: true }, (err, product) => {
            if (err) {
                res.status(400).send(err);
            }
            res.status(200).send(product);
        }).clone()

    }).catch(err => {
        res.status(400).send(err)
    });
});

app.delete("/products/delete/:id", async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (product === null) {
        res.status(404).send("Product not found!")
    }

    else {

        await Product.findByIdAndDelete(id, (err, productDoc) => {
            if (err) {
                res.status(400).send(err);
            }
            res.status(200).send("Product is deleted successfuly!");
        }).clone();
    }
});


app.listen(process.env.PORT || port, () => {
    console.log("App is listening!");
});
