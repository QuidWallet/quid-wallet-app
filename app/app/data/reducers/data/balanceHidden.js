import { actions } from 'quid-wallet/app/actions/app';


export function balanceHidden(state = false, action) {
    let nextState;
    switch (action.type) {
    case actions.TOGGLE_HIDDEN_BALANCE:
	nextState = !state;
	break;
    default:
	nextState = state;
	break;
    }

    return nextState;
}
