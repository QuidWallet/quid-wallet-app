import { actions } from 'quid-wallet/app/actions/app';
import { actions as walletActions } from 'quid-wallet/app/actions/wallet';
import TOKENS_JSON from 'quid-wallet/app/data/config/tokens';


export function tokens(state = TOKENS_JSON, action) {
    let nextState;
    switch (action.type) {
    case actions.UPDATE_TOKENS_LIST:
	// syncing token list with remote list
    	const tokens = {
    	    ...state.tokens,
    	    ...action.payload.tokens
    	};
    	nextState = {
	    tokens,
	    version: action.payload.version
    	};
    	break;
    case walletActions.GOT_NEW_TOKENS:
	const { newTokens } = action.payload;
	// combine tokens if got new tokens
    	if (newTokens) {
    	    nextState = {
    		tokens: {
    		    ...state.tokens,
    		    ...newTokens	
    		},
    		version: state.version
    	    };
    	}
    	break;		
    default:
    	nextState = state;
    	break;
    }
    
    return nextState;
}
