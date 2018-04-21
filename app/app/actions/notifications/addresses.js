import notificationsApiService from 'quid-wallet/app/services/notificationsApiService';
import { actions } from './actions';
import logError from 'quid-wallet/app/utils/logError';


export const updateAddressSubscription = ({isOn, address}) => {
    return async (dispatch, getState) => {	
	const { deviceId } = getState().data.notifications.generalSettings;
	try { 
	    await notificationsApiService.createOrUpdateAddressSubscription({
		deviceId,
		isOn,
		address	    
	    });
	    
	    dispatch({type: actions.UPDATE_ADDRESS_NOTIFICATION_SETTING, payload: {address, isOn} });
	} catch (err) {
	    logError("Notifications: Error while updating address suscription", err);
	    throw err;
	}
	
	return null;
    };
}
