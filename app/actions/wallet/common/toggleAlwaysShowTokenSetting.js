import { actions } from './../actions';
import { updateTokenBalance } from './fetchWalletTokens';
import { getActiveWalletTokens } from 'quid-wallet/app/data/selectors';

export const toggleDisplayTokenSetting = (tokenAddress, value) => {
    return ((dispatch, getState) => {
	const state = getState();
	const address = state.data.activeAddress;
	
	// get balance if needed
	const tokens = getActiveWalletTokens(state);
	
	// if there is no token
	if (tokens.filter(token => token.contractAddress === tokenAddress).length === 0 && value === "SHOW") {
	    dispatch(updateTokenBalance(address, tokenAddress));
	}
	
	dispatch({
	    type: actions.TOGGLE_DISPAY_TOKEN_SETTING,
	    payload: { address, tokenAddress, value }
	});
    });
};
