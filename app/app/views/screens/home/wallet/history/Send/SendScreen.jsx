import React from 'react';
import { connect } from 'react-redux';
import {
    Button,
    TextInput,
    Text,
    View,
    StyleSheet,
    ScrollView
} from 'react-native';
import { TokenRow } from './../../components/tokenRow';
import { getSelectedCurrency } from 'quid-wallet/app/data/selectors';
import wrapWithCurrencySwitcher from 'quid-wallet/app/views/components/currency-switcher';


const styles = StyleSheet.create({
    container: {
	flex: 1,
	backgroundColor: '#fff',
    },
    tokenHeader: {
	flex: 1,
	padding: 15
    },
    transactionsContainer: {
	flex: 5,
	padding: 20
    }
});


class SendForm extends React.Component {
     constructor(props) {
	 super(props);
	 const isEther = props.token.contractAddress==="0x000_ether";
	// default wallet config
	this.state = {
	    to: "",
	    amount: "",
	    gasPrice: 20,
	    isEther, 
	    gasLimit: (isEther ? 21000: 61000),
	    data: "",
	    error: null,
	};
    }

    onSubmit() {
	this.setState({error: null});

	const { to, amount, gasLimit, gasPrice } = this.state;
	if (to.length == '') {
	    this.setState({error: "Please enter correct recipient address." });
	    return;
	}

	if (!amount || amount < 0) {	    
	    this.setState({error: "Please enter correct amount." });
	    return;
	}

	if (!gasPrice || gasPrice < 0) {	    
	    this.setState({error: "Please enter correct gas price." });
	    return;
	}

	if (!gasLimit || gasLimit < 0) {	    
	    this.setState({error: "Please enter correct gas limit." });
	    return;
	}
	
		
	this.props.navigator.push({
	    screen: 'quidwallet.home.wallet.send.WalletSendConfirmScreen',
	    title: 'Confirm transaction', 
	    backButtonTitle: "",
	    navigatorStyle: {		      
		tabBarHidden: true
	    },
	    passProps: {
		to,
		amount,
		gasLimit: parseInt(gasLimit),
		gasPrice,
		data: this.state.data,
		token: this.props.token,
		isEther: this.state.isEther
	    } 
	});	   
    }

    
    render() {
	const { token, currency, isBalanceHidden } = this.props;
	const errorEl = ((this.state.error) ? <Text style={{color: "red"}}>{this.state.error}</Text>: null);
	
	return (
	    <ScrollView style={styles.container}>
		<View style={styles.tokenHeader}>
		  <TokenRow token={token} currency={currency} isBalanceHidden={isBalanceHidden}/>
		</View>
		<View style={styles.transactionsContainer}>
		
		<Text style={{fontWeight: 'bold'}}>Recepient:</Text>
		<TextInput
	    style={{height: 40}}
	    placeholder="Recipient Address"
	    onChangeText={(to) => this.setState({to})}/>

		<Text style={{marginTop: 20, fontWeight: 'bold'}}>Amount:</Text>		
		<TextInput
	    keyboardType="numeric"
	    style={{height: 40}}
	    placeholder="amount, e.g. 5"
	    value={this.state.amount.toString()}
	    onChangeText={(amount) => {	
		if (amount.includes(',')) {
		    amount = amount.replace(/,/i, '.');
		}
		this.setState({amount})
	    }}/>

		<Text style={{marginTop: 40, fontWeight: 'bold'}}>Gas Limit:</Text>				
		<TextInput
	    keyboardType="numeric"	    
	    style={{height: 40}}
	    defaultValue={this.state.gasLimit.toString()}
	    placeholder="Gas limit"
	    onChangeText={(gasLimit) => this.setState({gasLimit})}/>

		<Text style={{marginTop: 20, fontWeight: 'bold'}}>Gas Price, Gwei:</Text>		
		<TextInput
	    keyboardType="numeric"
	    style={{height: 40}}
	    placeholder="Gas Price"
	    defaultValue={this.state.gasPrice.toString()}
	    onChangeText={(gasPrice) => this.setState({gasPrice})}/>

		{ (this.state.isEther) ?
		  <View>
		  <Text style={{marginTop: 20, fontWeight: 'bold'}}>Data:</Text>		
		  <TextInput
		  style={{height: 40}}
		  placeholder="Data (Optional)"
		  defaultValue={""}
		  onChangeText={(data) => this.setState({data})}/>
		  </View> : null }		
		
		<Button title="Send" onPress={() => this.onSubmit()}></Button>
		{ errorEl }
	    </View>
		</ScrollView>
				
	);
    }
}

const mapStateToProps = (state, props) => ({
    currency: getSelectedCurrency(state),
    isBalanceHidden: state.data.balanceHidden
});


export default connect(mapStateToProps)(wrapWithCurrencySwitcher(SendForm));
