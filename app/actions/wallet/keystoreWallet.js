import { addWallet, fetchWalletTokens } from './common';
import { generateOrImportKeystore, sendTx } from 'quid-wallet/app/services/keystoreService';
import { generateAssetTransferId } from 'quid-wallet/app/data/reducers/models/assetTransfer';
import { actions as txActions } from 'quid-wallet/app/actions/transactions/actions';
import { getPendingTxs } from 'quid-wallet/app/data/selectors';
const ETHER_ASSET_DUMMY_ADDRESS = '0x000_ether';
import web3Service from 'quid-wallet/app/services/web3Service';
import { padStringTo32bytes } from 'quid-wallet/app/utils';


export function generateKeystore({ password, confirmPassword, name, privateKey=null}) {
    return async (dispatch, getState) => {
	if (!name) {
	    throw new Error('Please provide a wallet name');
	}
	if (!password || password.length < 6) {
	    throw new Error('Password must be at least 6 characters long');
	}
	if (password !== confirmPassword) {
	    throw new Error('Passwords do not match.');
	}

	const { address, keystore } = await generateOrImportKeystore({password, privateKey});
		
	const payload = {
	    address,
	    name,
	    keystore,
	    walletType: "v3"
	};
	
	dispatch(addWallet(payload));
    };
}


const waitPendingTxForMined = (transfer) => {
    return async (dispatch, getState) => {
	// subscribe to update state of tx
	const web3 = web3Service.getWeb3();
	const tx = await web3.eth.waitForMined(transfer.txHash);
	const block = await web3.eth.getBlockPromise(tx.blockNumber);
	
	// if block is not yet available, set timestamp to now
	const timestamp = (block && block.timestamp) ? block.timestamp : (Date.now()/1000);
	const payload = {
	    blockNumber: tx.blockNumber,
	    transferId: transfer.id,
	    status: web3.toDecimal(tx.status),
	    timestamp
	};			
			
	// check logs if token transfer
	if (transfer.tokenAddress !== ETHER_ASSET_DUMMY_ADDRESS) {			    
	    let logCheck = false;
	    // parse log events
	    tx.logs.map(log => {
		// token contract address is OK
		if (log.address !== transfer.tokenAddress.toLowerCase()) { return null;}
		if (log.topics.length < 3) { return null; }
		// transfer abi sha3 signature is OK
		if (log.topics[0] !== "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef") { return null; }
		// sender is OK
		if (log.topics[1] !== padStringTo32bytes(transfer.address.toLowerCase())) { return null; }
		// receiver is OK
		if (log.topics[2] !== padStringTo32bytes((transfer.counterpartyAddress.toLowerCase()))) { return null; }
		// value is ok
		if (log.data !== padStringTo32bytes(web3.toHex(transfer.rawValue))) { return null; }

		// if all checks passed
		logCheck = true;
		return null;
	    });
	    
	    // if no correct log, there was no needed erc20 transfer event,
	    // so put transfer status to error
	    if (!logCheck) {
		payload.status = 0; // error
	    }
	}
	
	dispatch({type: txActions.UPDATE_ASSET_TRANSFER, payload});
	dispatch(fetchWalletTokens(transfer.address));	
    };
}


// if there are pending txs in cache, 
export const checkPendingTxsInCache = () => {
    return (dispatch, getState) => {
	const pendingTxs = getPendingTxs(getState());
	pendingTxs.map((transfer) => {
	    dispatch(waitPendingTxForMined(transfer));
	});
    };
}


export const sendTransaction = ({ token, wallet, password, gasPrice, gasLimit,
				  receiverAddress, transferAmount, data }) => {
    return async (dispatch, getState) => {
	// amount in atomic units

	// covering that decimal places are ok
	if (!token.decimal) { throw new Error("Decimal places are not set up for token. Please contact devs."); }
	const transferAmountAtomic = (transferAmount * Math.pow(10, token.decimal));

	// tx params applicable both for token and ether transfer
	let input, etherAmount, to;
	
	// if token transfer
	const isERC20token = token.contractAddress !== ETHER_ASSET_DUMMY_ADDRESS;
	if (isERC20token) {
	    // 
	    const contract = web3Service.getTokenContract(token.contractAddress);
	    input = contract.transfer.getData(receiverAddress, transferAmountAtomic, {from: wallet.address});	    
	    to = token.contractAddress;
	    etherAmount = "0x0";	    
	} else {
	    // ether transfer
	    input = data;
	    etherAmount = transferAmountAtomic;
	    to = receiverAddress;
	}
	
	const txParams = {
	    from: wallet.address,
	    gas: gasLimit,
	    gasPrice: (gasPrice * 1e9),
	    to,
	    input,
	    value: etherAmount
	};

	try { 
	    const txHash = await sendTx({ txParams, keystore: wallet.keystore, password });

	    // params of local tx object
	    const timestamp = (Date.now()/1000);
	    const address = txParams.from; //.toLowerCase();
	    const counterpartyAddress = receiverAddress; //.toLowerCase();
	    const tokenAddress = token.contractAddress; //.toLowerCase;
	    const transfer = {
		txHash,
		address,
		counterpartyAddress,
		tokenAddress,
		value: transferAmount,
		rawValue: transferAmountAtomic,
		gasLimit: txParams.gas,
		gasPrice: txParams.gasPrice,
		input: txParams.input,
		timestamp,
		direction: "OUT",
		isPending: true	    
	    };
	    
	    transfer.id = generateAssetTransferId(transfer); 

	    // create pending tx in cache
	    dispatch({type: txActions.CREATE_ASSET_TRANSFERS, payload: [transfer]});
	    
	    // wait for pending tx to be mined
	    dispatch(waitPendingTxForMined(transfer));
	    
	    return txHash;
	} catch (err) {
	    throw err;
	};
    };
}

