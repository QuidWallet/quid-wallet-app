import { actions as appActions } from 'quid-wallet/app/actions/app';


function activeScreenId(state = '', action) {
    let nextState;
    switch (action.type) {
    case appActions.SELECT_SCREEN:	
	nextState = action.payload.screenId;
	break;
    default:
	nextState = state;
    }
    return nextState;
}


export default activeScreenId;
