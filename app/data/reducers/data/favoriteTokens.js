import { actions } from 'quid-wallet/app/actions/app';


export function favoriteTokens(state = [], action) {
    let newState;
    switch (action.type) {
    case actions.TOGGLE_FAVORITE_TOKEN:
	const { tokenAddress } = action.payload;
	
	// is token in favorites ?	
	if (state.includes(tokenAddress)) {
	    // remove token from favorites
	    newState = state.filter(addr => addr !== tokenAddress);
	} else {
	    // add token to favorites if it wasn't in favorites
	    newState = [...state, tokenAddress];
	}
	break;
    default:
	newState = state;
	break;
    }

    return newState;
}
