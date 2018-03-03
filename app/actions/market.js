import cryptocompareApiService from 'quid-wallet/app/services/cryptocompareApiService';
import {
    getActiveDisplayCurrencies,
    getTokensSortedByMarketCap,
    getAssetsWithPrice
} from 'quid-wallet/app/data/selectors';
import { chunkArray, paginateArray } from 'quid-wallet/app/utils';
import _ from 'lodash';

export const actions = {
    FETCHING_MARKET_DATA: 'FETCHING_MARKET_DATA',
    GOT_MARKET_DATA: 'GOT_MARKET_DATA',
    FETCHING_PRICE_HISTORY: 'FETCHING_PRICE_HISTORY',    
    GOT_PRICE_HISTORY: 'GOT_PRICE_HISTORY',
    STOP_REFRESHER: 'STOP_REFRESHER'    
};


const _getMarketDataChunk = ({dispatch, tokens, currenciesToFetch}) => {
    const timestamp = Date.now();
    return cryptocompareApiService.getMarketData(tokens, currenciesToFetch)
	.then((data) => {
	    if (data && data.RAW) {		
		const assets = {};
		
		// Parsing result to usable structure
		// for each token in RAW data
		tokens.map(tokenSymbol => {
		    // for each selected currency
		    assets[tokenSymbol] = {};
		    currenciesToFetch.map(currency => {
			try {
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
			} catch(e) {
			    // pass
			}
		    });
		});
		
		dispatch({type: actions.GOT_MARKET_DATA, payload: {assets, timestamp}});
	    }
	});    
};


export const fetchMarketData = (tokens=[]) => {
    return ((dispatch, getState) => {
	return new Promise((resolve, reject) => {
	    dispatch({type: actions.FETCHING_MARKET_DATA});
	    const state = getState();
	    const currenciesToFetch = getActiveDisplayCurrencies(state);
	    
	    // leave only tokens for current step
	    let tokensToFetch;
	    if (tokens.length === 0) {
		// if no tokens provided 
		// fetch:
		//   1) first 10 tokens on Market Screen
		const tokensByMarkCap = getTokensSortedByMarketCap(state).map(t => t.cc_ticker);
		const page = 0;
		const pageSize = 10;
		tokensToFetch = paginateArray(tokensByMarkCap, page, pageSize);
		
		//   2) tokens in the wallet
		const tokensInWallet = getAssetsWithPrice(state).map(t => t.cc_ticker);
		
		// merge 2 arrays 
		tokensToFetch = _.union(tokensToFetch, tokensInWallet);
	    } else {
		tokensToFetch = tokens.map(t => t.cc_ticker);
	    }

	    // split request in chunks with max 60 tokens (if needed)
	    const tokenChunks = chunkArray(tokensToFetch, 60);
	    const fetchPromises = tokenChunks.map(tokens => {
		return _getMarketDataChunk({tokens, dispatch, currenciesToFetch});
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
