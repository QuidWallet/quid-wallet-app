import { actions } from 'quid-wallet/app/actions/wallet';
import { actions as txActions } from 'quid-wallet/app/actions/transactions';


const emptyTokensList = [{
    qnty: 0,
    rawQnty: 0,
    tokenAddress: '0x000_ether', // TODO move to constants.js
}];


export function addressTokens(state = {}, action) {
    let nextState;
    let address;
    switch (action.type) {
    case actions.ADD_WALLET:
	address = action.payload.address;
	const tempDct = {};
	tempDct[address] = emptyTokensList;
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
    case actions.GOT_TOKEN_BALANCE:
	const { walletAddress, tokenBalanceData } = action.payload;
	const walletTokens = state[walletAddress] || [];
	const newWalletTokens = [...walletTokens];
	
	// add token balance data to state if it wasn't there
	if (walletTokens.filter(({ tokenAddress }) => tokenAddress === tokenBalanceData.tokenAddress).length === 0) {
	    newWalletTokens.push(tokenBalanceData);
	}
	
	nextState = {
	    ...state
	};
	nextState[walletAddress] = newWalletTokens;
	break;	
	
    case actions.UNLINK_WALLET:
	address = action.payload.address;
	const emptyDict = {};
	emptyDict[address] = [];
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
    case actions.ADD_WALLET:
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
    case actions.ADD_WALLET:
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


export function displayTokensWalletSettings(state = {}, action) {
    let nextState;
    switch (action.type) {
    case actions.ADD_WALLET:
	nextState = { ...state };
	nextState[action.payload.address] = {};
	break;		
    case actions.TOGGLE_DISPAY_TOKEN_SETTING:
	const { tokenAddress, value, address } = action.payload;
	nextState = { ...state };
	nextState[address] = {...(nextState[address]||{})};
	nextState[address][tokenAddress] = value;
    	break;	
    case actions.UNLINK_WALLET:
	nextState = {...state};
	nextState[action.payload.address] = {};	
	break;	
    default:
	nextState = state;
	break;
    }
    
    return nextState;
}
