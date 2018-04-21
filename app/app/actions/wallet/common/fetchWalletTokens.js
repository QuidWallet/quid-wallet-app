import { actions } from './../actions';
import ethplorerService from 'quid-wallet/app/services/ethplorerApiService';
import { getTokensDct } from 'quid-wallet/app/data/selectors';
import web3Service from 'quid-wallet/app/services/web3Service';
import { displayBigNumber } from 'quid-wallet/app/utils';
import { getActiveWalletDisplayTokensSettings } from 'quid-wallet/app/data/selectors';
import { fetchMarketData } from 'quid-wallet/app/actions/market';


const _toBalanceDataObj = (balance, tokenAddress, tokenDecimal) => {
    const balanceDisplay = displayBigNumber(balance, tokenDecimal);
    return {
	qnty: balanceDisplay,
	rawQnty: balance,
	tokenAddress
    };	    
}

async function _fetchEtherBalance(address) {
    const web3 = web3Service.getWeb3();
    const balance = await web3.eth.getBalancePromise(address);
    return {balance, tokenAddress: '0x000_ether'};
}


async function _fetchTokenBalance(address, tokenAddress) {
    let balance;
    try {
	balance = await web3Service.getTokenBalance(address, tokenAddress);
    } catch(err) {
	balance = 0;
    }
    return ({balance, tokenAddress});
}


// autodetect address tokens from API
async function _fetchAutoDetectedTokens({address, dispatch, tokensDct}) {    
    const tokensLst = [];
    const newTokens = {}; // tokens not present in local tokens config
    
    try { 
	const data = await ethplorerService.getAddressAssets(address);
	
	data.tokens && data.tokens.map((token, index) => {
	    // add to wallet tokens lst
	    const balanceData = _toBalanceDataObj(token.balance,
						  token.tokenInfo.address,
						  token.tokenInfo.decimals);

	    // max number of autodetected tokens
	    if (index < 101) {
		tokensLst.push(balanceData);
	    }
		
	    // if new token, add it to new tokens lst
 	    if (!tokensDct[token.tokenInfo.address]) {
		newTokens[token.tokenInfo.address] = {
		    contractAddress: token.tokenInfo.address,
		    symbol: token.tokenInfo.symbol,
		    totalSupply: token.tokenInfo.totalSupply,
		    decimal: token.tokenInfo.decimals,
		    has_cc_ticker: false
		};
	    }
	});

	// if got new tokens, add them to local tokens config
	if (newTokens) {
	    dispatch({type: actions.GOT_NEW_TOKENS, payload: { newTokens }});
	}	    	    
    } catch(err) {
	// pass
    }
    return tokensLst;
};


export const updateTokenBalance = (walletAddress, tokenAddress) => {
    return async (dispatch, getState) => {
	const state = getState();
	const tokensDct = getTokensDct(state);
	try {
	    const { balance } = await _fetchTokenBalance(walletAddress, tokenAddress);
	    const token = tokensDct[tokenAddress] || {};
	    if (token === {}) { return null; };
	    const balanceData = _toBalanceDataObj(balance, tokenAddress, token.decimal);
	    dispatch({type: actions.GOT_TOKEN_BALANCE, payload: {walletAddress, tokenBalanceData: balanceData}});
	} catch (err) {
	    // pass
	}
    };
}

export const fetchWalletTokens = (address) => {
    return async (dispatch, getState) => {
	const state = getState();
	const tokensDct = getTokensDct(state);
	const tokenSettings = getActiveWalletDisplayTokensSettings(state);
	const alwaysShowTokens = [];
	Object.keys(tokenSettings).map(tokenAddress => {
	    const value = tokenSettings[tokenAddress];
	    switch (value) {
	    case "SHOW": 
		alwaysShowTokens.push(tokenAddress);
		break;
	    default: break;
	    }
	});
	
	
	const fetchPromises = [
	    _fetchAutoDetectedTokens({address, dispatch, tokensDct }),	    
	    _fetchEtherBalance(address)
	];

	// for every token in chosen  
	alwaysShowTokens
	    .filter(tokenAddress => tokenAddress !== '0x000_ether') // don't try to fetch ether as token
	    .map(tokenAddress => {
		fetchPromises.push(_fetchTokenBalance(address, tokenAddress));
	    });	   	

	// set fetching flag to true to show spinner
	dispatch({type: actions.FETCHING_ADDRESS_ASSETS});
	try { 
	    const [autoDetectedTokens, ...resultsFromBlockchain] = await Promise.all(fetchPromises);
	    let walletTokens = (autoDetectedTokens || []);
	    if (walletTokens.length === 0) { 
		walletTokens = (state.data.addressTokens[address] || []).filter(token => token.tokenAddress !== '0x000_ether');
	    }
	    walletTokens = walletTokens.filter(token => !alwaysShowTokens.includes(token.tokenAddress));
	    resultsFromBlockchain.map(({ balance, tokenAddress }) => {
		const token = tokensDct[tokenAddress] || {};
		if (token === {}) { return null; }; 
		const balanceData = _toBalanceDataObj(balance, tokenAddress, token.decimal);
		walletTokens.push(balanceData);		
	    });

	    // remove hidden tokens from result
	    const payload = {};		
	    payload[address] = walletTokens;
	    dispatch({type: actions.GOT_ADDRESS_ASSETS, payload});

	    // 
	    dispatch(fetchMarketData());
	    
	} catch (err) {
	    // stop spinner 
	    dispatch({type: actions.STOP_REFRESHER});
	}
    };
};
