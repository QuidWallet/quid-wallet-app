import uuidv4 from 'uuid/v4';
import { combineReducers } from 'redux';
import { actions } from 'quid-wallet/app/actions/notifications';


function deviceFcmToken(state = null, action) {
    let nextState;
    switch (action.type) {
    case actions.UPDATE_FCM_TOKEN:
	nextState = action.payload;
	break;
    default:
	nextState = state;
	break;
    }
    
    return nextState;
}


// are general notifications on? 
function isOn(state = false, action) {
    let nextState;
    switch (action.type) {
    case actions.UPDATE_NOTIFICATION_IS_ON:
	nextState = action.payload;
	break;
    default:
	nextState = state;
	break;
    }
    
    return nextState;
}


// deviceId for notifications
function deviceId(state = null, action) {
    // if id is generated use old id,
    // if id is new, generate new
    const nextState = state || uuidv4();
    return nextState;
}


// flag if device is inited on server
// app on start up inits notifications device is not inited yet
//
// On app start up, if: 
// 1) ios and permissions granted or android
// 2) and flag of server inited (state.data.notifications.generalSettings.deviceInitedOnServer) is True
// Initialisation request is made 
function deviceInitedOnServer(state = false, action) {
    let nextState;
    switch (action.type) {
    case actions.DEVICE_INITED_ON_NOTIFICATION_SERVER:
	nextState = action.payload;
	break;
    default:
	nextState = state;
	break;
    }
    
    return nextState;    
}


export default combineReducers({
    deviceFcmToken,
    isOn,
    deviceId,
    deviceInitedOnServer
});
