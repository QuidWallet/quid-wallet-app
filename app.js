import { Platform } from 'react-native';
import { Sentry } from 'react-native-sentry';
import Config from 'react-native-config';
import './shim';
import App from './app/app';



// Reactotron only in DEV mode
if (__DEV__) {
    require('./ReactotronConfig');
}

// skip sentrio in dev mode
let sentryDsn;
if (Platform.OS === "android") {	
    sentryDsn = Config.SENTRY_DSN_ANDROID;
    if (sentryDsn && sentryDsn.length > 2) { 
	Sentry.config(sentryDsn).install();
    }
} else if (Platform.OS === "ios") {
    sentryDsn = Config.SENTRY_DSN_IOS;
    if (sentryDsn && sentryDsn.length > 2) { 	
	Sentry.config(sentryDsn).install();
    }
} else {
    // console.log("No sentry is loaded");
}


const app = new App();
