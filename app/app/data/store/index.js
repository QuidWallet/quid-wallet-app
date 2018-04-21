import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import { AsyncStorage } from 'react-native';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducers from 'quid-wallet/app/data/reducers';
import createConfigStoreFunc from './configureStore';


const enhancers = compose(applyMiddleware(thunk));
const createPersistConfig = (key, version=0) => ({
    storage,
    version,
    keyPrefix: 'QUID_v01_',
    key,
    debug: true, 
    migrate: (state) => {
	// don't migrate if already migated or migration not needed
	if ((state && state._persist && state._persist.version > 0) || version === 0) {
	    return Promise.resolve(state);
	}
	// otherwise migrate from old key
	return new Promise(resolve => {
	    AsyncStorage.getItem("QUID_v01primary")	    
    		.then(value => JSON.parse(value))
		.then(value => {
		    let migratedState;
		    if (value && value[key]) {
			const tempDct = value[key];
			migratedState = JSON.parse(tempDct);
		    } else {
			migratedState = state;
		    }
		    resolve(migratedState);
		});
	});	
    }
});


const persistedReducer = combineReducers({
    ...reducers, 
    data: persistReducer(createPersistConfig('data', 1), reducers.data),
    orm: persistReducer(createPersistConfig('orm', 1), reducers.orm),
    config: persistReducer(createPersistConfig('config', 0), reducers.config),
    marketData: persistReducer(createPersistConfig('marketData', 0), reducers.marketData)
})


const store = createStore(persistedReducer, undefined, enhancers);


const configureStoreFunc = createConfigStoreFunc(store);
persistStore(store, null, configureStoreFunc);


export default store;
