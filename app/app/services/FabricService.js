import { Platform } from 'react-native';
const Fabric = require('react-native-fabric');
const { Answers, Crashlytics } = Fabric;


/* 
 Service gathering app usage stats for better UX analytics.
 No sensitive information such as user addressess is gathered. 
 */
const FabricService = () => {
    /**
     * Sends screen view action to Fabric 
     *
     * @param screen {String} Screen id
     * @param commandType {String} Command type e.g 'Modal', 'Push'
     */
    const logScreenView = (screen, commandType) => {
	const contentName = 'Screen visible';
	const contentType = 'SCREEN';
	const contentId = screen; 
	Answers.logContentView(contentName, contentType, contentId, {commandType, screen });
    }

    /**
     * Sends remove or add favorite token action to Fabric 
     *     
     * @param symbol {String} Token symbol ('ETH', 'ZRX', etc)
     * @param favoriteTokensCount {Integer} Count of favorite tokens added by user
     * @param toggleAction {String} toggle action type: 'REMOVE' or 'ADD'
     */
    const logFavoriteTokenToggled = (symbol, favoriteTokensCount, toggleAction) => {
	const logDetails  = {
	    ACTION_TYPE: 'TOGGLE_FAVORITE_TOKEN',
	    symbol,
	    favoriteTokensCount,
	    toggleAction
	};
	Answers.logCustom('ACTION', logDetails);
    };
    
    
    /**
     * Registers opening or hiding balances action
     *     
     * @param hidden {Boolean} Are balances hidden (True or False)
     * @param screen {String} Screen id
     */
    const logHiddenBalanceToggled = (hidden, screen) => {
	const logDetails  = {
	    ACTION_TYPE: 'TOGGLE_HIDDEN_BALANCE',
	    hidden,
	    screen
	};
	Answers.logCustom('ACTION', logDetails);
    };    


    /**
     * Registers adding or removing display currency event
     *     
     * @param currency {String} Currency code (e.g. 'USD', 'EUR')
     * @param currenciesCount {Integer} How many currencies user has added
     * @param toggleAction {String} toggle action type: 'REMOVE' or 'ADD'
     */
    const logCurrencyToggled = (currency, currenciesCount, toggleAction) => {
	const logDetails  = {
	    ACTION_TYPE: 'TOGGLE_CURRENCY',
	    currency,
	    currenciesCount,
	    toggleAction
	};
	Answers.logCustom('ACTION', logDetails);
    };    
    
    
    /**
     * Registers changing display currency event
     *     
     * @param currency {String} Currency code (e.g. 'USD', 'EUR')
     * @param screen {String} Screen id
     */
    const logCurrencyChanged = (currency, screen) => {
	const logDetails  = {
	    ACTION_TYPE: 'CURRENCY_CHANGE',
	    currency,
	    screen
	};	
	Answers.logCustom('ACTION', logDetails);
    };    


    /**
     * Registers adding new address event
     *     
     * @param walletCount {Integer} How many wallets user has added
     */
    const logAddressAdded = (walletCount) => {
	Answers.logLogin('WATCH_WALLET', // wallet type
			 true, // successfully logged in 
			 { walletCount });
    };    

    
    /**
     * Registers failed try adding new address
     *     
     * @param inputLength {Integer} Length of wrong input
     */
    const logAddingAddressFailed = (inputLength) => {
	Answers.logLogin("WATCH_WALLET", // wallet type
			 false, // log in success?
			 { inputLength });
    };    


    /**
     * Registers stop watching address event
     *     
     * @param walletsLeftCount {Integer} How many wallets user have after unlink event
     */
    const logAddressUnlinked = (walletsLeftCount) => {
	Answers.logCustom('ACTION', {
	    ACTION_TYPE: 'UNLINK_WALLET',
	    walletsLeftCount
	});
    }		  			 
    
    
    /**
     * Sends search stats on Market Screen to Fabric
     *     
     * @param input {String} String typed in by user
     */
    const logTokenSearchOnMarketScreen = (input) => {
	Answers.logSearch(input, {
	    screen: 'quidwallet.home.exchange.MarketScreen',
	    searchType: "TOKEN"
	});
    }		  			 

    
    /**
     * Sends search stats on Display Currencies Screen to Fabric
     *     
     * @param input {String} String typed in by user
     */
    const logTokenSearchOnDisplayCurrencyScreen = (input) => {
 	Answers.logSearch(input, {
	    screen: 'quidwallet.home.wallet.settings.CurrenciesSettingsScreen',
	    searchType: "CURRENCY"
	});		     
    }		  			 

    
    /**
     * Registers pull refresh event
     *     
     * @param screen {String} Screen id
     */
    const logScreenPullRefreshed = (screen) => {
	Answers.logCustom("REFRESH", {screen });
    }		  			 

    
    /**
     * Registers active wallet change event
     */
    const logWalletChanged = () => {
	Answers.logCustom("ACTION", {
	    ACTION_TYPE: 'CHANGE_WALLET'
	});
    }	  			 

    
    /**
     * Registers active wallet change event
     *     
     * @param symbol {String} Token symbol ('ETH', 'ZRX', etc)
     */
    const logTransactionHistoryViewed = (symbol) => {
	Answers.logContentView(`${symbol} Transactions`, 'Transaction History', `transaction-history-${symbol}`, { asset: symbol });	
    }


    /**
     * Logs error to Fabric Service
     *     
     * @param message {String} Error message to log
     */
    const logError = (message) => {
	switch (Platform.OS) {
	case 'ios':
	    Crashlytics.recordError(message);
	    break;
	case 'android':
	    Crashlytics.logException(message);
	    break;
	default: // pass
	}
    }

    /**
     * Logs notification permission grant
     *     
     * @param granted {Boolean} if permission for notifications are granted (true|false)
     */
    const logNotificationsPermissionGranted = (granted) => {
	Answers.logCustom("NOTIFICATION_PERMISSIONS", {granted});
    }

    
    // api
    return {
	logScreenView,
	logFavoriteTokenToggled,
	logHiddenBalanceToggled,
	logCurrencyToggled,
	logCurrencyChanged,
	logAddressAdded,
	logAddressUnlinked,
	logTokenSearchOnMarketScreen,
	logScreenPullRefreshed,
	logTokenSearchOnDisplayCurrencyScreen,
	logWalletChanged,
	logTransactionHistoryViewed,
	logAddingAddressFailed,
	logError,
	logNotificationsPermissionGranted
    };
};


export default FabricService();
