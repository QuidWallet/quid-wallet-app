import { createSelector } from 'reselect';
import { createSelector as createOrmSelector } from 'redux-orm';
import { schema } from 'quid-wallet/app/data/reducers/models';
import { getSelectedCurrency } from './settings';
import { getTokensDct } from './tokens';
import { getMarketDataForToken } from './market';

export const getActiveWalletAddress = state => state.data.activeAddress;
const ormSelector = state => state.orm;


export const getWallets = createSelector(
    ormSelector,
    createOrmSelector(schema, session => session.Wallet.all().toRefArray())
);


export const getActiveWallet = createSelector(
    [getActiveWalletAddress,
     getWallets],
    (activeAddress, wallets) => wallets.filter((wallet) => wallet.address === activeAddress)[0] || {}
);


export const getActiveWalletDisplayTokensSettings = createSelector(
    [getActiveWalletAddress,
     state => state.data.displayTokensWalletSettings
    ],
    (activeAddress, displayTokensSettingsDct) => {
	return displayTokensSettingsDct[activeAddress] || {};
    }
)


export const getActiveWalletTokens = createSelector(
    [	
	getActiveWalletAddress,
	(state) => state.data.addressTokens,
	(state) => state.marketData.assets,
	getSelectedCurrency,
	getTokensDct,
	getActiveWalletDisplayTokensSettings
    ],
    (activeAddress, addressTokensDct, marketData,
     currency, tokensDct, tokenDisplaySettings) => {
	 const walletTokens = addressTokensDct[activeAddress] || [];	 
	 if (!walletTokens) { return []; }

	 // exclude hide setting
	 const walletTokenFiltered = walletTokens.filter(({tokenAddress}) => tokenDisplaySettings[tokenAddress] !== "HIDE");
	 
	 const walletTokensExtended = walletTokenFiltered.map(({tokenAddress, qnty, rawQnty}, index) => {
	     const token = tokensDct[tokenAddress] || {};
	     
	     const { price, priceChangePerc,
		     priceChangeAbs, timestamp } = getMarketDataForToken(token.cc_ticker, marketData, currency);
	     	     
	     const balance = price * qnty; // value in fiat
	     const sortingScore = (token.symbol === 'ETH') ? 999999999999 : balance + 0.0000000001 * index; // put ether on the first place, than according to balance

	     const tokenObj = {
		 ...token,		 
		 sortingScore,
		 symbol: token.symbol,
		 qnty,
		 rawQnty,
		 contractAddress: tokenAddress,		 
		 price,
		 priceChangePerc,
		 priceChangeAbs,
		 priceUpdatedAt: timestamp,
		 balance	
	     };
	     return tokenObj;
	 }).sort((a, b) => {
	     return b.sortingScore - a.sortingScore;
	 });
	 return walletTokensExtended;
     });

export const getTokenInWallet = createSelector(
    [getActiveWalletTokens,
     (state, props) => props.tokenAddress],
    (tokens, tokenAddress) => tokens.filter((token) => token.contractAddress === tokenAddress)[0]
);

export const getActiveWalletTokensWithPrice = createSelector(
    getActiveWalletTokens,
    (tokens) => tokens.filter((token) => token.has_cc_ticker)
);


export const getActiveWalletTotalBalance = createSelector(
    getActiveWalletTokensWithPrice,
    (tokens) => tokens.reduce((acc, token) => acc + token.balance, 0)
);
