import { actions } from './../actions';
import { getActiveWalletTokensWithPrice } from 'quid-wallet/app/data/selectors';
import { fetchMarketData } from './../../market';
import { fetchWalletTokens } from './fetchWalletTokens';

export const selectWallet = (address) => {
    return ((dispatch, getState) => {
	dispatch({
	    type: actions.SELECT_WALLET,
	    payload: { address }
	});
	dispatch(fetchWalletTokens(address));
	const state = getState();
	const tokensInWallet = getActiveWalletTokensWithPrice(state);
	dispatch(fetchMarketData(tokensInWallet));
    });
};
