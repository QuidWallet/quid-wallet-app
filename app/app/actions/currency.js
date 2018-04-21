import { getActiveDisplayCurrencies } from 'quid-wallet/app/data/selectors';
import { fetchMarketData } from './market';
import FabricService from 'quid-wallet/app/services/FabricService';


export const actions = {
    TOGGLE_CURRENCY: 'TOGGLE_CURRENCY',
    CHANGE_CURRENCY: 'CHANGE_CURRENCY',
};


export const toggleCurrency = (payload) => {
    return (dispatch, getState) => {
	const state = getState();
	const currency = payload;	
	const activeCurrencies = getActiveDisplayCurrencies(state);
	const addingCurrency = !activeCurrencies.includes(currency);
	
	// #fabric-analytics
	let toggleAction, updateCountNumber;
	if (addingCurrency) {
	    toggleAction = 'ADD';
	    updateCountNumber = 1;
	} else {
	    toggleAction = 'REMOVE';
	    updateCountNumber = -1;	    
	}
	const currenciesCount = activeCurrencies.length + updateCountNumber;
	FabricService.logCurrencyToggled(currency, currenciesCount, toggleAction);
	
	dispatch({
	    type: actions.TOGGLE_CURRENCY,
	    payload
	});
	
	// GETTING MARKET DATA 
	if (addingCurrency) {
	    // if enabling currency	    
	    // TODO optimize network request
	    dispatch(fetchMarketData());
	}
    };
};


export const changeCurrency = () => {
    return (dispatch, getState) => {
	const state = getState();
	
	// #fabric-analytics
	const activeCurrencies = getActiveDisplayCurrencies(state);
	const [nextCurrency] = activeCurrencies.slice(-1);
	const screen = state.activeScreenId;
	FabricService.logCurrencyChanged(nextCurrency, screen);
	
	dispatch({type: actions.CHANGE_CURRENCY});
    };
};
