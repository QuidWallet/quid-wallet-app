import { actions as walletActions } from 'quid-wallet/app/actions/wallet';
import { actions as marketActions } from 'quid-wallet/app/actions/market';
import { actions as txActions } from 'quid-wallet/app/actions/transactions';
import { actions as appActions } from 'quid-wallet/app/actions/app';
import { combineReducers } from 'redux';


function fetchingTransactions(state = false, action) {
    let nextState;
    switch (action.type) {
    case txActions.FETCHING_ETHER_TRANSACTIONS:
    case txActions.FETCHING_TOKEN_TRANSACTIONS:	
	nextState = true;
	break;
    case txActions.STOP_SPINNER:
    case appActions.STOP_ALL_REFRESHERS:		
    case walletActions.UNLINK_WALLET:
	nextState = false;	
	break;	
    default:
	nextState = state;
	break;
    }

    return nextState;
}


function fetchingAddressAssets(state = false, action) {
    let nextState;
    switch (action.type) {
    case walletActions.FETCHING_ADDRESS_ASSETS:
	nextState = true;
	break;
    case walletActions.GOT_ADDRESS_ASSETS:
    case walletActions.STOP_REFRESHER:
    case walletActions.UNLINK_WALLET:
    case appActions.STOP_ALL_REFRESHERS:
	nextState = false;
	break;	
    default:
	nextState = state;
	break;
    }

    return nextState;
}


function fetchingMarketData(state = false, action) {
    let nextState;
    switch (action.type) {
    case marketActions.FETCHING_MARKET_DATA:
	nextState = true;
	break;
    case marketActions.GOT_MARKET_DATA:
    case appActions.STOP_ALL_REFRESHERS:	
    case marketActions.STOP_REFRESHER:	
	nextState = false;
	break;	
    default:
	nextState = state;
	break;
    }

    return nextState;
}


export default combineReducers({
    fetchingAddressAssets,
    fetchingMarketData,
    fetchingTransactions
});
