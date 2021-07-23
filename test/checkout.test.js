const Checkout = require('../src/checkout');
const PricingRules = require('../src/pricing-rules');

describe('Checkout', () => {
    const catalogue = [
        { sku: 'ipd', name: 'Super iPad', price: 549.99 },
        { sku: 'mbp', name: 'MacBook Pro', price: 1399.99 },    // Note: Seems like a good price, should probably grab one
        { sku: 'atv', name: 'Apple TV', price: 109.50 },
        { sku: 'vga', name: 'VGA adapter', price: 30.00 },
    ];

    test('regular price when no specials', () => {
        const specials = [];
        const pricingRules = new PricingRules(catalogue, specials);
        
        let co = new Checkout(pricingRules);
        co.scan('ipd');
        expect(co.total()).toEqual(549.99);

        co = new Checkout(pricingRules);
        co.scan('mbp');
        expect(co.total()).toEqual(1399.99);

        co = new Checkout(pricingRules);
        co.scan('atv');
        expect(co.total()).toEqual(109.50);
        co.scan('atv');
        co.scan('atv');
        expect(co.total()).toEqual(328.50);

        co = new Checkout(pricingRules);
        co.scan('vga');
        expect(co.total()).toEqual(30.00);
    });
    
    test('3 for 2 Apple TVs', () => {
        const specials = [
            { sku: 'atv', type: 'buy x get y', threshold: 2, value: 1 },
            { sku: 'ipd', type: 'more than x', threshold: 4, value: 499.99 },
            { sku: 'mbp', type: 'bundle', threshold: 1, value: 0, reference: 'vga' },
        ];
        const pricingRules = new PricingRules(catalogue, specials);
        
        co = new Checkout(pricingRules);
        co.scan('atv');
        co.scan('atv');
        co.scan('atv'); // free
        co.scan('vga');
        expect(co.total()).toEqual(249.00);

        co = new Checkout(pricingRules);
        co.scan('atv');
        co.scan('atv');
        co.scan('atv'); // free
        co.scan('atv');
        expect(co.total()).toEqual(328.50);
    });

    test('bulk discount for more than 4 Super iPads', () => {
        const specials = [
            { sku: 'atv', type: 'buy x get y', threshold: 2, value: 1 },
            { sku: 'ipd', type: 'more than x', threshold: 4, value: 499.99 },
            { sku: 'mbp', type: 'bundle', threshold: 1, value: 0, reference: 'vga' },
        ];
        const pricingRules = new PricingRules(catalogue, specials);
        
        co = new Checkout(pricingRules);
        co.scan('atv');
        co.scan('ipd');
        co.scan('ipd');
        co.scan('atv');
        co.scan('ipd');
        co.scan('ipd');
        co.scan('ipd');
        expect(co.total()).toEqual(2718.95);
    });

    test('free VGA adapter with MacBook Pro', () => {
        const specials = [
            { sku: 'atv', type: 'buy x get y', threshold: 2, value: 1 },
            { sku: 'ipd', type: 'more than x', threshold: 4, value: 499.99 },
            { sku: 'mbp', type: 'bundle', threshold: 1, value: 0, reference: 'vga' },
        ];
        const pricingRules = new PricingRules(catalogue, specials);
        
        let co = new Checkout(pricingRules);
        co.scan('mbp');
        co.scan('vga');
        co.scan('ipd');
        expect(co.total()).toEqual(1949.98);

        // and when vga is scanned 1st
        co = new Checkout(pricingRules);
        co.scan('vga');
        co.scan('ipd');
        co.scan('mbp');
        expect(co.total()).toEqual(1949.98);
    });

    test('free VGA adapter with MacBook Pro, with BOGOF vga', () => {
        const specials = [
            { sku: 'mbp', type: 'bundle', threshold: 1, value: 0, reference: 'vga' },
            { sku: 'vga', type: 'buy x get y', threshold: 1, value: 1 },
        ];
        const pricingRules = new PricingRules(catalogue, specials);

        let co = new Checkout(pricingRules);
        co.scan('mbp');
        co.scan('vga'); // bundled
        co.scan('vga'); // full price
        expect(co.total()).toEqual(1429.99);

        co = new Checkout(pricingRules);
        co.scan('mbp');
        co.scan('vga'); // bundled
        co.scan('vga'); // full price
        co.scan('vga'); // free
        expect(co.total()).toEqual(1429.99);

        co = new Checkout(pricingRules);
        co.scan('mbp');
        co.scan('vga'); // bundled
        co.scan('vga'); // full price
        co.scan('vga'); // free
        co.scan('vga'); // full price
        expect(co.total()).toEqual(1459.99);
    });
});
