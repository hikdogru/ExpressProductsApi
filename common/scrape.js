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
    electronicProductImageSelector,
    bestSellerDetailUrlSelector,
    electronicDetailUrlSelector } = require("./constants");
const productMethods = require("../common/productMethods");



const getBestSellers = async () => {
    await productMethods.scrapeProduct(bestSellerUrl, bestSellerDetailUrlSelector,
        bestSellerProductsSelector,
        bestSellerProductNameSelector, bestSellerProductPriceSelector,
        bestSellerProductRatingSelector, bestSellerProductImageSelector, "bestSeller")
};


const getElectronicProducts = () => {
    productMethods.scrapeProduct(electronicUrl, electronicDetailUrlSelector,
        electronicProductsSelector,
        electronicProductNameSelector, electronicProductPriceSelector,
        electronicProductRatingSelector, electronicProductImageSelector, "electronic")
}



module.exports = {
    getBestSellers,
    getElectronicProducts
}