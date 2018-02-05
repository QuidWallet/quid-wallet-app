import { Navigation } from 'react-native-navigation';
import ethplorerService from 'quid-wallet/app/services/ethplorerApiService';
import { changeAppRoot } from 'quid-wallet/app/actions/app';
import { getWallets } from 'quid-wallet/app/data/selectors';
import FabricService from 'quid-wallet/app/services/FabricService';


export const actions = {
    FETCHING_ADDRESS_ASSETS: 'FETCHING_ADDRESS_ASSETS',
    GOT_ADDRESS_ASSETS: 'GOT_ADDRESS_ASSETS',
    
    LINK_WATCH_WALLET: 'LINK_WATCH_WALLET',
    UNLINK_WALLET: 'UNLINK_WALLET',

    SELECT_WALLET: 'SELECT_WALLET',
    STOP_REFRESHER: 'STOP_REFRESHER'
};


export const fetchAddressAssets = (address) => {
    return ((dispatch) => {
	return new Promise((resolve, reject) => {
	    dispatch({type: actions.FETCHING_ADDRESS_ASSETS});

	    ethplorerService.getAddressAssets(address).then((data) => {
		const payload = {};
		payload[address] = data;	    
		dispatch({type: actions.GOT_ADDRESS_ASSETS, payload});
		resolve();
	    }).catch((err) => {
		dispatch({type: actions.STOP_REFRESHER});
		reject(err);
	    });
	});
    });
};


export const selectWallet = (address) => {
    return ((dispatch) => {
	dispatch({
	    type: actions.SELECT_WALLET,
	    payload: { address }
	});
	dispatch(fetchAddressAssets(address));	
    });
};


export const linkWatchWallet  = (address) => {
    return ((dispatch, getState) => {
	address = address.toLowerCase();
	const state = getState();
	const wallets = getWallets(state);

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

	// #fabric-analytics
	const walletCount = wallets.length + 1;
	FabricService.logAddressAdded(walletCount);
	
	
	const icon = chooseIcon(); 
	
	dispatch({
	    type: actions.LINK_WATCH_WALLET,
	    payload: { address, icon } 
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
	
	// 2. unlink wallet
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
