const cron = require('node-cron');
const scrape = require("./common/scrape");
const schedule =  () => {
    cron.schedule("0 20 15 * * *", function () {
        console.info("Cron is running!!!");
         scrape.getBestSellers();
         scrape.getElectronicProducts();
    });
};



module.exports = {
    schedule: schedule
};
