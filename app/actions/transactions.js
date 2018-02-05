import etherscanService from 'quid-wallet/app/services/etherscanApiService';
import web3Service from 'quid-wallet/app/services/web3Service';
import { displayBigNumber } from 'quid-wallet/app/utils';
import { schema } from 'quid-wallet/app/data/reducers/models';
import { tokens as TOKENS_DCT } from 'quid-wallet/app/data/config/tokens';

// TODO move to constants.js
const ETHER_ASSET_DUMMY_ADDRESS = '0x000_ether';


export const actions = {
    FETCHING_TOKEN_TRANSACTIONS: 'FETCHING_TOKEN_TRANSACTIONS',
    GOT_TOKEN_TRANSACTIONS: 'GOT_TOKEN_TRANSACTIONS',

    CREATE_ASSET_TRANSFERS: 'CREATE_ASSET_TRANSFERS',
    DELETE_ASSET_TRANSFER: 'DELETE__ASSET_TRANSFER',

    CREATE_PRICE_HISTORICAL: 'CREATE_PRICE_HISTORICAL',
    STOP_SPINNER: 'TRANSCTIONS_STOP_SPINNER'
};


const fetchInternalTranscations = ({lastCheckBlockDct, address, dispatch, curBlockNumber, AssetTransfer}) => {
    const lastBlockChecked = lastCheckBlockDct[`${ETHER_ASSET_DUMMY_ADDRESS}-INTERNAL`] || 0;

    etherscanService.getInternalTransactions({
	address,
	startBlock: lastBlockChecked,
	endBlock: curBlockNumber})
	.then((transactions) => {
	    const transfers = transactions.map(tx => {
		const direction = (tx.from === address) ? 'OUT' : 'IN';
		const counterpartyAddress = (direction === 'IN') ? tx.from : tx.to;
		const rawValue = tx.value;
		const value = displayBigNumber(rawValue, 18);
		const params = {
		    txHash: tx.hash,
		    address,
		    tokenAddress: ETHER_ASSET_DUMMY_ADDRESS,
		    timestamp: tx.timeStamp,
		    blockNumber: tx.blockNumber,
		    counterpartyAddress,
		    direction,
		    value,
		    rawValue,
		    status: (1 - tx.isError)
		};
		
		const transfer = AssetTransfer.createFromParams(params);
		return transfer;
	    });
	    
	    dispatch({type: actions.CREATE_ASSET_TRANSFERS, payload: transfers});
	    dispatch({type: actions.GOT_TOKEN_TRANSACTIONS, payload: {
		address,
		tokenAddress: ETHER_ASSET_DUMMY_ADDRESS,
		blockNumber: curBlockNumber,
		direction: 'INTERNAL'
	    }});
	});
};


const fetchEtherTranscations = ({lastCheckBlockDct, address, dispatch, curBlockNumber, AssetTransfer}) => {
    const lastBlockChecked = lastCheckBlockDct[`${ETHER_ASSET_DUMMY_ADDRESS}-IN&OUT`] || 0;

    etherscanService.getTransactions({
	address,
	startBlock: lastBlockChecked,
	endBlock: curBlockNumber})
	.then((transactions) => {
	    const transfers = transactions.map(tx => {
		const direction = (tx.from.toLowerCase() === address.toLowerCase()) ? 'OUT' : 'IN';
		const counterpartyAddress = (direction === 'IN') ? tx.from : tx.to;
		const rawValue = tx.value;
		const value = displayBigNumber(rawValue, 18);
		const params = {
		    txHash: tx.hash,
		    address,
		    tokenAddress: ETHER_ASSET_DUMMY_ADDRESS,
		    timestamp: tx.timeStamp,
		    blockNumber: tx.blockNumber,
		    counterpartyAddress,
		    direction,
		    value,
		    rawValue,
		    status: (1-tx.isError)
		};
		
		const transfer = AssetTransfer.createFromParams(params);
		return transfer;
	    });
	    
	    dispatch({type: actions.CREATE_ASSET_TRANSFERS, payload: transfers});
	    dispatch({type: actions.GOT_TOKEN_TRANSACTIONS, payload: {
		address,
		tokenAddress: ETHER_ASSET_DUMMY_ADDRESS,
		blockNumber: curBlockNumber,
		direction: 'IN&OUT'
	    }});
	});  
};


const fetchERC20TokenTransactions = (({
    state, dispatch, address,
    tokenAddr, curBlockNumber, AssetTransfer, web3}) => {
	const asset = TOKENS_DCT[tokenAddr];
		
	const createTokenTransfers = (err, txs, direction) => {
	    if (!err) {
		const txPromises = txs.map((tx) => {
		    return web3.eth.getBlockPromise(tx.blockNumber)
			.then((block) => {
			    const counterpartyAddress = (direction === 'IN') ? tx.args._from : tx.args._to;
			    const rawValue = tx.args._value;
			    const value = displayBigNumber(rawValue, asset.decimals || 18);
			    const params = {
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
			    
			    const transfer = AssetTransfer.createFromParams(params);
			    return transfer;
			});		    
		});
		
		Promise.all(txPromises).then((transfers) => {
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
	const session = schema.session(state.orm);
	const lastCheckBlockDct = (state.data.lastBlockNumberCheck[address] || {});
	const AssetTransfer = session.AssetTransfer;
	
	// get current block number
	web3.eth.getBlockNumberPromise().then(curBlockNumber => {
	    // if ether
	    if (tokenAddr === ETHER_ASSET_DUMMY_ADDRESS) {
		fetchEtherTranscations({lastCheckBlockDct, address, dispatch, curBlockNumber, AssetTransfer});
		fetchInternalTranscations({lastCheckBlockDct, address, dispatch, curBlockNumber, AssetTransfer});
	    } else {
		// if erc20 token
		fetchERC20TokenTransactions({
		    state,
		    lastCheckBlockDct,
		    address,
		    dispatch,
		    curBlockNumber,
		    AssetTransfer,
		    tokenAddr,
		    web3
		});
	    }			   	    	    
	});
    });
};


export const deleteTransaction = (payload) => {
    return {
	type: actions.DELETE_ASSET_TRANSFER,
	payload
    };
};


