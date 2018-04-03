import { toFixed, formatToCurrency } from 'quid-wallet/app/utils';


export const getPriceChangeFormatObj = ({price, priceChangePerc, priceChangeAbs, currency}) => {
    const digitsAfterDot = (price < 1) ? 6 : 2;
    priceChangePerc = toFixed(priceChangePerc, 2);
    priceChangeAbs = toFixed(priceChangeAbs, digitsAfterDot);	    
    const sign = (priceChangeAbs < 0) ? '' : '+';
    const color = (priceChangeAbs < 0) ? '#E33E59' : '#00BF19';
    price = formatToCurrency(price, currency);
    const priceChangeString = `${sign}${priceChangeAbs} (${priceChangePerc}%)`;

    return {
	sign,
	price,
	priceChangeString,
	color,
	priceChangeAbs,
	priceChangePerc
    };
}

