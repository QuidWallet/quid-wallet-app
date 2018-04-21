import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Button, View } from 'react-native';
import TokenTransactions from './tokenTransactions';
import EtherTransactions from './etherTransactions';
import { TokenRow } from '../components/tokenRow';
import { getActiveWallet, getTokenInWallet, getSelectedCurrency } from 'quid-wallet/app/data/selectors';
import wrapWithCurrencySwitcher from 'quid-wallet/app/views/components/currency-switcher';
//import FabricService from 'quid-wallet/app/services/FabricService';


const styles = StyleSheet.create({
    container: {
	flex: 1,
	backgroundColor: '#fff',
    },
    assetHeader: {
	flex: 1,
	padding: 15
    },
    transactionsContainer: {
	flex: 5
    }
});


class HistoryScreen extends React.Component {
    constructor(props) {
	super(props);

	// // #fabric-analytics
	// FabricService.logTransactionHistoryViewed(props.token.symbol);
    }

    _renderSendReceiveButtons() {
	const { wallet, navigator } = this.props;
	// don't show send buttons for watch wallet
	if (wallet.walletType !== "v3") { return null }

	return (
		<View style={{flexDirection: 'row', height: 80}}>
		<View style={{flex: 1}} >
		<Button title="Send" onPress={() => navigator.push({
		    screen: 'quidwallet.home.wallet.send.WalletSendScreen',
		    title: 'Send ether', 
		    backButtonTitle: "",
		    navigatorStyle: {		      
			tabBarHidden: true
		    },	    
		    passProps: {
			token: this.props.token
		    }
		})}/>
		</View>
		<View style={{flex: 1}} >	    
		    <Button title="Receive" onPress={() => {
			navigator.push({
			    screen: 'quidwallet.home.wallet.receive.WalletReceiveScreen',
			    navigatorStyle: {		      
				tabBarHidden: true
			    },
			    title: 'Receive ether', 
			    backButtonTitle: ""			    
			});			   
		    }}/>
		</View>
	    </View>
	)
    }

    
    render() {
	const { token, currency, isBalanceHidden, wallet } = this.props;
	return (
	    <View style={styles.container}>
		<View style={styles.assetHeader}>
		    <TokenRow token={token} currency={currency} isBalanceHidden={isBalanceHidden}/>
		</View>
		<View style={styles.transactionsContainer}>
		{ this._renderSendReceiveButtons() }
		    { (token.contractAddress === "0x000_ether") ?
		      <EtherTransactions token={token} navigator={this.props.navigator} wallet={wallet} /> :
		      <TokenTransactions token={token} navigator={this.props.navigator} wallet={wallet} />
		    }
		</View>
            </View>
	);
    }
}


const mapStateToProps = (state, props) => ({
    wallet: getActiveWallet(state),    
    currency: getSelectedCurrency(state),
    token: getTokenInWallet(state, {tokenAddress: props.tokenAddress} ),
    isBalanceHidden: state.data.balanceHidden
});


export default connect(mapStateToProps)(wrapWithCurrencySwitcher(HistoryScreen));
