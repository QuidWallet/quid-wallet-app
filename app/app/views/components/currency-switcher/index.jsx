import { connect } from 'react-redux';
import { Platform } from 'react-native';
import { changeCurrency } from 'quid-wallet/app/actions/currency';
import { getActiveWallet } from 'quid-wallet/app/data/selectors';
import { getWalletIconSmall } from 'quid-wallet/app/utils/getWalletIcon';


const wrapWithCurrencySwitcherInNavBar = (Screen, withDrawer=false, screenId, withNavigationBar=true) => {
    const navigatorButtons = withNavigationBar ? {
	rightButtons: [{
	    id: 'SWITCH_CURRENCY',		    
	    component: 'quidwallet.components.CurrencySwitcherIcon',
	    passProps: {
		stylesButton: {
		    ...Platform.select({
			android: {
			    paddingTop: 10
			}, ios: {
			    paddingTop: 5
			}
		    })
		},
		stylesContainer: {
		    height: 50,			    
		    ...Platform.select({
			android: {
			    width: 70,
			},			
		    })
		}
	    },	    
	}]
    } : [];
   
    
    class ScreenWithCurrencySwitcher extends Screen {
	static navigatorButtons = navigatorButtons;	    
	constructor(props) {
	    super(props);
	    // if you want to listen on navigator events, set this up
	    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));	    
	}
	
	setWalletIcon(props) {
	    const iconAnimal = props.activeWallet.icon;
	    const newIcon = getWalletIconSmall(iconAnimal);
	    const leftButtons = [{
		icon: newIcon,
		id: 'walletIcon', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
		disableIconTint: true,
	    }];

	    props.navigator.setButtons({
		leftButtons, // see "Adding buttons to the navigator" below for format (optional)
		animated: false // does the change have transition animation or does it happen immediately (optional)
	    });
	}
	
	
	onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
	    if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
		if (event.id === 'SWITCH_CURRENCY') {
		    this.props.changeCurrency();
		}

		
		if (event.id === 'walletIcon') {
		    this.props.navigator.toggleDrawer({
			side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
			animated: true, // does the toggle have transition animation or does it happen immediately (optional)
		    });   
		}		
	    }
	    
	    
	    if (event.type === "ScreenChangedEvent") {
		// Enabling Drawer only on Home Wallet Screen
		if (withDrawer) {
		    if (event.id === "willAppear" || event.id === "didAppear") {
			this.props.navigator.setDrawerEnabled({
			    side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
			    enabled: true // should the drawer be enabled or disabled (locked closed)
			});
		    };
		    
		    if (event.id === "willDisappear") {
			// close drawer
			this.props.navigator.toggleDrawer({
			    side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
			    animated: true, // does the toggle have transition animation or does it happen immediately (optional)
			    to: 'closed' // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
			});

			// disable drawer
			this.props.navigator.setDrawerEnabled({
			    side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
			    enabled: false // should the drawer be enabled or disabled (locked closed)
			});
		    };		    
		}
	    }

	    if (event.type === 'DeepLink') {
	    	const eventRoot = event.link.split('/')[0]; // Link parts
	    	const payload = event.payload; // (optional) The payload

	    	switch (eventRoot) {
	    	case 'popWalletScreenToRoot':
	    	    if (screenId === 'WalletScreen') {
	    		// pop to root if not on root already
	    		this.props.navigator.popToRoot(payload);
	    	    }
	    	    break;
	    	}
	    }
	}
    }

    
    const mapStateToProps = (state) => ({
	activeWallet: getActiveWallet(state)
    });
    return connect(mapStateToProps, {
    	changeCurrency
    })(ScreenWithCurrencySwitcher);    
}


export default wrapWithCurrencySwitcherInNavBar;
