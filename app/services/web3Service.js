const Promise = require('bluebird');
const erc20abi = require('human-standard-token-abi');
const WEB3_RPC_URL = 'https://mainnet.infura.io';
import generateWeb3WithProvider from 'quid-wallet/app/utils/generateWeb3Provider';


const Web3Service = function() {
    const web3 = generateWeb3WithProvider(WEB3_RPC_URL);
    const tokenDct = {};
    
    const getWeb3 = () => {
	return web3;
    };

    const _initTokenContract = (tokenAddr) => {
    	const instance = web3.eth.contract(erc20abi).at(tokenAddr);
    	Promise.promisifyAll(instance.balanceOf, { suffix: 'Promise' });
	tokenDct[tokenAddr] = instance;
	return instance;
    };
    
    const getTokenContract = (tokenAddr) => {
	const instance = tokenDct[tokenAddr] || _initTokenContract(tokenAddr);
	return instance;
    };

    const _tokenTransferEvents = ({tokenAddr, address, fromBlock, toBlock, key}) => {
	const instance = getTokenContract(tokenAddr);
	
	const eventParams = {
	    fromBlock: fromBlock || 0,
	    toBlock: toBlock || 'latest'
	};

	return instance.Transfer({[key]: address}, eventParams);
    };

    const incomingTokenTransferEvents = (params) => {
	return _tokenTransferEvents({...params, key: '_to'});
    };

    const outgoingTokenTransferEvents = (params) => {
	return _tokenTransferEvents({...params, key: '_from'});
    };

    // api
    return {
	getWeb3,
	getTokenContract,
	incomingTokenTransferEvents,
	outgoingTokenTransferEvents,
    };
};

const web3Service = Web3Service();
export default web3Service;
