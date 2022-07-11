const cron = require('node-cron');
const scrape = require("./common/scrape");
const schedule = () => {    
    cron.schedule("0 0 0 * * *", function () {                
        scrape.getBestSellers();
        scrape.getElectronicProducts();
    });
};



module.exports = {
    schedule : schedule
};
