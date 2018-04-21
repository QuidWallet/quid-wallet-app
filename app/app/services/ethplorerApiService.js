import Config from 'react-native-config';
import { displayBigNumber } from 'quid-wallet/app/utils';


/* 
 Apis to get information about Ethereum tokens, contracts, transactions and custom structures.
 https://github.com/EverexIO/Ethplorer/wiki/Ethplorer-API
 */
const ethplorerService = function() {
    const URI_HOST = Config.ETHPLORER_API_HOST;
    const API_KEY= Config.ETHPLORER_API_KEY;
    
    function getAddressAssets(address) {
	var url = `${URI_HOST}/getAddressInfo/${address}?apiKey=${API_KEY}`;
	return fetch(url).then((res) => res.json());
    }
    
    // api
    return {
	getAddressAssets,
    };
};


export default ethplorerService();
