import React from 'react';
import { Text, View, Image, Linking } from 'react-native';
import { toFixed, shortAddress } from 'quid-wallet/app/utils';
import DateFormatted from 'quid-wallet/app/views/components/DateFormatted';
import web3Service from 'quid-wallet/app/services/web3Service.js';
import TextWithCopy from 'quid-wallet/app/views/components/TextWithCopy';
import styles from './styles';


class TransactionRecord extends React.Component {
    constructor(props) {
	super(props);
	this.state = {
	    gasUsed: "...",
	    gasPrice: "...",
	    gasLimit: "...",
	    gasPriceInGwei: "...",
	    gasCost: "..."
	};
    }

    componentDidMount() {
	const web3 = web3Service.getWeb3();
	const txHash = this.props.tx.txHash;
	Promise.all([
	    web3.eth.getTransactionReceiptPromise(txHash),
	    web3.eth.getTransactionPromise(txHash),
	]).then((results) => {
	    const receipt = results[0];
	    const tx = results[1];
	    const gasCost = web3.fromWei(tx.gasPrice * receipt.gasUsed, 'ether');
	    const gasPriceInGwei = web3.fromWei(tx.gasPrice, 'gwei').toNumber();

	    const txDetails = {
		gasUsed: receipt.gasUsed,
		gasLimit: tx.gas,
		gasPriceInGwei,
		input: tx.input,
		gasCost
	    };

	    this.setState(txDetails);
	});
    }
   
    render() {
	const tx = this.props.tx;
	const hashLink = "https://etherscan.io/tx/".concat(tx.txHash);
	const from = tx.direction === "OUT" ? tx.address : tx.counterpartyAddress;
	const to = tx.direction === "OUT" ? tx.counterpartyAddress : tx.address;
	return (
	    <View style={styles.container}>
	      <View style={styles.arrowRow}>
		<View style={{marginTop: 5, flex: 1, alignItems: 'center'}} >
		  <Image
		     source={tx.direction === "OUT" ? require('quid-wallet/app/views/assets/icons/arrow-out.png') : require('quid-wallet/app/views/assets/icons/arrow-in.png')}
		     />
		</View>
		<View style={{flex: 5}}>
		  <Text style={{ fontSize: 20 }}>{toFixed(tx.value, 4)} {this.props.asset.symbol} {tx.direction === "OUT" ? "sent" : "received"}</Text>
		</View>
	      </View>
	      <View style={{ flexDirection: 'row', marginBottom: 15 }}>
		<View style={{ flex: 0.5 }}>
		</View>
		
		<View style={{ flex: 7, marginBottom: 15, alignItems: 'flex-start' }}>		  
		  <Text style={styles.fromToTitle}>From:</Text>
		  <TextWithCopy valueToCopy={from}>
		    <Text style={styles.text}>
		      {from}
		    </Text>
		  </TextWithCopy>
		  
		  <Text style={[styles.fromToTitle, {marginTop: 10}] }>To:</Text>
		  <TextWithCopy valueToCopy={to}>
		    <Text style={styles.text}>
		      {to}
		    </Text>
		  </TextWithCopy>

		</View>
	      </View>
	      <View style={{ flexDirection: 'row'}}>
		<View style={{ flex: 0.5,}}>
		</View>
		<View style={{ flex: 2, }}>

		  <View style={{ marginBottom: 15 }}>
		    <Text style={styles.textTitle}>Tx Status:</Text>		    
		    <Text style={styles.textTitle}>Gas Limit:</Text>
		    <Text style={styles.textTitle}>Gas Used:</Text>		    
		    <Text style={styles.textTitle}>Gas Price:</Text>
		    <Text style={styles.textTitle}>Tx Cost:</Text>		    		    
		  </View>
		  <View style={{ marginBottom: 15 }}>
		    <Text style={styles.textTitle}>Tx time:</Text>
		    <Text style={styles.textTitle}>Block #:</Text>
		    <Text style={styles.textTitle}>Tx hash:</Text>
		  </View>
		</View>
		<View style={{ flex: 5}}>
		  <View style={{ marginBottom: 15 }}>
		    <Text style={[styles.text, {color: (tx.status === 1) ? '#00BF19' : '#E33E59'} ]}>{(tx.status === 1) ? 'Success' : 'Fail' }</Text>		    
		    <Text style={styles.text}>{this.state.gasLimit}</Text>
		    <Text style={styles.text}>{this.state.gasUsed}</Text>
		    <Text style={styles.text}>{this.state.gasPriceInGwei} Gwei</Text>
		    <Text style={styles.text}>{this.state.gasCost} Ether</Text>


		  </View>
		  <View>
		    <DateFormatted style={styles.text} timestamp={tx.timestamp * 1000} />

		    <Text style={styles.text}>{tx.blockNumber}</Text>
		    <Text style={styles.link} onPress={() => Linking.openURL(hashLink)} >{shortAddress(tx.txHash, 10)}</Text>
		  </View>
		</View>
	      </View>
	    </View>
	);
    }
}


export default TransactionRecord;
