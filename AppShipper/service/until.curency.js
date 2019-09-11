
module.exports.showVNDCurrency = (price) => {
    if (typeof price == 'number') {
        let priceString = price.toString();
        let len = price.len;
        let numberFormat = '';
        let flat = 0;
        for (let i = len - 1; i >= 0; i--) {
            if (flat === 3) {
                numberFormat += `.${priceString[i]}`
                flat = 1;
            } else {
                numberFormat += priceString[i];
                flat++;
            }
        }
        let result = '';
        for (let i = numberFormat.length - 1; i >= 0; i--) {
            result += numberFormat[i];
        }
        return result;
    } else {
        return price;
    }
}
