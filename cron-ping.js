const cron = require('node-cron');
const scrape = require("./common/scrape");
const schedule = () => {
    cron.schedule('55 17 * * *', function () {        
        scrape.getBestSellers();
        scrape.getElectronicProducts();
    });
};



module.exports = {
    schedule
};
