import web3Service from 'quid-wallet/app/services/web3Service';
import { displayBigNumber } from 'quid-wallet/app/utils';
import { getTokensDct } from 'quid-wallet/app/data/selectors';
import { generateAssetTransferId } from 'quid-wallet/app/data/reducers/models/assetTransfer';
import { actions } from './actions';


const _fetchERC20TokenTransactions = (({
    state, dispatch, address,
    tokenAddr, curBlockNumber, web3}) => {
	const tokensDct = getTokensDct(state);
	const asset = tokensDct[tokenAddr];
	
	const createTokenTransfers = (err, txs, direction) => {
	    if (!err) {
		const txPromises = txs.map((tx) => {
		    return web3.eth.getBlockPromise(tx.blockNumber)
			.then((block) => {
			    const counterpartyAddress = (direction === 'IN') ? tx.args._from : tx.args._to;
			    const rawValue = tx.args._value;
			    const value = displayBigNumber(rawValue, asset.decimal);
			    const transfer = {
				txHash: tx.transactionHash,
				address,
				tokenAddress: tokenAddr,
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
		});
		
		return Promise.all(txPromises).then((transfers) => {
		    dispatch({type: actions.CREATE_ASSET_TRANSFERS, payload: transfers});
		    dispatch({type: actions.GOT_TOKEN_TRANSACTIONS, payload: {
			address,
			tokenAddress: tokenAddr,
			blockNumber: curBlockNumber,
			direction
		    }});
		});		
	    }	    
	};

	// getting last block number checked
	const lastBlockNumberIn = (state.data.lastBlockNumberCheck[address] || {})[`${tokenAddr}-IN`] || 0;
	const lastBlockNumberOut = (state.data.lastBlockNumberCheck[address] || {})[`${tokenAddr}-OUT`] || 0;

	// incoming transfers
	
	if (lastBlockNumberIn < curBlockNumber) {
	    const transferEventIn = web3Service.incomingTokenTransferEvents({
		tokenAddr,
		address,
		fromBlock: lastBlockNumberIn,
		toBlock: curBlockNumber
	    });
	    transferEventIn.get((err, tx) => createTokenTransfers(err, tx, 'IN'));	    
	}	
	
	// outgoing transfers
	if (lastBlockNumberOut < curBlockNumber) {
	    const transferEventOut = web3Service.outgoingTokenTransferEvents({
		tokenAddr,
		address,
		fromBlock: lastBlockNumberOut,
		toBlock: curBlockNumber
	    });
	    transferEventOut.get((err, tx) => createTokenTransfers(err, tx, 'OUT'));
	}

	// dispatch event to stop spinner 
	if (lastBlockNumberIn === curBlockNumber && lastBlockNumberOut === curBlockNumber) {
	    dispatch({type: actions.STOP_SPINNER, payload: {address, tokenAddress: tokenAddr}});
	}
    });


export const fetchTokenTransactions = (address, tokenAddr) => {
    return ((dispatch, getState) => {
	dispatch({type: actions.FETCHING_TOKEN_TRANSACTIONS, payload: {address, tokenAddress: tokenAddr}});
	
	const state = getState();
	const web3 = web3Service.getWeb3();
	const lastCheckBlockDct = (state.data.lastBlockNumberCheck[address] || {});
	
	// get current block number
	web3.eth.getBlockNumberPromise().then(curBlockNumber => {
	    // if erc20 token
	    return _fetchERC20TokenTransactions({
		state,
		lastCheckBlockDct,
		address,
		dispatch,
		curBlockNumber,
		tokenAddr,
		web3
	    });
	});
    });
};
