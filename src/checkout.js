class Checkout {
    basket = [];

    constructor(pricingRules) {
        this.pricingRules = pricingRules;
    }

    scan(sku) {
        this.basket.push({ sku, price: this.pricingRules.priceForItem(sku) });
    }

    total() {
        this.pricingRules.applySpecials(this.basket);

        return this.basket.reduce((total, item) => total + item.price, 0);
    }
}

module.exports = Checkout;
