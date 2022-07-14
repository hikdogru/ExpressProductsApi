
const amazonBaseUrl = "https://www.amazon.com.tr";
const bestSellerUrl = "https://www.amazon.com.tr/gp/bestsellers/electronics";
const bestSellerProductsSelector = "div.p13n-gridRow._cDEzb_grid-row_3Cywl #gridItemRoot";
const bestSellerProductNameSelector = "div.zg-grid-general-faceout div > a:nth-child(2) > span > div";
const bestSellerProductPriceSelector = "div:nth-child(4) > a > span > span:nth-child(1)";
const bestSellerProductRatingSelector = "div:nth-child(3) > div > a > i > span";
const bestSellerProductImageSelector = "div > div > a:nth-child(1) > div > img";

const bestSellerDetailUrlSelector = "div[class*=zg-grid-general-faceout] > div > a:nth-child(1)";
const electronicDetailUrlSelector = "div[class*=s-product-image-container] span a";
const productDetailTitleSelector = "#productTitle";
const productDetailImagesSelector = "li[class*='imageThumbnail '] span[class*='a-button-text'] img";
const productDetailVendorSelector = "#merchant-info > span:nth-child(1)";
const productDetailFeaturesTableSelector = "#productOverview_feature_div > div table";
const productDetailDescriptionSelector = "#feature-bullets > ul";
const productDetailMainSelector = "#dp-container";


const electronicUrl = `https://www.amazon.com.tr/s?i=electronics&bbn=13709879031&rh=n%3A13709879031%2Cp_72%3A13136589031%2Cp_6%3AA1UNQM1SR2CHM&dc&ds=v1%3AMzEJA0PFN7hFmtWpcdrU5kP5AAhFO0Mdw40C9FayXms&content-id=amzn1.sym.986ac0e9-e20e-4f69-a35c-f6f28e18794d&pd_rd_r=4069a89c-bb6d-40c5-a0f6-27c3adbb4831&pd_rd_w=QQoPq&pd_rd_wg=nBbRf&pf_rd_p=986ac0e9-e20e-4f69-a35c-f6f28e18794d&pf_rd_r=HQ3FP26RHC6Y54SC8MS7&qid=1656959619&rnid=15358539031&ref=sr_nr_p_6_4`;
const electronicProductsSelector = "div > div > div > div.a-section.a-spacing-base";
const electronicProductNameSelector = "h2 > a > span";
const electronicProductPriceSelector = "div[class*='a-row a-size-base a-color-base'] > a > span > span:nth-child(2)";
const electronicProductRatingSelector = "a[class*='a-popover-trigger a-declarative'] > i > span[class*='a-icon-alt']";
const electronicProductImageSelector = "span > a > div > img";



module.exports = {
    amazonBaseUrl,
    bestSellerUrl,
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
    productDetailTitleSelector,
    productDetailImagesSelector,
    productDetailVendorSelector,
    productDetailFeaturesTableSelector,
    productDetailDescriptionSelector,
    productDetailMainSelector,
    electronicDetailUrlSelector
}

