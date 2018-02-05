import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import TokenTransactions from './tokenTransactions';
import { AssetRow } from 'quid-wallet/app/views/components/wallet/assetRow';
import { getAsset, getSelectedCurrency } from 'quid-wallet/app/data/selectors';
import wrapWithCurrencySwitcher from 'quid-wallet/app/views/components/currency-switcher';
var Fabric = require('react-native-fabric');
var { Answers } = Fabric;


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
    render() {
	return (
	    <TranasactionHistoryContainerConnected symbol={this.props.tokenSymbol} navigator={this.props.navigator}/>
	);
    }
}


class TranasactionHistoryContainer extends React.Component {
    constructor(props) {
	super(props);	
	Answers.logContentView(`${props.asset.symbol} Transactions`, 'Transaction History', `transaction-history-${props.asset.symbol}`, { asset: props.asset.symbol });	
    }
        
    render() {
	const { asset, currency, isBalanceHidden } = this.props;
	return (
	    <View style={styles.container}>
		<View style={styles.assetHeader}>
		    <AssetRow asset={asset} currency={currency} isBalanceHidden={isBalanceHidden}/>
		</View>
		<View style={styles.transactionsContainer}>
		    <TokenTransactions asset={asset} navigator={this.props.navigator} />
		</View>
            </View>
	);
    }
}


const mapStateToProps = (state, props) => ({
    currency: getSelectedCurrency(state),
    asset: getAsset(state, props),
    isBalanceHidden: state.data.balanceHidden
});


const TranasactionHistoryContainerConnected = connect(mapStateToProps)(TranasactionHistoryContainer);
export default wrapWithCurrencySwitcher(HistoryScreen);
