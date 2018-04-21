import Config from 'react-native-config';
import axios from 'axios';

/* 
 Apis for setting notifications settings
 */
const NotificationsApiService = function() {
    const URI_HOST =  Config.NOTIFICATION_SERVER_HOST;

    function createOrUpdateAddressSubscription({deviceId, address, isOn}) {
	const url = `${URI_HOST}/api/v1/address-subscription`;
	return axios.post(url, {
	    deviceId,
	    isOn,
	    address
	});
    }
    
    function getSettings({deviceId}) {
	const url = `${URI_HOST}/api/v1/device-subscriptions?deviceId=${deviceId}`;	
	return axios.get(url).then((response) => response.data);
    }

    function updateSettings({deviceId, deviceFcmToken, environment,
			     deviceType, isOn, addresses=[]}) {
	const url = `${URI_HOST}/api/v1/device-subscriptions`;
	return axios.post(url, {
	    deviceId,
	    deviceFcmToken,
	    deviceType,
	    environment,
	    isOn,
	    addresses
	});
    }
    
    
    // api
    return {
	getSettings,
	updateSettings,
	createOrUpdateAddressSubscription
    };
};


export default NotificationsApiService();
