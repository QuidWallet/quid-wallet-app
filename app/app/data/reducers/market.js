import { actions as marketActions } from 'quid-wallet/app/actions/market';


const initialMarketData = {
    assets: {
	'ETH': {
	    'USD': {
		PRICE: 0		
	    }
	},
    },
    timestamp: null
};


export function marketData(state = initialMarketData, action) {
    let nextState;
    switch (action.type) {
    case marketActions.GOT_MARKET_DATA:
	const assets = {
	    ...state.assets,
	    ...action.payload.assets
	};
	nextState = {
	    assets	    
	};
	break;	
    default:
	nextState = state;
	break;
    }
    
    return nextState;
}
