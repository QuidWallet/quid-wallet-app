import Config from 'react-native-config';

/* 
 Apis for getting transactions from https://etherscan.io/apis#account
 */
const etherscanApiService = function() {
    const API_KEY= Config.ETHERSCAN_API_KEY;
    const URI_HOST = 'https://api.etherscan.io';

    
    function getTransactions({address, startBlock=0, endBlock=99999999}) {
	var url = `${URI_HOST}/api?module=account&action=txlist\
&address=${address}\
&startblock=${startBlock}\
&endblock=${endBlock}\
&sort=desc&apikey=${API_KEY}`;
	return fetch(url)
	    .then((res) => res.json())
	    .then(({result})=> result);
    }
    
    function getInternalTransactions({address, startBlock=0, endBlock=99999999}) {
	var url = `${URI_HOST}/api?module=account&action=txlistinternal\
&address=${address}\
&startblock=${startBlock}\
&endblock=${endBlock}\
&sort=desc&apikey=${API_KEY}`;
	return fetch(url).then((res) => res.json()).then(({result})=> result);
    }

    
    // api
    return {
	getTransactions,
	getInternalTransactions
    };
};


export default etherscanApiService();
