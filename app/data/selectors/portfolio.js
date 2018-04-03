import { createSelector } from 'reselect';
import { getActiveWalletTokensWithPrice,
	 getActiveWalletAddress, getActiveWalletTotalBalance } from './wallet';
import { getAllTransfers } from './transfers';


export const portfolioUpdatedAt = createSelector(
    [getActiveWalletTokensWithPrice
    ],
    (tokens) => Math.min(...tokens.map(item => item.priceUpdatedAt))
);


const getAssetsFlow = createSelector(
    [getAllTransfers,
     getActiveWalletAddress,
     portfolioUpdatedAt],
    ({transfers}, address, portfolioUpdatedAt) => {
	const day = 1000 * 60 * 60 * 24;
	const flowDct = transfers //.toRefArray()
	// use timestamp of last price update as a reference
	      .filter(tx => (tx.address === address && ((portfolioUpdatedAt - tx.timestamp*1000)/day < 1))).toRefArray()
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


const getPositionChangeDct = createSelector(
    [getActiveWalletTokensWithPrice,
     getAssetsFlow
    ],
    (tokens, flowDct) => {
	const changeDct = tokens.reduce((dct, token) => {
	    const qntyToday = token.qnty;
	    const qntyYesterday = token.qnty - (flowDct[token.contractAddress] || 0);
	    const priceToday = token.price;
	    const priceYesterday = token.price - token.priceChangeAbs;
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
	    tempDct[token.contractAddress] = { value, percent };
	    return tempDct;
	}, {});
	return changeDct;
    }
);


export const getPortfolioPositions = createSelector(
    [getActiveWalletTokensWithPrice,
     getPositionChangeDct
    ],
    (tokens, changeDct) => tokens
	.filter(token => token.qnty > 0)
	.map(token => ({
	...token,
	balanceChangeAbs: changeDct[token.contractAddress].value,
	balanceChangePerc: changeDct[token.contractAddress].percent
    }))
);


export const getTotalPortfolioChangeAbs = createSelector(
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


export const getTotalPortfolioChangePerc = createSelector(
    [
	getActiveWalletTotalBalance,
	getTotalPortfolioChangeAbs
    ],
    (currentValue, changeAbs) => (currentValue / (currentValue - changeAbs) - 1) * 100
);
