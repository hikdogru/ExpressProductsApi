const cron = require('node-cron');
const scrape = require("./common/scrape");
const schedule = () => {    
    cron.schedule('* * * * *', function () {        
        console.log("Cron service is running...");
        // scrape.getBestSellers();
        // scrape.getElectronicProducts();
    });
};



module.exports = {
    schedule : schedule
};
