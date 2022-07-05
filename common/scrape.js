const { bestSellerUrl,
    bestSellerProductsSelector,
    bestSellerProductNameSelector,
    bestSellerProductPriceSelector,
    bestSellerProductRatingSelector,
    bestSellerProductImageSelector,
    electronicUrl,
    electronicProductsSelector,
    electronicProductNameSelector,
    electronicProductPriceSelector,
    electronicProductRatingSelector,
    electronicProductImageSelector } = require("./constants");
const scrape = require("../seeds");


const getBestSellers = () => {
    scrape.scrape(bestSellerUrl, bestSellerProductsSelector,
        bestSellerProductNameSelector, bestSellerProductPriceSelector,
        bestSellerProductRatingSelector, bestSellerProductImageSelector, "bestSeller")
};


const getElectronicProducts = ()=> {
    scrape.scrape(electronicUrl, electronicProductsSelector,
        electronicProductNameSelector, electronicProductPriceSelector,
        electronicProductRatingSelector, electronicProductImageSelector, "electronic")
}

getBestSellers();
getElectronicProducts();