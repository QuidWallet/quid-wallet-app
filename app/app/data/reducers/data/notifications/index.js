import { combineReducers } from 'redux';
import generalSettings from './generalSettings';
import { addresses } from './addresses';

export default combineReducers({
    generalSettings,
    addresses
});
