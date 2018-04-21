import { actions } from './../actions';
import { getWallets } from 'quid-wallet/app/data/selectors';
import { Navigation } from 'react-native-navigation';
import { changeAppRoot } from 'quid-wallet/app/actions/app';
import { updateAddressSubscription } from 'quid-wallet/app/actions/notifications';
import FabricService from 'quid-wallet/app/services/FabricService';


export const unlinkWallet = (address) => {
    return ((dispatch, getState) => {
	const wallets = getWallets(getState());
	const otherWallets = wallets.filter(wallet => wallet.address !== address);
	
	// #fabric-analytics
	FabricService.logAddressUnlinked(otherWallets.count);	
	
	// 1. select other wallet
	let newActiveWallet = null;
	if (otherWallets.length > 0) {
	    newActiveWallet = otherWallets[0].address;
	}
	
	dispatch({
	    type: actions.SELECT_WALLET,
	    payload: {address: newActiveWallet}
	});

	// 2. unsubscribe from notifications
	dispatch(updateAddressSubscription({
	    address,
	    isOn: false
	}));	
	
	
	// 3. unlink wallet
	dispatch({
	    type: actions.UNLINK_WALLET,
	    payload: { address }
	});
	
	// if no more wallets, navigate to add wallet screen;
	if (!newActiveWallet) {
	    dispatch(changeAppRoot('AddWallet'));
	} else {
	    // otherwise navigate back to home
	    Navigation.handleDeepLink({
		link: 'popWalletScreenToRoot/',
		payload: {
		    animated: true, 
		    animationType: 'fade'
		}
	    });
	}    
    });
};
