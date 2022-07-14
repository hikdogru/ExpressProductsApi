const cron = require('node-cron');
const scrape = require("./common/scrape");
const schedule = async () => {
    cron.schedule("0 0 15 * * *", function () {
        console.info("Cron is running!!!");
        await scrape.getBestSellers();
        await scrape.getElectronicProducts();
    });
};



module.exports = {
    schedule: schedule
};
