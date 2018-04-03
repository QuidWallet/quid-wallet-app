import React from 'react';
import { connect } from 'react-redux';
import {
    Button,
    TextInput,
    Text,
    View,
    ActivityIndicator
} from 'react-native';
import { getActiveWallet } from 'quid-wallet/app/data/selectors';
import { sendTransaction } from 'quid-wallet/app/actions/wallet/keystoreWallet';


class ConfirmTxModal extends React.Component {
    constructor(props) {
	super(props);
	this.state = {
	    to: "",
	    amount: "",
	    pendingTx: false,
	    data: "",
	    password: "",
	    error: null
	};
    }

    
    async onSubmit() {
	const { amount, to, gasPrice, gasLimit, wallet, data, token } = this.props;
	this.setState({pendingTx: true, error: null});
	try {
	    await this.props.sendTransaction({
		wallet,
		transferAmount: amount,
		receiverAddress: to,
		gasPrice,
		gasLimit,
		data,
		token,
		password: this.state.password
	    });
	    
	    // pop 2 screens
	    this.props.navigator.pop({
		animated: false, 
	    });
	    this.props.navigator.pop({
		animated: false, 
	    });	    
	} catch (error) {
	    this.setState({error: error.message, pendingTx: false});
	}
    }

    render() {
	const { amount, to, gasPrice, gasLimit, wallet, data, token } = this.props;
	const { pendingTx } = this.state;
	const errorEl = ((this.state.error) ? <Text style={{color: "red"}}>{this.state.error}</Text>: null);
	const button =  pendingTx ? <ActivityIndicator/> : <Button title="Confirm" onPress={() => this.onSubmit()}/>;
	
	return (
	        <View style={{flex: 1, backgroundColor: '#fff', padding: 20}}>
		<Text> Wallet Name: {wallet.name }</Text>
		<Text style={{marginTop: 15}}> From: {wallet.address } </Text>
		<Text style={{marginTop: 15}}> To: {to }</Text>
		<Text style={{marginTop: 15}}> Gas Price: {gasPrice}</Text>
		<Text style={{marginTop: 15}}> Gas Limit: {gasLimit}</Text>
		<Text style={{marginTop: 15}}> Data: {data}</Text>						
		<Text style={{marginTop: 15, fontWeight: 'bold'}}> {token.symbol}: { amount }</Text>
		<TextInput
	    style={{height: 40, marginTop: 40}}
	    placeholder="Password"
	    onChangeText={(password) => this.setState({password})}/>
		{ button }
	    { errorEl } 
	    </View>
	);
    }
}

const mapStateToProps = state => ({
    wallet: getActiveWallet(state),
});


export default connect(mapStateToProps, { sendTransaction })(ConfirmTxModal);

