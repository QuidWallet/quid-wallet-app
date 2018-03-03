import { changeAppRoot } from 'quid-wallet/app/actions/app';
import { updateTokensList } from 'quid-wallet/app/actions/app';


function configureStore(store) {  
    return () => {
	const state = store.getState();		

	// sync tokens list with remote repo
	const TOKENS_VERSION_URL = "https://raw.githubusercontent.com/QuidWallet/erc20-tokens-list/master/result/tokens/version.json";
	const TOKENS_LIST_URL = "https://raw.githubusercontent.com/QuidWallet/erc20-tokens-list/master/result/tokens/tokens.json";
	const localTokensListVersion = state.config.tokens.version;

	
	// check if version has changed since last sync
	fetch(TOKENS_VERSION_URL)
	    .then(res => res.json())
	    .then(data => {
		if (data.version > localTokensListVersion) {
		    // tokens list needs to be updated
		    fetch(TOKENS_LIST_URL).then(res => res.json())
			.then(newTokensData => {
			    if (newTokensData.tokens) {
				store.dispatch(updateTokensList(newTokensData));
			    }
			}).catch(() => {
			    // pass network errors
			});
		}
	    }).catch(() => {
		// pass network errors
	    });

		  
	// set root screen (add wallet screen or home screen with tabs)
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
