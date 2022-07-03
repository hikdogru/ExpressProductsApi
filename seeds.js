const Product = require("./models/product");
const mongoose = require("mongoose");
const puppeteer = require('puppeteer')

mongoose.connect("mongodb://localhost:27017/shopApp", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo Connection Open!!!");
    }).catch((err) => {
        console.log("Error", err);
    });

const url = 'https://www.amazon.com.tr/gp/bestsellers/electronics';
(async () => {
    const browser = await puppeteer.launch();
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


    let elements = await page.$$("div.p13n-gridRow._cDEzb_grid-row_3Cywl #gridItemRoot");

    for (const e of elements) {
        let name = await e.$eval("div.zg-grid-general-faceout div > a:nth-child(2) > span > div", element => element.textContent);
        let price = await e.$eval("div:nth-child(4) > a > span > span:nth-child(1)", element => 
        element.textContent.replace("TL", "").replace(",", "."));
        let rating = await e.$eval(" div:nth-child(3) > div > a > i > span", element =>
            element.textContent.split(" ")[element.textContent.split(" ").length - 1]);
        let image = await e.$eval("div > div > a:nth-child(1) > div > img", element => element.getAttribute("src"));
        const product = new Product({
            name : name,
            price : parseFloat(price.trim()),
            rating : rating,
            images : image 
        });

        product.save()
        .then((p) => console.log(p))
        .catch((err) => console.log(err));
    }

    await browser.close();
})();

