import { combineReducers } from 'redux';
import {
    addressTokens,
    activeAddress,
    lastBlockNumberCheck,
    displayTokensWalletSettings
} from './addressReducer';

import { activeCurrencies } from './currency';
import { balanceHidden } from './balanceHidden';
import { favoriteTokens } from './favoriteTokens';
import notifications from './notifications';

export default combineReducers({
    addressTokens,
    displayTokensWalletSettings,
    activeAddress,
    lastBlockNumberCheck,
    activeCurrencies,
    balanceHidden,
    favoriteTokens,
    notifications
});
