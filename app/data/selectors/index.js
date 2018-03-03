import { createSelector } from 'reselect';
import { formatUSDate, toFixed, formatToCurrency } from 'quid-wallet/app/utils';
import { createSelector as createOrmSelector } from 'redux-orm';
import { schema } from 'quid-wallet/app/data/reducers/models';
import { DISPLAY_CURRENCIES } from 'quid-wallet/app/data/config/displayCurrencies';

const ormSelector = state => state.orm;
export const getActiveWalletAddress = state => state.data.activeAddress;
export const getDisplayCurrencies = () => DISPLAY_CURRENCIES;
export const getActiveDisplayCurrencies = state => state.data.activeCurrencies;
export const getSelectedCurrency = state => state.data.activeCurrencies[0];
export const getTokensDct = state => state.config.tokens.tokens;


export const getWallets = createSelector(
    ormSelector,
    createOrmSelector(schema, session => session.Wallet.all().toRefArray())
);


export const getActiveWallet = createSelector(
    [getActiveWalletAddress,
     getWallets],
    (activeAddress, wallets) => wallets.filter((wallet) => wallet.address === activeAddress)[0] || {}
);


const _getMarketDataForAsset = (symbol, marketData, currency) => {
    if (!(marketData[symbol] && marketData[symbol][currency])) {
	return {
	    rate: 0,
	    diff: 0,
	    diffAbs: 0,
	    symbol
	};
    } else {
	return marketData[symbol][currency];
    }
};


const getTokensWithMarketData = createSelector(
    [getTokensDct], 
    (tokensDct) => {
	const ticker2TokenDct = {};
	Object.keys(tokensDct).map(tokenAddr => {
	    const token = tokensDct[tokenAddr];
	    if (token.has_cc_ticker && token.cmc_rank) {
		token.contractAddress = tokenAddr;
		ticker2TokenDct[token.cc_ticker] = token;
	    }
	});

	return Object.keys(ticker2TokenDct)
	    .map(ticker => ticker2TokenDct[ticker]).sort((a,b) => a.cmc_rank - b.cmc_rank);
    });


const _prepareTokenObject = (token, marketData, currency, isFavorite) => {
    const tokenMarketData = _getMarketDataForAsset(token.cc_ticker, marketData, currency);
    const marketCap = tokenMarketData.rate * (token.available_supply||0);
    const digitsAfterDot = (tokenMarketData.rate < 1) ? 6 : 2;
    const diffPercent = toFixed(tokenMarketData.diff, 2);
    const diffAbs = toFixed(tokenMarketData.diffAbs, digitsAfterDot);	    
    const sign = (diffPercent < 0) ? '' : '+';
    const color = (diffPercent < 0) ? '#E33E59' : '#00BF19';
    const price = formatToCurrency(tokenMarketData.rate, currency);
    const change = `${sign}${diffAbs} (${diffPercent}%)`;
    
    const renderRowCache = {
	color,
	price,
	change		
    };
    
    return {
	key: token.contractAddress,
	...tokenMarketData,
	...token,	
	marketCap,
	renderRowCache,
	isFavorite: isFavorite
    };    
};

export const getTokensSortedByMarketCap = createSelector(
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
	
	const favoriteTokensList = favoriteTokens.map(tokenAddress => _prepareTokenObject(tokensDct[tokenAddress], marketData, currency, true));	    
	const otherTokensList = tokens.filter((token) => {
	    return isFavoriteDCT[token.contractAddress] !== 1;
	}).map((token) => _prepareTokenObject(token, marketData, currency, false));

	
	return favoriteTokensList.concat(otherTokensList);	    
    }

);


export const getTokenWithMarketInfo = createSelector(
    [getTokensSortedByMarketCap,
     (state, props) => props.asset],
    (tokens, token) => tokens.filter(t => t.contractAddress === token.contractAddress)[0]
);


export const getMarketData = createSelector(
    [(state) => state.marketData.assets,
     getSelectedCurrency],

    (marketData, currency) => {
	return Object.keys(marketData).map((symbol, index) => {
	    const assetMarketData = _getMarketDataForAsset(symbol, marketData, currency);

	    const assetData = {
		key: index,
		symbol,
		    ...assetMarketData,

	    };
	    return assetData;
	});
    }
);


const getAddressAssetsFromEthplorer = createSelector(
    [getActiveWalletAddress,
     (state) => state.data.addressAssets,
    ], (address, assets) => (assets[address] || {}) // fix if no assets    
);


