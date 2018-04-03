import { DISPLAY_CURRENCIES } from 'quid-wallet/app/data/config/displayCurrencies';

export const getActiveWalletAddress = state => state.data.activeAddress;
export const getDisplayCurrencies = () => DISPLAY_CURRENCIES;
export const getActiveDisplayCurrencies = state => state.data.activeCurrencies;
export const getSelectedCurrency = state => state.data.activeCurrencies[0];


