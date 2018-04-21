import { actions } from 'quid-wallet/app/actions/currency';


export function activeCurrencies(state = ['ETH', 'USD'], action) {
    let nextState;
    switch (action.type) {
    case actions.TOGGLE_CURRENCY:
	const currency = action.payload;
	
	if (state.includes(currency)) {
	    // remove currency if it is in the list
	    nextState = state.filter(c => c !== currency);
	} else {
	    // add currency if it is NOT in the list	    
	    nextState = [...state, currency];
	}
	break;
    case actions.CHANGE_CURRENCY:
	const prevCurrency = state[0];
	const otherCurrencies = state.filter(c => c !== prevCurrency);
	nextState = [...otherCurrencies, prevCurrency];
	break;
    default:
	nextState = state;
	break;
    }

    return nextState;
}
