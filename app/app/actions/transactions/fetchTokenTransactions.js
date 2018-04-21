import web3Service from 'quid-wallet/app/services/web3Service';
import { displayBigNumber } from 'quid-wallet/app/utils';
import { getTokensDct } from 'quid-wallet/app/data/selectors';
import { generateAssetTransferId } from 'quid-wallet/app/data/reducers/models/assetTransfer';
import { actions } from './actions';


// create transfer objects from token contract transfer events 
async function _createTokenTransfers({txs, direction, web3,
				      token, address}) {
    const txPromises = txs.map( async tx => {
	const block = await web3.eth.getBlockPromise(tx.blockNumber);
	const counterpartyAddress = (direction === 'IN') ? tx.args._from : tx.args._to;
	const rawValue = tx.args._value;
	const value = displayBigNumber(rawValue, token.decimal);
	const transfer = {
	    txHash: tx.transactionHash,
	    address,
	    tokenAddress: token.contractAddress,
	    timestamp: block.timestamp,
	    blockNumber: tx.blockNumber,
	    counterpartyAddress,
	    direction: direction,
	    value,
	    rawValue,
	    status: 1
	};
	const id = generateAssetTransferId(transfer);
	transfer.id = id;			    
	return transfer;	
    });
    
    return await Promise.all(txPromises);   
};


// fetch direction {IN, OUT} function
async function _fetchTransferDirection({dispatch, state, address,
					curBlockNumber,
					web3, token, direction}) {
    const tokenAddress = token.contractAddress;
    // getting last block number checked
    const lastBlockNumberIn = (state.data.lastBlockNumberCheck[address] || {})[`${tokenAddress}-${direction}`] || 0;
    
    if (lastBlockNumberIn < curBlockNumber) {
	const key = ((direction === "IN") ? "_to" : "_from");
	// get transfer events from blockchain
	const txs = await web3Service.getTokenTransferEvents({
	    tokenAddress,
	    address,
	    fromBlock: lastBlockNumberIn,
	    toBlock: curBlockNumber,
	    key
	});
	
	if (txs && txs.length > 0) {
	    // convert blockchain events to local transfer objects
	    const transfers = await _createTokenTransfers({txs, direction, web3,
						       token, address});
	
	
	    dispatch({type: actions.CREATE_ASSET_TRANSFERS, payload: transfers});
	    dispatch({type: actions.GOT_TOKEN_TRANSACTIONS, payload: {
		address,
		tokenAddress: token.contractAddress,
		blockNumber: curBlockNumber,
		direction
	    }});
	}
    }
}


export const fetchTokenTransactions = (address, tokenAddress) => {
    return async (dispatch, getState) => {
	dispatch({type: actions.FETCHING_TOKEN_TRANSACTIONS, payload: {address, tokenAddress}});
	const state = getState();
	const tokensDct = getTokensDct(state);
	const token = tokensDct[tokenAddress];
	const web3 = web3Service.getWeb3();    
	
	try {
	    // get current block number
	    const curBlockNumber = await web3.eth.getBlockNumberPromise();    

	    await Promise.all([
		// get directions IN
		_fetchTransferDirection({dispatch, state, address,
					 curBlockNumber,
					 web3, token, direction: "IN"}),
		
		
		// get direction OUT
		_fetchTransferDirection({dispatch, state, address,
					 curBlockNumber,
					 web3, token, direction: "OUT"})
	    ]);

	    dispatch({type: actions.STOP_SPINNER});
	} catch(err) {
	    dispatch({type: actions.STOP_SPINNER});
	    throw (err);
	}	
    };
};
