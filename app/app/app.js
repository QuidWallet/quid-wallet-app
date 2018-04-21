import React from 'react';
import { Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import store from './data/store';
import registerScreens from './views/screens';
import ScreenVisibilityListener from './views/screens/ScreenVisibilityListener';
import { selectScreen, stopAllRefreshers } from './actions/app';
import FabricService from 'quid-wallet/app/services/FabricService';

registerScreens(store, Provider);


export default class App extends React.Component {
    constructor(props) {	
	super(props);
	store.subscribe(this.onStoreUpdate.bind(this));	
	this.registerScreenListener();
    }
    
    onStoreUpdate() {
	const state = store.getState();
    	const root = state.appRoot;
    	// handle a root change
    	if (this.currentRoot !== root) {
    	    this.currentRoot = root;
    	    this.startApp(root);
    	}
    }


    registerScreenListener() {
    	const screenDidAppearCallback = ({screen, commandType}) => {
	    // #fabric-analytics  
	    FabricService.logScreenView(screen, commandType);

	    // refresher freeze iOS bug work-around
	    // refresher freezes after resuming screen from background
	    // to fix we dispatch action to stop refresher on screen change
	    if (Platform.OS === "ios"
		&& commandType === "BottomTabSelected"
	       ) {
    		store.dispatch(stopAllRefreshers());
	    }
	    
    	    store.dispatch(selectScreen(screen));
    	};
    	const screenVisibilityListener = new ScreenVisibilityListener(screenDidAppearCallback);
    	screenVisibilityListener.register();
    }

    
    startApp(root) {
	switch (root) {
	case 'AddWallet':
	    Navigation.startSingleScreenApp({
		screen: {
		    screen: 'quidwallet.start.AddWallet', // unique ID registered with Navigation.registerScreen
		    navigatorStyle: {
			orientation: 'portrait',
			screenBackgroundColor: '#242836',
			navBarHidden: true,
		    }, // override the navigator style for the screen, see "Styling the navigator" below (optional)
		    navigatorButtons: {} // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
		},
	    });
	    return;
	case 'HomeTab':

	    Navigation.startTabBasedApp({
		tabs: [
		    {
		    	screen: 'quidwallet.home.wallet.WalletScreen', // unique ID registered with Navigation.registerScreen
		    	label: 'Wallet', 
		    	icon: require('quid-wallet/app/views/assets/icons/tabbar/icon_wallet.png'),
		    },
		    {
		    	screen: 'quidwallet.home.portfolio.PortfolioScreen', // unique ID registered with Navigation.registerScreen
		    	label: 'Portfolio', 
		    	icon: require('quid-wallet/app/views/assets/icons/tabbar/icon_portfolio.png'),
		    }, {
		    	screen: 'quidwallet.home.market.MarketScreen', // unique ID registered with Navigation.registerScreen
		    	label: 'Market', 
		    	icon: require('quid-wallet/app/views/assets/icons/tabbar/market_icon.png'),
		    }
		    
		],
		drawer: { // optional, add this if you want a side menu drawer in your app
		    left: { // optional, define if you want a drawer from the left
			screen: 'quidwallet.home.wallet.WalletScreen.Drawer', // unique ID registered with Navigation.registerScreen
			passProps: {} // simple serializable object that will pass as props to all top screens (optional)
		    },
		    style: { // ( iOS only )
			drawerShadow: false, // optional, add this if you want a side menu drawer shadow
			contentOverlayColor: 'rgba(0,0,0,0.25)', // optional, add this if you want a overlay color when drawer is open
			leftDrawerWidth: 80, // optional, add this if you want a define left drawer width (50=percent)
			rightDrawerWidth: 50, // optional, add this if you want a define right drawer width (50=percent)
			shouldStretchDrawer: false // optional, iOS only with 'MMDrawer' type, whether or not the panning gesture will “hard-stop” at the maximum width for a given drawer side, default : true
		    },
		    type: 'MMDrawer', // optional, iOS only, types: 'TheSideBar', 'MMDrawer' default: 'MMDrawer'
		    animationType: 'slide',
		    disableOpenGesture: true // optional, can the drawer be opened with a swipe instead of button
		},
		tabsStyle: { // optional, add this if you want to style the tab bar beyond the defaults
		    tabBarButtonColor: '#999999', // optional, change the color of the tab icons and text (also unselected). On Android, add this to appStyle
		    tabBarSelectedButtonColor: '#fff', // optional, change the color of the selected tab icon and text (only selected). On Android, add this to appStyle
		    tabBarBackgroundColor: '#242836', // optional, change the background color of the tab bar
		    tabBarTranslucent: false,
		    initialTabIndex: 0, // optional, the default selected bottom tab. Default: 0. On Android, add this to appStyle
		},
		appStyle: {
		    orientation: 'portrait',
		    tabBarButtonColor: '#999999', // optional, change the color of the tab icons and text (also unselected). On Android, add this to appStyle
		    tabBarSelectedButtonColor: '#fff', // optional, change the color of the selected tab icon and text (only selected). On Android, add this to appStyle
		    tabBarBackgroundColor: '#242836', // optional, change the background color of the tab bar
		    initialTabIndex: 0, // optional, the default selected bottom tab. Default: 0. On Android, add this to appStyle
		},
		animationType: 'fade'
	    });
	    return;	    	    
	default:
	    // pass
	}
    }
}
