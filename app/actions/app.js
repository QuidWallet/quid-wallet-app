import { getTokenWithMarketInfo } from 'quid-wallet/app/data/selectors';
import FabricService from 'quid-wallet/app/services/FabricService';


export const actions = {
    CHANGE_ROOT: 'CHANGE_ROOT',
    TOGGLE_HIDDEN_BALANCE: 'TOGGLE_HIDDEN_BALANCE',
    SELECT_SCREEN: 'SELECT_SCREEN',
    TOGGLE_FAVORITE_TOKEN: 'TOGGLE_FAVORITE_TOKEN'    
};


export function changeAppRoot(root) {
    return {
	type: actions.CHANGE_ROOT,
	payload: {
	    root
	}
    };
}


export function toggleFavoriteToken(tokenAddress) {
    return (dispatch, getState) => {
	const state = getState();

	dispatch({
	    type: actions.TOGGLE_FAVORITE_TOKEN,
	    payload: {
		tokenAddress
	    }
	});

	// #fabric-analytics
	const token = getTokenWithMarketInfo(state, {asset: {contractAddress: tokenAddress}});
	const favoriteTokensCount = state.data.favoriteTokens.length;
	const toggleAction = (token.isFavorite ? 'ADD' : 'REMOVE')	
	FabricService.logFavoriteTokenToggled(token.symbol, favoriteTokensCount, toggleAction);
    };
}


export function toggleHiddenBalance() {
    return (dispatch, getState) => {
	const state = getState();

	dispatch({
	    type: actions.TOGGLE_HIDDEN_BALANCE
	});

	// #fabric-analytics
	const hidden = state.data.balanceHidden;
	const screen = state.activeScreenId;	
	FabricService.logHiddenBalanceToggled(hidden, screen);
    };
}


export function selectScreen(screenId) {
    return {
	type: actions.SELECT_SCREEN,
	payload: {
	    screenId
	}
     };
}
