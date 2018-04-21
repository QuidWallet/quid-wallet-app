import { actions } from 'quid-wallet/app/actions/notifications';

// individual addresses notification settings
// in order to choose subscribtions to individual addresses
export function addresses(state = {}, action) {
    let nextState;
    switch (action.type) {
    case actions.UPDATE_ADDRESS_NOTIFICATION_SETTING:
	let { address, isOn } = action.payload;
	nextState = { ...state };
	nextState[address] = isOn;
	break;
    case actions.BULK_UPDATE_ADDRESSES_NOTIFICATION_SETTINGS:
	let dct = {};
	
	action.payload.map(({address, isOn}) => {
	    dct[address] = isOn;
	});
	nextState = {
	    ...state,
	    ...dct
	};
	break;	
    default:
	nextState = state;
	break;
    }
    
    return nextState;
}
