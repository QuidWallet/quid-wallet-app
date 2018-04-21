import { actions } from './../actions';
import { getWallets } from 'quid-wallet/app/data/selectors';
import { Navigation } from 'react-native-navigation';
import { changeAppRoot } from 'quid-wallet/app/actions/app';
import FabricService from 'quid-wallet/app/services/FabricService';
import { selectWallet } from './selectWallet';
import web3Service from 'quid-wallet/app/services/web3Service';
import { updateAddressSubscription } from 'quid-wallet/app/actions/notifications';


export const addWallet  = ({address='', walletType, keystore, name}) => {
    return ((dispatch, getState) => {
	address = address.toLowerCase();

	// check length of address
	if (address.length !== 42) {
	    throw new Error('Address should be 42 symbols long');
	}

	// check format of the address
	const web3 = web3Service.getWeb3();
	if (!web3.isAddress(address)) {
	    throw new Error("Wrong Ethereum address format.");
	}
	
	const state = getState();
	const wallets = getWallets(state);

	// check that wallet doesn't exists yet
	if (wallets.filter(wallet => wallet.address === address).length > 0) {
	    throw new Error('This address is already added.');
	}

	
	function chooseIcon() {
	    const dct = {};
	    const icons = ['crab', 'deer', 'dog',
			   'fox', 'gorilla', 'turtle'];
	    
	    
	    wallets.map((wallet) => {
		dct[wallet.icon] = 1;
	    });

	    // choose from icons not in use 
	    const chooseSet = icons.filter(icon => dct[icon] !== 1);
	    return chooseSet[Math.floor(Math.random() * chooseSet.length)];	    
	}
	const icon = chooseIcon();
	
	// #fabric-analytics
	const walletCount = wallets.length + 1;
	FabricService.logAddressAdded(walletCount);

	
	// subscribe added address for notifications
	// (if notifications are allowed)
	const { isOn } = state.data.notifications.generalSettings;
	if (isOn) { 
	    dispatch(updateAddressSubscription({
		address,
		isOn: true
	    }));
	};

	
	dispatch({
	    type: actions.ADD_WALLET,
	    payload: { address, icon, name,
		       walletType, keystore } 
	});
	
	// redirect after linking
	// if first wallet address redirect to TabBasedApp
	// else redirect via deep link
	if (wallets.length < 1) {
	    dispatch(changeAppRoot('HomeTab'));
	} else {
	    dispatch(selectWallet(address));

	    Navigation.dismissAllModals({
		animationType: 'none' 
	    });
	}			     
    });
};    
