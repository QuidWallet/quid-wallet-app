import Config from 'react-native-config';
import { getTokenWithMarketInfo } from 'quid-wallet/app/data/selectors';
import FabricService from 'quid-wallet/app/services/FabricService';


export const actions = {
    CHANGE_ROOT: 'CHANGE_ROOT',
    TOGGLE_HIDDEN_BALANCE: 'TOGGLE_HIDDEN_BALANCE',
    SELECT_SCREEN: 'SELECT_SCREEN',
    TOGGLE_FAVORITE_TOKEN: 'TOGGLE_FAVORITE_TOKEN',
    UPDATE_TOKENS_LIST: 'UPDATE_TOKENS_LIST',
    STOP_ALL_REFRESHERS: 'STOP_ALL_REFRESHERS'
};


export function changeAppRoot(root) {
    return {
	type: actions.CHANGE_ROOT,
	payload: {
	    root
	}
    };
}


export function stopAllRefreshers() {
    return {
	type: actions.STOP_ALL_REFRESHERS
    };
}

function updateTokensList({tokens, version}) {
    return {
	type: actions.UPDATE_TOKENS_LIST,
	payload: {
	    tokens,
	    version
	}
    };
}


export function remoteSyncTokensList() {
    return (dispatch, getState) => {
	const state = getState();
	// sync tokens list with remote repo
	const localTokensListVersion = state.config.tokens.version;
	
	// check if version has changed since last sync
	fetch(Config.TOKENS_VERSION_URL)
	    .then(res => res.json())
	    .then(data => {
		if (data.version > localTokensListVersion) {
		    // tokens list needs to be updated
		    fetch(Config.TOKENS_LIST_URL).then(res => res.json())
			.then(newTokensData => {
			    if (newTokensData.tokens) {
				dispatch(updateTokensList(newTokensData));
			    }
			}).catch(() => {
			    // pass network errors
			});
		}
	    }).catch(() => {
		// pass network errors
	    });
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
	const token = getTokenWithMarketInfo(state, {token: {contractAddress: tokenAddress}});
	const favoriteTokensCount = state.data.favoriteTokens.length;
	const toggleAction = (token.isFavorite ? 'ADD' : 'REMOVE');
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
