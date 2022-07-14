const Product = require("..//models/product");
const mongo = require("../models/mongo")
const seeds = require("../seeds");
const { amazonBaseUrl } = require("../common/constants");
const productDetailMethods = require("../common/productDetailMethods");
const puppeteer = require('puppeteer');

mongo.connectToMongo;

const scrapeProduct = async function (pageUrl, detailUrlSelector, productSelector, nameSelector, priceSelector, ratingSelector, imageSelector, productType) {

    try {
        const scrape = await seeds.scrape(pageUrl)
        let elements = await scrape.page.$$(productSelector);
        for (const e of elements) {
            let name = await e.$eval(nameSelector, element => element.textContent);
            let price = (await e.$(priceSelector)) !== null ? await e.$eval(priceSelector, element =>
                element.textContent.replace("TL", "").replace(",", ".")) : "0";
            let rating = await e.$eval(ratingSelector, element =>
                element.textContent.split(" ")[element.textContent.split(" ").length - 1]);
            let image = await e.$eval(imageSelector, element => element.getAttribute("src"));
            let detailLink = await e.$eval(detailUrlSelector, element => element.getAttribute("href"));
            const detailUrl = amazonBaseUrl + detailLink;
            let product = new Product({
                name: name,
                price: parseFloat(price.trim()),
                rating: rating,
                images: image,
                productType: productType,
                detailUrl: detailUrl
            });

            const productInDatabase = await Product.findOne({ name: name });
            if (productInDatabase === null) {
                product.save()
                    .then((p) => console.log("Added!", p))
                    .catch((err) => console.log(err));
            }
            else {
                if (product.price !== productInDatabase.price || JSON.stringify(product.images) !== JSON.stringify(productInDatabase.images)) {
                    product._id = productInDatabase._id;
                    await Product.findByIdAndUpdate(productInDatabase._id, product, { runValidators: true, new: true }, (err, productDocument) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log("Updated!", productDocument);
                    }).clone()
                }
            }
        }
        await scrape.browser.close();
        await productDetailMethods.scrapeProductDetail();
    } catch (err) {
        console.error(err);
    }

}


module.exports = {
    scrapeProduct: scrapeProduct
}
