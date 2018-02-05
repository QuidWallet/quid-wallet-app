import { actions } from 'quid-wallet/app/actions/wallet';
import { actions as txActions } from 'quid-wallet/app/actions/transactions';

const newAssetDct = {
    'ETH': {
	balance: 0,
	rawBalance: 0,
	address: '0x000_ether', // TODO move to constants.js
	decimals: 18
    }
};

export function addressAssets(state = {}, action) {
    let nextState;
    let address;
    switch (action.type) {
    case actions.LINK_WATCH_WALLET:
	address = action.payload.address;
	const tempDct = {};
	tempDct[address] = newAssetDct;
	nextState = {
	    ...state,
	    ...tempDct
	};
	break;		
    case actions.GOT_ADDRESS_ASSETS:
	nextState = {
	    ...state,
	    ...action.payload
	};
	break;	
    case actions.UNLINK_WALLET:
	address = action.payload.address;
	const emptyDict = {};
	emptyDict[address] = {};
	nextState = {
	    ...state,
	    ...emptyDict
	};
	break;	
    default:
	nextState = state;
	break;
    }
    
    return nextState;
}


export function activeAddress(state = '', action) {
    let nextState;
    switch (action.type) {
    case actions.SELECT_WALLET:
    case actions.LINK_WATCH_WALLET:
	const { address } = action.payload;
	nextState = address;
	break;	
    default:
	nextState = state;
	break;
    }

    return nextState;
}


export function lastBlockNumberCheck(state = {}, action) {
    let nextState;
    let address;
    const tempDict = {};
    
    switch (action.type) {
    case actions.LINK_WATCH_WALLET:
    case actions.UNLINK_WALLET:
	address = action.payload.address;
	tempDict[address] = {};
	nextState = {
	    ...state,
	    ...tempDict
	};
	break;
    case txActions.GOT_TOKEN_TRANSACTIONS:
	address = action.payload.address;
	const { tokenAddress, blockNumber, direction } = action.payload;
	const key = `${tokenAddress}-${direction}`;
			    
	nextState = {
	    ...state
	};
	
	nextState[address] = nextState[address] || {};
	nextState[address][key] = blockNumber;
	break;
    default:
	nextState = state;
	break;
    }

    return nextState;
}


