const puppeteer = require('puppeteer');
const productMethods = require("./common/productMethods");
const scrape = async (url) => {
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
    return { page : page , browser: browser };    
};






module.exports = {
    scrape : scrape
} 
