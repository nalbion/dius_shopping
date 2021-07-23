class PricingRules {
    constructor(catalogue, specials) {
        this.prices = catalogue.reduce((cat, item) => {
            cat[item.sku] = item.price;
            return cat;
        }, {});

        this.specials = specials;
    }

    priceForItem(sku) {
        return this.prices[sku];
    }
    
    priceForItems(sku, quantity) {
        return this.prices[sku] * quantity;
    }

    /**
     * @param {Array<{ sku: string, price: number }>} basket
     */
    applySpecials(basket) {
        for (const special of this.specials) {
            switch (special.type) {
                case 'buy x get y':
                    this.applyBuyXGetY(basket, special.sku, special.threshold, special.value);
                    break;
                case 'more than x':
                    this.applyMoreThanX(basket, special.sku, special.threshold, special.value);
                    break;
                case 'bundle':
                    this.applyBundle(basket, special.sku, special.threshold, special.value, special.reference);
                    break;
            }
        }
    }

    applyBuyXGetY(basket, sku, x, y) {
        let count = 0;
        let discounts = 0;
        
        for (const item of basket) {
            if (item.sku != sku || item.special) {
                continue;
            }
            
            if (discounts) {
                item.price = 0;
                item.special = true;  // TODO: considering labelling with `special.name` on invoice
                discounts--;
            } else if (++count == x) {
                discounts = y;
            }
        }
    }
    
    applyMoreThanX(basket, sku, threshold, price) {
        let count = basket.reduce((c, item) => (item.price > price && item.sku === sku) ? c + 1 : c, 0);

        if (count > threshold) {
            for (const item of basket) {
                if (item.sku != sku || item.price < price) {
                    continue;
                }

                item.price = price;
                item.special = true;  // TODO: as per above comment, and then refactor into private method
            }
        }
    }
    
    applyBundle(basket, sku, threshold, value, reference) {
        let containsSku = basket.find(item => item.sku == sku);

        if (containsSku) {
            for (const item of basket) {
                if (item.sku == reference && item.price > value) {
                    item.price = value;
                    item.special = true;
                    break;
                }
            }
        }
    }
}

module.exports = PricingRules;
