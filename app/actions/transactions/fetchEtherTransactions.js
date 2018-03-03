import web3Service from 'quid-wallet/app/services/web3Service';
import etherscanService from 'quid-wallet/app/services/etherscanApiService';
import { actions } from './actions';

// TODO move to constants.js
const ETHER_ASSET_DUMMY_ADDRESS = '0x000_ether';

// const fetchInternalTranscations = ({lastCheckBlockDct, address, dispatch, curBlockNumber, AssetTransfer}) => {
//     const lastBlockChecked = lastCheckBlockDct[`${ETHER_ASSET_DUMMY_ADDRESS}-INTERNAL`] || 0;

//     etherscanService.getInternalTransactions({
// 	address,
// 	startBlock: lastBlockChecked,
// 	endBlock: curBlockNumber})
// 	.then((transactions) => {
// 	    const transfers = transactions.map(tx => {
// 		const direction = (tx.from === address) ? 'OUT' : 'IN';
// 		const counterpartyAddress = (direction === 'IN') ? tx.from : tx.to;
// 		const rawValue = tx.value;
// 		const value = displayBigNumber(rawValue, 18);
// 		const params = {
// 		    txHash: tx.hash,
// 		    address,
// 		    tokenAddress: ETHER_ASSET_DUMMY_ADDRESS,
// 		    timestamp: tx.timeStamp,
// 		    blockNumber: tx.blockNumber,
// 		    counterpartyAddress,
// 		    direction,
// 		    value,
// 		    rawValue,
// 		    status: (1 - tx.isError)
// 		};
		
// 		const transfer = AssetTransfer.createFromParams(params);
// 		return transfer;
// 	    });
	    
// 	    dispatch({type: actions.CREATE_ASSET_TRANSFERS, payload: transfers});
// 	    dispatch({type: actions.GOT_TOKEN_TRANSACTIONS, payload: {
// 		address,
// 		tokenAddress: ETHER_ASSET_DUMMY_ADDRESS,
// 		blockNumber: curBlockNumber,
// 		direction: 'INTERNAL'
// 	    }});
// 	});
// };


export const fetchEtherTransactions = (address) => {
    return ((dispatch, getState) => {
	dispatch({type: actions.FETCHING_TOKEN_TRANSACTIONS, payload: {address, tokenAddress: ETHER_ASSET_DUMMY_ADDRESS}});
	
	const state = getState();
	const web3 = web3Service.getWeb3();
	const lastCheckBlockDct = (state.data.lastBlockNumberCheck[address] || {});
	const lastBlockChecked = lastCheckBlockDct[`${ETHER_ASSET_DUMMY_ADDRESS}-IN&OUT`] || 0;
	
	// get current block number
	return web3.eth.getBlockNumberPromise().then(curBlockNumber => {
	    return etherscanService.getTransactions({
		address,
		startBlock: lastBlockChecked,
		endBlock: curBlockNumber})
		.then((transfers) => {
		    dispatch({type: actions.CREATE_ASSET_TRANSFERS, payload: transfers});
		    dispatch({type: actions.GOT_TOKEN_TRANSACTIONS, payload: {
			address,
			tokenAddress: ETHER_ASSET_DUMMY_ADDRESS,
			blockNumber: curBlockNumber,
			direction: 'IN&OUT'
		    }});		
		});
	});
    });
}
					     
