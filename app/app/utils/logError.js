import FabricService from 'quid-wallet/app/services/FabricService';
import { Sentry } from 'react-native-sentry';

const logError = (message, error) => {
    FabricService.logError();
    Sentry.captureException(error);    
}

export default logError;
