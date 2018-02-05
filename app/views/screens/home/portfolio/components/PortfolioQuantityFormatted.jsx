import React from 'react';
import { Text } from 'react-native';
import currencyFormatter from 'currency-formatter';


export const formatToCurrency = (value, currency, precision) => {
    let letter = '';

    if (value >= 1000 && value < 1000000) {
        value = value/1000;
        letter = 'K';
    } else if (value >= 1000000 && value < 1000000000){
        value = value/1000000;
        letter = 'MM';
    } else if (value >= 1000000000){
        value = value/1000000000;
        letter = 'B';
    }   

    return currencyFormatter.format(value, {
	code: currency,
	decimal: '.',
	thousand: ',',
	precision: (precision || 0),
	format: '%s%v'
    }) + letter;
};


const PortfolioQuantityFormatted = ({style, value, currency, precision}) => {
     return (
	 <Text style={style}>{formatToCurrency(value, currency, precision)}</Text>
    );
}


export default PortfolioQuantityFormatted;
