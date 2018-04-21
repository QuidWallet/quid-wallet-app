import { createSelector } from 'reselect';
import { getSelectedCurrency } from './settings';
import { getTokensDct, getTokensList } from './tokens';


export const getMarketDataForToken = (symbol, marketData, currency) => {
    // if there are no info for the token
    if (!(marketData[symbol] && marketData[symbol][currency])) {
	return {
	    price: 0,
	    priceChangeAbs: 0, 
	    priceChangePerc: 0,
	    timestamp: null
	};
    } else {
	return marketData[symbol][currency];
    }
};


const getTokensWithMarketData = createSelector(
    [getTokensList], 
    (tokens) => {
	return tokens
	    .filter(token => (token.cc_ticker && (token.cc_ticker||'').length > 0 && token.cmc_rank))
	    .sort((a,b) => a.cmc_rank - b.cmc_rank);
    });


const _prepareTokenObject = ({token, marketData, currency, isFavorite}) => {
    const { price, priceChangePerc,
	    priceChangeAbs, timestamp } = getMarketDataForToken((token.cc_ticker||""), marketData, currency);
    const marketCap = price * (token.available_supply||0);    
    return {
	...token,
	marketCap,
	priceChangePerc,
	priceChangeAbs,
	price,
	timestamp,
	isFavorite: isFavorite
    };    
};


export const getMarketTokens = createSelector(
    [getTokensWithMarketData,
     (state) => state.marketData.assets,
     getSelectedCurrency,
     state => state.data.favoriteTokens,
     getTokensDct
    ],
    (tokens, marketData, currency, favoriteTokens, tokensDct) => {
	let isFavoriteDCT = {};
	favoriteTokens.map(tokenAddress => {
	    isFavoriteDCT[tokenAddress] = 1;
	});
	
	const favoriteTokensList = favoriteTokens.map(tokenAddress => {
	    const token = tokensDct[tokenAddress] || { contractAddress: tokenAddress };
	    return _prepareTokenObject({token, marketData, currency, isFavorite: true});
	});						      
	const otherTokensList = tokens.filter((token) => {
	    return isFavoriteDCT[token.contractAddress] !== 1;
	}).map((token) => _prepareTokenObject({token, marketData, currency, isFavorite: false}));

	// merge 2 lists: favorites and other tokens
	return favoriteTokensList.concat(otherTokensList);	    
    }

);


export const getTokenWithMarketInfo = createSelector(
    [getMarketTokens,
     (state, props) => {
	 return props.token;
     }],
    (tokens, token) => tokens.filter(t => t.contractAddress === token.contractAddress)[0]
);
