import { getActiveDisplayCurrencies } from 'quid-wallet/app/data/selectors';
import { fetchMarketData } from './market';
var Fabric = require('react-native-fabric');
var { Answers } = Fabric;


export const actions = {
    TOGGLE_CURRENCY: 'TOGGLE_CURRENCY',
    CHANGE_CURRENCY: 'CHANGE_CURRENCY',
};


export const toggleCurrency = (payload) => {
    return (dispatch, getState) => {
	const state = getState();
	const currency = payload;	
	const activeCurrencies = getActiveDisplayCurrencies(state);
	const addingCurrency = !activeCurrencies.includes(currency) ;
	
	// FABRIC ANALYTICS
	let toggleAction, updateCountNumber;
	if (addingCurrency) {
	    toggleAction = 'ADD';
	    updateCountNumber = 1;
	} else {
	    toggleAction = 'REMOVE';
	    updateCountNumber = -1;	    
	}
	
	const logDetails  = {
	    ACTION_TYPE: 'TOGGLE_CURRENCY',
	    currency: currency,
	    currenciesCount: (activeCurrencies.length + updateCountNumber),
	    toggleAction
	};
	Answers.logCustom('ACTION', logDetails);	
	
	dispatch({
	    type: actions.TOGGLE_CURRENCY,
	    payload
	});
	
	// GETTING MARKET DATA 
	if (addingCurrency) {
	    // if enabling currency	    
	    // TODO optimize network request
	    dispatch(fetchMarketData(payload));
	}
    };
};


export const changeCurrency = () => {
    return (dispatch, getState) => {
	// FABRIC ANALYTICS
	const state = getState();
	const activeCurrencies = getActiveDisplayCurrencies(state);
	const [nextCurrency] = activeCurrencies.slice(-1);
	const screen = state.activeScreenId;
	const logDetails  = {
	    ACTION_TYPE: 'CURRENCY_CHANGE',
	    currency: nextCurrency,
	    screen
	};	
	Answers.logCustom('ACTION', logDetails);
	
	dispatch({type: actions.CHANGE_CURRENCY});
    };
};
