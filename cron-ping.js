const cron = require('node-cron');
const scrape = require("./common/scrape");
const schedule = () => {    
    cron.schedule('* * *', function () {                
        scrape.getBestSellers();
        scrape.getElectronicProducts();
    });
};



module.exports = {
    schedule : schedule
};
