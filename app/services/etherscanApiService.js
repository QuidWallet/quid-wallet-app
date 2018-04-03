import Config from 'react-native-config';
import { displayBigNumber } from 'quid-wallet/app/utils';
import { generateAssetTransferId } from 'quid-wallet/app/data/reducers/models/assetTransfer';

// TODO move to constants.js
const ETHER_ASSET_DUMMY_ADDRESS = '0x000_ether';


/* 
 Apis for getting transactions from https://etherscan.io/apis#account
 */
const etherscanApiService = function() {
    const API_KEY= Config.ETHERSCAN_API_KEY;
    const URI_HOST = Config.ETHERSCAN_API_HOST;
    
    function getTransactions({address, startBlock=0, endBlock=99999999, page=1, offset=50}) {
	const url = `${URI_HOST}/api?module=account&action=txlist\
&address=${address}\
&startblock=${startBlock}\
&page=${page}
&endblock=${endBlock}\\
&offset=${offset}\
&sort=desc&apikey=${API_KEY}`;
	
	return fetch(url)
	    .then((res) => res.json())
	    .then(({result})=> result).then(transactions => {
		const transfers = (transactions||[]).map(tx => {
		    const direction = (tx.from.toLowerCase() === address.toLowerCase()) ? 'OUT' : 'IN';
		    const counterpartyAddress = (direction === 'IN') ? tx.from : tx.to;
		    const rawValue = tx.value;
		    const value = displayBigNumber(rawValue, 18);
		    // tx receipt status is empty for old transactions
		    // txreceipt status if success - 1, error - 0
		    const txreceipt_status = ((tx.txreceipt_status === "") ? 1 : parseInt(tx.txreceipt_status));
		    
		    const transfer = {
			txHash: tx.hash,
			address,
			tokenAddress: ETHER_ASSET_DUMMY_ADDRESS,
			timestamp: tx.timeStamp,
			blockNumber: tx.blockNumber,
			counterpartyAddress,
			direction,
			value,
			rawValue,
			isPending: false,
			status: (txreceipt_status - tx.isError) // success - 1, error - 0
		    };
		    const id = generateAssetTransferId(transfer);
		    transfer.id = id;			    
		    return transfer;
		});;
		return transfers;
	    });
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
