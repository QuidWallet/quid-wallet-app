import firebase from 'react-native-firebase';
import { Platform } from 'react-native';
import { actions } from './actions';
import { updateGeneralNotificationsSettings } from './settings';
import { getWallets } from 'quid-wallet/app/data/selectors';
import logError from 'quid-wallet/app/utils/logError';
import FabricService from 'quid-wallet/app/services/FabricService';


const updateFcmToken = (newFcmToken) => {
    return async (dispatch, getState) => {
	const state = getState();
	const { deviceFcmToken: oldFcmToken, deviceId, isOn, deviceInitedOnServer } = state.data.notifications.generalSettings;
	// if got new token
	if (newFcmToken && newFcmToken !== oldFcmToken) {
	    dispatch({type: actions.UPDATE_FCM_TOKEN, payload: newFcmToken});

	    if (Platform.OS === 'ios') {
		const result = await firebase.messaging().requestPermissions();
		// if notification permisions not granted, don't make request
		if (!(result && result.granted)) {
		    // permissions not granted
		    // stop function execution
		    // #fabric-analytics
		    FabricService.logNotificationsPermissionGranted(false);
		    return null;
		} else {
		    // #fabric-analytics
		    FabricService.logNotificationsPermissionGranted(true);
		}
	    }
	    
	    
	    try {
		if (!deviceInitedOnServer) {
		    // init on server if needed
		    const addresses = getWallets(state).map(w => w.address);
		    await dispatch(updateGeneralNotificationsSettings({
			deviceId,
			deviceFcmToken: newFcmToken,
			isOn: true, // switch on notifications on init
			addresses
		    }));			
		    dispatch({type: actions.DEVICE_INITED_ON_NOTIFICATION_SERVER, payload: true});		    
		} else if (isOn) { // update on server only if device is on
		    await dispatch(updateGeneralNotificationsSettings({
			deviceId,
			deviceFcmToken: newFcmToken,
			isOn
		    }));
		}
	    } catch (err) {
		// logging error
		logError("Notifications: Error while updating FCM token", err);
	    }	    
	}
    };
}


const _handleNotificationsInForeground = () => {
    firebase.messaging().onMessage((params) => {
	// don't re-send local notification
	if (!params.local_notification) {
	    if (Platform.OS === 'ios' &&
		params.aps &&
		params.aps.alert &&
		params.aps.alert.body) {
		firebase.messaging().createLocalNotification({
		    title: (params.aps.alert.title || "Notification"),
		    body: params.aps.alert.body,
		    sound: "default",
		    priority: "high",
		    click_action: "ACTION",
		    icon: "ic_launcher",
		    show_in_foreground: true
		});
	    } else if (params.fcm && params.fcm.body) {  // if android
		firebase.messaging().createLocalNotification({
		    title: (params.fcm.title || "Notification"),
		    body: params.fcm.body,
		    sound: "default",
		    priority: "high",
		    click_action: "ACTION",
		    icon: "ic_launcher",
		    show_in_foreground: true
		});		
	    }
	}
    });
}


export const initPushNotifications = () => {
    return (dispatch, getState) => {
	
	// On app start up, if: 
	// 1) ios and permissions granted or android
	// 2) and flag of server inited (state.data.notifications.generalSettings.deviceInitedOnServer) is True
	// Initialisation request is made	
	const _onFcmTokenReceive = async (token) => {	    
	    dispatch(updateFcmToken(token));
	};
	firebase.messaging().getToken().then(_onFcmTokenReceive);	
	firebase.messaging().onTokenRefresh(_onFcmTokenReceive);

	
	// handle notification when app is in foreground
	_handleNotificationsInForeground();
    };
}
