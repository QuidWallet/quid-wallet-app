import Config from 'react-native-config';
const URI_HOST = 'https://min-api.cryptocompare.com';

/* 
  https://www.cryptocompare.com/api/#
 */
const cryptocompareApiService = function() {
    const APP_NAME = Config.CRYPTOCOMPARE_APP_NAME;
        
    function getPriceHistoryByDate(fsym, tsym, limit) {
    	var url = `${URI_HOST}/data/histoday?fsym=${fsym}&tsym=${tsym}&limit=${limit}&extraParams=${APP_NAME}`;
    	return fetch(url).then((res) => res.json());    
    }
    
    function getMarketData(tokens, tsyms) {
	var url = `${URI_HOST}/data/pricemultifull?fsyms=${tokens.join()}&tsyms=${tsyms}&extraParams=${APP_NAME}`;
	return fetch(url).then((res) => res.json());
    }    

    
    // api
    return {
	getPriceHistoryByDate,
	getMarketData
    };
};


export default cryptocompareApiService();
