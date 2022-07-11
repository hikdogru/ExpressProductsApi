const Product = require("./models/product");
const puppeteer = require('puppeteer')
const mongo = require("./models/mongo")

mongo.connectToMongo;

const scrape = function (url, productSelector, nameSelector, priceSelector, ratingSelector, imageSelector, productType) {

    (async () => {
        const browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disabled-setupid-sandbox"] 
        });
        const page = await browser.newPage();
        page.on('console', async msg => {
            const args = msg.args();
            const vals = [];
            for (let i = 0; i < args.length; i++) {
                vals.push(await args[i].jsonValue());
            }
        });
        await page.goto(url);
        await page.evaluate(() => {

            const wait = (duration) => {
                console.log('waiting', duration);
                return new Promise(resolve => setTimeout(resolve, duration));
            };

            (async () => {

                window.atBottom = false;
                const scroller = document.documentElement;  // usually what you want to scroll, but not always
                let lastPosition = -1;
                while (!window.atBottom) {
                    scroller.scrollTop += 750;
                    // scrolling down all at once has pitfalls on some sites: scroller.scrollTop = scroller.scrollHeight;
                    await wait(400);
                    const currentPosition = scroller.scrollTop;
                    if (currentPosition > lastPosition) {
                        console.log('currentPosition', currentPosition);
                        lastPosition = currentPosition;
                    }
                    else {
                        window.atBottom = true;
                    }
                }
                console.log('Done!');

            })();

        });

        await page.waitForFunction('window.atBottom == true', {
            timeout: 900000,
            polling: 1000 // poll for finish every second
        });
        let elements = await page.$$(productSelector);
        console.log(productSelector);
        for (const e of elements) {

            let name = await e.$eval(nameSelector, element => element.textContent);
            let price = await e.$eval(priceSelector, element =>
                element.textContent.replace("TL", "").replace(",", "."));
            let rating = await e.$eval(ratingSelector, element =>
                element.textContent.split(" ")[element.textContent.split(" ").length - 1]);
            let image = await e.$eval(imageSelector, element => element.getAttribute("src"));
            const product = new Product({
                name: name,
                price: parseFloat(price.trim()),
                rating: rating,
                images: image,
                productType : productType
            });

            product.save()
                .then((p) => console.log(p))
                .catch((err) => console.log(err));
        }
        await browser.close();
    })();
}


module.exports = {
    scrape: scrape
} 