export const getAssets = createSelector(
    [getAddressAssetsFromEthplorer,
     (state) => state.marketData.assets,
     getSelectedCurrency,
     getTokensDct],
    (assetsEthplorer, marketData,
     currency, tokensDct) => {
	 if (!assetsEthplorer) { return []; }
	 return Object.keys(assetsEthplorer).map((symbol, index) => {
	     const assetEthplorer = assetsEthplorer[symbol];
	     const assetModel = tokensDct[assetEthplorer.address] || {};
	     const assetMarketInfo = _getMarketDataForAsset(assetModel.cc_ticker, marketData, currency);
	     const price = assetMarketInfo.rate;
	     const balance = assetsEthplorer[symbol].balance;
	     const address = assetsEthplorer[symbol].address;
	     const balanceFiat = price * balance;
	     const sortingScore = (symbol === 'ETH') ? 999999999999 : balanceFiat + 0.0000000001 * index; // put ether on the first place, than according to balance
	     const key = address;

	     const asset = {
		 sortingScore,
		 key,
		 symbol,
		 balance,
		 address,
		 price,
		 balanceFiat,
		 marketInfo: assetMarketInfo,
		 ...assetModel,
		 contractAddress: assetEthplorer.address
	     };
	     return asset;
	 }).sort((a, b) => {
	     return b.sortingScore - a.sortingScore;
	 });
     });


export const getAsset = createSelector(
    [
	getAssets,
	(state, props) => props.symbol],
    (assets, symbol) => assets.filter(a => a.symbol === symbol)[0]
);


export const getAssetsWithPrice = createSelector(
    getAssets,
    (assets) => assets.filter((asset) => asset.has_cc_ticker)
);


export const getAssetsBalance = createSelector(
    getAssetsWithPrice,
    (assets) => assets.reduce((acc, asset) => {
	return (acc + asset.balanceFiat);
    }, 0)
);


export const getAllTransfers = createSelector(
    ormSelector,
    createOrmSelector(schema, session => ({
	transfers: session.AssetTransfer.all(),
	count: session.AssetTransfer.count()
    }))
);


export const getAssetTransfers = createSelector(
    [	
	getAllTransfers,
	(state, props) => props.asset.address,
	getActiveWalletAddress,
    ],
    ({transfers}, tokenAddress, address) => {
	return transfers.filter(transfer => (transfer.tokenAddress === tokenAddress &&
					     transfer.address === address)).orderBy('timestamp', ['desc']).toRefArray();
    }
);


export const getAssetFlowByDate = createSelector(
    getAssetTransfers,
    (transfers) => {
	return transfers.reduce((dct, transfer) => {
	    const date = formatUSDate(new Date(transfer.timestamp*1000));
	    const dctCopy = {
		    ...dct		
	    };
	    dctCopy[date] = dctCopy[date] || 0;
	    const sign = (transfer.direction === 'IN') ? 1 : -1;
	    dctCopy[date] += sign * transfer.value;
	    return dctCopy;
	}, {});	
    }
);


export const isTokenFavorite = createSelector(
    [state => state.data.favoriteTokens,
     (state, props) => props.asset.contractAddress], (favoriteTokens, token) => {
	 return favoriteTokens.includes(token);	    
     });


const getAssetsFlow = createSelector(
    [getAllTransfers,
     getActiveWalletAddress,
     (state) => state.marketData.timestamp],
    ({transfers}, address, now) => {
	const day = 1000 * 60 * 60 * 24;
	const flowDct = transfers //.toRefArray()
	
	      .filter(tx => (tx.address === address && ((now - tx.timestamp*1000)/day < 1))).toRefArray()
	      .reduce((dct, tx) => {
		  const newDct = {
			  ...dct
		  };
		  newDct[tx.tokenAddress] = newDct[tx.tokenAddress] || 0;
		  const sign = (tx.direction === 'IN') ? 1 : -1;
		  const value = sign * tx.value;
		  newDct[tx.tokenAddress] += value;
		  return newDct;
	      }, {});
	return flowDct;
    }
);


export const getPositionChangeDct = createSelector(
    [getAssetsWithPrice,
     getAssetsFlow
    ],
    (assets, flowDct) => {
	const changeDct = assets.reduce((dct, asset) => {
	    const qntyToday = asset.balance;
	    const qntyYesterday = asset.balance - (flowDct[asset.address] || 0);
	    const priceToday = asset.price;
	    const priceYesterday = asset.price - asset.marketInfo.diffAbs;
	    const value = (qntyToday * priceToday) - (qntyYesterday * priceYesterday);
	    let percent;
	    // TODO: resolve bignumber fix
	    if (qntyYesterday > 0.00000001) {
		percent = ((qntyToday * priceToday) / (qntyYesterday * priceYesterday) - 1) * 100;
	    } else {
		percent = 0;
	    }

	    const tempDct = {
		    ...dct
	    };
	    tempDct[asset.address] = { value, percent };
	    return tempDct;
	}, {});
	return changeDct;
    }
);


export const getPortfolioChangeAbs = createSelector(
    getPositionChangeDct,
    (changeDct) => {
	const totalChangeAbs = Object.keys(changeDct)
	      .map(assetAddress => changeDct[assetAddress].value)
	      .reduce((acc, diff) => {
		  return (acc + diff);
	      }, 0);
	return totalChangeAbs;
    }
);


export const getPortfolioChangePerc = createSelector(
    [
	getAssetsBalance,
	getPortfolioChangeAbs
    ],
    (currentValue, changeAbs) => (currentValue / (currentValue - changeAbs) - 1) * 100
);
