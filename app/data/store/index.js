import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistCombineReducers, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducers from 'quid-wallet/app/data/reducers';
import createConfigStoreFunc from './configureStore';


const enhancers = compose(applyMiddleware(thunk));
const persistConfig = {
    storage,
    whitelist: ['data', 'orm', 'marketData'],
    version: 0,
    keyPrefix: 'QUID_v01',
    key: 'primary'
};


const persistedReducer = persistCombineReducers(persistConfig, reducers);
const store = createStore(persistedReducer, undefined, enhancers);


const configureStoreFunc = createConfigStoreFunc(store);
persistStore(store, null, configureStoreFunc);


export default store;
