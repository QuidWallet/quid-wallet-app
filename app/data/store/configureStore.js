import { changeAppRoot } from 'quid-wallet/app/actions/app';


function configureStore(store) {  
    return () => {
	const state = store.getState();		
	
	let root;
 	if (state.orm.Wallet.items.length > 0) {
	    root = 'HomeTab';
	} else {
	    root = 'AddWallet';	    
	}

	store.dispatch(changeAppRoot(root));
   };
}

export default configureStore;
