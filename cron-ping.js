const cron = require('node-cron');
const scrape = require("./common/scrape");
const schedule = () => {
    console.log("Hi");
    cron.schedule('30 17 * * *', function () {        
        console.log("Cron service is running...");
        scrape.getBestSellers();
        scrape.getElectronicProducts();
    });
};



module.exports = {
    schedule
};
