import notificationsApiService from 'quid-wallet/app/services/notificationsApiService';
import Config from 'react-native-config';
import { Platform } from 'react-native';
import { actions } from './actions';
import logError from 'quid-wallet/app/utils/logError';


export const getNotificationsSettings = () => {
    return async (dispatch, getState) => {	
	try {
	    const { deviceId } = getState().data.notifications.generalSettings;	    
	    const { details, addresses } = await notificationsApiService.getSettings({ deviceId: deviceId});
	    
	    dispatch({type: actions.UPDATE_NOTIFICATION_IS_ON, payload: details.isOn });
	    
	    dispatch({type: actions.BULK_UPDATE_ADDRESSES_NOTIFICATION_SETTINGS, payload: addresses});
	    
	    return { details, addresses };
	} catch (err) {
	    logError("Notifications: Error while getting notifications settings", err);	    
	    throw err;
	}
    };
}


export const updateGeneralNotificationsSettings = ({isOn, deviceFcmToken, deviceId, addresses=[]}) => {
    return async (dispatch, getState) => {
	try {
	    await notificationsApiService.updateSettings({
		deviceId,
		deviceFcmToken,
		isOn,
		addresses,
		deviceType: Platform.OS,
		environment: Config.ENVIRONMENT
	    });
	    await dispatch(getNotificationsSettings({deviceId}));
	} catch (err) {
	    logError("Notifications: Error while updating notifications settings", err);	    
	    throw err;
	}
	    
	return null;
    };
}


export const updateGeneralNotificationsIsOnValue = (isOn) => {
    return async (dispatch, getState) => {
	const { deviceFcmToken, deviceId } = getState().data.notifications.generalSettings;	
	await dispatch(updateGeneralNotificationsSettings({isOn, deviceFcmToken, deviceId}));	
	return null;
    };
}
