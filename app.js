import { Platform } from 'react-native';
import { Sentry } from 'react-native-sentry';
import Config from 'react-native-config';

import './shim';
import App from './app/app';


// Reactotron only in DEV mode
const perfomanceDebug = true;
if (__DEV__ && !perfomanceDebug) {
    require('./ReactotronConfig');
}

// skip sentrio in dev mode
if (!(__DEV__ || perfomanceDebug)) {
    const sentryDsn = Platform.select({'ios': Config.SENTRY_DSN_IOS,'android': Config.SENTRY_DSN_ANDROID});
    Sentry.config(sentryDsn).install();
}


const app = new App();
