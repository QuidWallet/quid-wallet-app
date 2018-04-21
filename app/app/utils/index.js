import BigNumber from 'bignumber.js';
import currencyFormatter from 'currency-formatter';


export const stringifyBalance3 = (balance, decimals) => {
    var leftValue, rightValue;
    balance = balance.toString();
    decimals = parseInt(decimals.toString());

    //how many numbers are to the left of the decimal point
    let leftLength = balance.length-decimals;

    //what numbers are to the right - note special case for zero decimals
    rightValue = decimals>0 ? balance.slice(-decimals) : '';

    //pad right side with zeros if needed
    rightValue = new Array(Math.max(0,1+(decimals-balance.length))).join('0') + rightValue;

    //remove trailing zeros
    rightValue = rightValue.replace(/0+$/,'');

    if (leftLength>0) {
	//use the left side value
	leftValue = balance.slice(0, leftLength);
    }else{
	//no left size value, so use zero
	leftValue = '0';
    }
    return leftValue + (rightValue?'.' + rightValue :'');
};


export const toFixed = (number, digitsAfterDot) => {
    let numberFloat = parseFloat(number);    
    return (numberFloat||0).toFixed(digitsAfterDot);
};

export function isPrefixed(str = '') {
    return str.slice(0, 2) === '0x';
}  

export function dePrefix(str = '') {
    if (isPrefixed(str)) {
      return str.slice(2);
    }
    return str;
}

export function padStringTo32bytes(str = '') {
    let n = dePrefix(str);
	while (n.length < 64) {
	    n = "0" + n;
	}
    return "0x" + n;1
}

export function shortAddress(address, num, showEnd = true) {
    const sanitized = dePrefix(address);
    const shorten = `${sanitized.slice(0, num)}...${showEnd ? sanitized.slice(-num) : ''}`;
    return '0x'.concat(shorten);
}

export const convertDate = (timestamp) => {
    const _padWithZero = (x) => {
	return ('0'+x).slice(-2);
    };
    
    const date = new Date(timestamp * 1000);
    const hours =  _padWithZero(date.getHours());
    const minutes =  _padWithZero(date.getMinutes());
    const day =  _padWithZero(date.getDate());
    const month = _padWithZero(date.getMonth()+1);
    const year = date.getFullYear();
    return hours + ':' + minutes + ' ' + day + '.' + month + '.' + year;
};
  

export const displayBigNumber = (val, decimals) => {
    if (decimals === 0) { return val; }
    decimals = decimals || 18;
    let value;
    if (val.toString().includes('e')) { // e.g. 5.625e+23	
	// hack for very big numbers
	value = val / Math.pow(10,decimals);
    } else if (val){
	value = new BigNumber(stringifyBalance3(val, decimals)).toNumber();
    } else {
	value = 0;
    }
    return value;
};


export function formatUSDate(d) {
    function z(n){return (n<10?'0':'')+ +n;}
    return z(d.getDate()) + '.' + z(d.getMonth() + 1) + '.' + d.getFullYear();
}


export function getNDatesBefore(startDate, numberOfDaysBefore) {
    let datesArray = [],
	daysCounter = 0,
	day = 1000 * 60 * 60 * 24;
    while (daysCounter < numberOfDaysBefore + 1) {
	let newDateBeforeStart = startDate - day * daysCounter;
	let date = new Date(newDateBeforeStart);
	datesArray.push(date);
	daysCounter++;
    }
    return datesArray;
}


/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} array to split
 * @param chunk_size {Integer} Size of every group
 */
export function chunkArray(myArray, chunk_size){
    let index = 0;
    const arrayLength = myArray.length;
    const tempArray = [];

    for (index = 0; index < arrayLength; index += chunk_size) {
	let myChunk = myArray.slice(index, index+chunk_size);
	tempArray.push(myChunk);
    }

    return tempArray;
}


export const formatToCurrency = (value, currency) => {
    return currencyFormatter.format(value, {
	code: currency,
	decimal: '.',
	thousand: ',',
	precision: (value > 0 && value < 1) ? 6 : 2,
	format: '%s%v',
    });
};


export const paginateArray = (arr, page, pageSize) => {
    return arr.filter((item, index) => (index >= page*pageSize && index < (page + 1) * pageSize));  
}
