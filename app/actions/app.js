import { getTokenWithMarketInfo } from 'quid-wallet/app/data/selectors';
var Fabric = require('react-native-fabric');
var { Answers } = Fabric;


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
	dispatch({
	    type: actions.TOGGLE_FAVORITE_TOKEN,
	    payload: {
		tokenAddress
	    }
	});

	// ANALYTICS
	const state = getState();
	const token = getTokenWithMarketInfo(state, {asset: {contractAddress: tokenAddress}});
	const favoriteTokens = state.data.favoriteTokens;
	
	const logDetails  = {
	    ACTION_TYPE: 'TOGGLE_FAVORITE_TOKEN',
	    symbol: token.symbol,
	    favoriteTokensCount: favoriteTokens.length,
	    toggleAction: (token.isFavorite ? 'ADD' : 'REMOVE')
	};
	Answers.logCustom('ACTION', logDetails);
    };
}


export function toggleHiddenBalance() {
    return (dispatch, getState) => {
	dispatch({
	    type: actions.TOGGLE_HIDDEN_BALANCE
	});

	// ANALYTICS
	const state = getState();
	const hidden = state.data.balanceHidden;
	const screen = state.activeScreenId;
	
	const logDetails  = {
	    ACTION_TYPE: 'TOGGLE_HIDDEN_BALANCE',
	    hidden,
	    screen
	};
	Answers.logCustom('ACTION', logDetails);	
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
