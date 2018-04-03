import Config from 'react-native-config';
import web3Service from 'quid-wallet/app/services/web3Service';
import Wallet from 'ethereumjs-wallet-react-native';
import EthTx from 'ethereumjs-tx';


export async function generateOrImportKeystore({password, privateKey=null}) {
    // use private key if it's given, otherwise generate wallet
    let wallet; 
    if (privateKey) {
	wallet = await Wallet.fromPrivateKey(new Buffer(privateKey, 'hex'));
    } else {
	wallet = await Wallet.generate();
    }	
    
    // // ensure it doesnt already exist
    // // let the UI update with a loading spinner...
    const params = {
	n: 1024  // todo, use 65536 for better security
    };    
    const keystore = JSON.stringify(await wallet.toV3(password, params));
    const address = wallet.getChecksumAddressString();
    return { keystore, address };    
}

export async function derivePkFromKeystore({keystore, password}) {
    const wallet = await Wallet.fromV3(keystore, password);
    const pk = wallet.getPrivateKey();
    return pk;
}

async function signTx({keystore, password, txParams}) {
    let privateKey = await derivePkFromKeystore({keystore, password});

    const tx = new EthTx(txParams);
    tx.sign(privateKey);

    privateKey = null;
    const signedTx = `0x${tx.serialize().toString('hex')}`;
    return signedTx;
}


export async function sendTx({txParams, keystore, password}) {
    const web3 = web3Service.getWeb3();
    const txCount = await web3.eth.getTransactionCountPromise(txParams.from, "latest");
    // add nonce (tx count) to transaction params    
    txParams = {
	...txParams,
	nonce: txCount,
	chainId: parseInt(Config.CHAIN_ID) // defence from replay attack to another chain
    };
    const signedTx = await signTx({txParams, keystore, password });
    
    // returns txHash
    return web3.eth.sendRawTransactionPromise(signedTx);
}
