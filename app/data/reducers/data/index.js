import { combineReducers } from 'redux';
import { addressAssets, activeAddress, lastBlockNumberCheck } from './addressReducer';
import { activeCurrencies } from './currency';
import { balanceHidden } from './balanceHidden';
import { favoriteTokens } from './favoriteTokens';


export default combineReducers({
    addressAssets,
    activeAddress,
    lastBlockNumberCheck,
    activeCurrencies,
    balanceHidden,
    favoriteTokens
});
