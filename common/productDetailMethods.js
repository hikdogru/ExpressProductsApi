const ProductDetail = require("..//models/productDetail");
const Product = require("../models/product");
const { productDetailTitleSelector,
    productDetailImagesSelector,
    productDetailVendorSelector,
    productDetailFeaturesTableSelector,
    productDetailDescriptionSelector,
    productDetailMainSelector } = require("./constants");
const { Cluster } = require('puppeteer-cluster');


const scrapeProductDetail = async () => {
    try {
        const products = await Product.find();

        (async () => {
            const cluster = await Cluster.launch({
                concurrency: Cluster.CONCURRENCY_CONTEXT,
                maxConcurrency: 10,
                timeout: 100000,
                puppeteerOptions: {
                    args: ["--no-sandbox", "--disabled-setupid-sandbox"]
                }
            });
            cluster.on('taskerror', (err, data) => {
                console.log(`Error crawling ${data}: ${err.message}`);
            });
            await cluster.task(async ({ page, data: url }) => {
                await page.goto(url, {
                    waitUntil: "load",
                    timeout: 0
                });
                let element = await page.$(productDetailMainSelector);
                const product = await Product.findOne({ detailUrl: url })
                const name = await element.$eval(productDetailTitleSelector, element => element.textContent.trim());
                const vendor = (await element.$(productDetailVendorSelector)) !== null ? await element.$eval(productDetailVendorSelector, element => element.textContent.trim()) : ""
                const images = await element.$$eval(productDetailImagesSelector, element => element.map(e => e.getAttribute("src")));
                const description = (await element.$(productDetailDescriptionSelector)) !== null ? await element.$eval(productDetailDescriptionSelector, element => element.innerHTML.trim()) : ""
                const features = (await element.$(productDetailFeaturesTableSelector)) !== null ?
                    await element.$eval(productDetailFeaturesTableSelector, element => element.innerHTML.trim()) : "";
                let productDetail = new ProductDetail({
                    name: name,
                    vendor: vendor,
                    productId: product._id,
                    images: images,
                    description: description,
                    features: features
                });

                const productDetailInDatabase = await ProductDetail.findOne({ productId: product._id });
                if (productDetailInDatabase === null) {
                    productDetail.save()
                        .then((p) => console.log("Added!", p))
                        .catch((err) => console.log(err));
                }
                else {
                    if (productDetail.vendor !== productDetailInDatabase.vendor || JSON.stringify(productDetail.images) !== JSON.stringify(productDetailInDatabase.images)) {
                        productDetail._id = productDetailInDatabase._id;
                        await ProductDetail.findByIdAndUpdate(productDetailInDatabase._id, productDetail, { runValidators: true, new: true }, (err, productDetailDocument) => {
                            if (err) {
                                console.log(err);
                            }
                            console.log("Updated!", productDetailDocument);
                        }).clone()
                    }
                }
            });

            const urls = products.map(x => x.detailUrl);
            for (const url of urls) {

                await cluster.queue(url);
            }

            await cluster.idle();
            await cluster.close();
        })();



    } catch (err) {
        console.error(err);
    }


}

module.exports = {
    scrapeProductDetail: scrapeProductDetail
}