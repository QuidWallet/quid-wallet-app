import Config from 'react-native-config';
import { displayBigNumber } from 'quid-wallet/app/utils';


/* 
 Apis to get information about Ethereum tokens, contracts, transactions and custom structures.
 https://github.com/EverexIO/Ethplorer/wiki/Ethplorer-API
 */
const ethplorerService = function() {
    const URI_HOST = 'https://api.ethplorer.io';
    	const API_KEY= Config.ETHPLORER_API_KEY;
    
    function getAddressAssets(address) {
	var url = `${URI_HOST}/getAddressInfo/${address}?apiKey=${API_KEY}`;
	return fetch(url).then((res) => res.json()).then((data) => {
	    const assets = {};

	    data.tokens && data.tokens.map((token) => {
		const balance = displayBigNumber(token.balance, token.tokenInfo.decimals);

		assets[token.tokenInfo.symbol] = {
		    balance: balance,
		    rawBalance: token.balance,
		    address: token.tokenInfo.address,
		    decimals: token.tokenInfo.decimals
		};
	    });

	    // add ether balance
	    assets['ETH'] = {
		balance: data.ETH.balance,
		rawBalance: data.ETH.balance,
		address: '0x000_ether', // TODO move to constants.js
		decimals: 18
	    };
	    
	    return assets;
	});
    }
    
    // api
    return {
	getAddressAssets,
    };
};


export default ethplorerService();
