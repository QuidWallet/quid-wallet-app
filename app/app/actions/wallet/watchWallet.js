import { addWallet } from './common';

export const linkWatchWallet = (address) => {
    return ((dispatch, getState) => {
	const payload = {
	    address,
	    name: ('Watch ' + address),
	    walletType: 'WATCH_WALLET',
	    keystore: null
	};

	dispatch(addWallet(payload));
    });
}

