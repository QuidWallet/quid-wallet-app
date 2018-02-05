import cryptocompareApiService from 'quid-wallet/app/services/cryptocompareApiService';
import {
    getActiveDisplayCurrencies,
    getTokensSortedByMarketCap
} from 'quid-wallet/app/data/selectors';
import { chunkArray } from 'quid-wallet/app/utils';


export const actions = {
    FETCHING_MARKET_DATA: 'FETCHING_MARKET_DATA',
    GOT_MARKET_DATA: 'GOT_MARKET_DATA',

    FETCHING_PRICE_HISTORY: 'FETCHING_PRICE_HISTORY',    
    GOT_PRICE_HISTORY: 'GOT_PRICE_HISTORY',
    STOP_REFRESHER: 'STOP_REFRESHER',
    
};


const _getMarketDataChunk = ({dispatch, tokens, activeCurrencies}) => {
    const timestamp = Date.now();

    return cryptocompareApiService.getMarketData(tokens, activeCurrencies)
	.then((data) => {
	    if (data && data.RAW) {		
		const assets = {};
		
		// Parsing result to usable structure
		// for each token in RAW data
		tokens.map(tokenSymbol => {
		    // for each selected currency
		    assets[tokenSymbol] = {};
		    activeCurrencies.map(currency => {
			if (data.RAW[tokenSymbol][currency]) {
			    let rate, diff, diffAbs;
			    if (tokenSymbol !== currency) {				    
				rate = data.RAW[tokenSymbol][currency].PRICE;
				diff = data.RAW[tokenSymbol][currency].CHANGEPCT24HOUR;
				diffAbs = data.RAW[tokenSymbol][currency].CHANGE24HOUR;
			    } else {				    
				rate = 1;
				diff = 0;
				diffAbs = 0;
			    }
			    
			    assets[tokenSymbol][currency] = {
				rate,
				diff,
				diffAbs,
			    };
			} 
		    });
		});
		
		dispatch({type: actions.GOT_MARKET_DATA, payload: {assets, timestamp}});
	    }
	});    
};

export const fetchMarketData = () => {
    return ((dispatch, getState) => {
	return new Promise((resolve, reject) => {
	    dispatch({type: actions.FETCHING_MARKET_DATA});
	    const state = getState();
	    const activeCurrencies = getActiveDisplayCurrencies(state);

	    const tokensByMarkCap = getTokensSortedByMarketCap(state);

	    // list of cryptocompare tickers sorted by market cap
	    const tickersCC = tokensByMarkCap.map(a => a.cc_ticker);
	    const tokenChunks = chunkArray(tickersCC, 60);
	    const fetchPromises = tokenChunks.map(tokens => {
		return _getMarketDataChunk({tokens, dispatch, activeCurrencies});
	    });
	    
	    Promise.all(fetchPromises).then(() => {
		resolve();
	    }).catch((err) => {
		dispatch({type: actions.STOP_REFRESHER});
		reject(err);
	    });
	});
    });
};
