import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import TokenTransactions from './tokenTransactions';
import EtherTransactions from './etherTransactions';
import { AssetRow } from 'quid-wallet/app/views/components/wallet/assetRow';
import { getAsset, getSelectedCurrency } from 'quid-wallet/app/data/selectors';
import wrapWithCurrencySwitcher from 'quid-wallet/app/views/components/currency-switcher';
import FabricService from 'quid-wallet/app/services/FabricService';


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

	// #fabric-analytics
	FabricService.logTransactionHistoryViewed(props.asset.symbol)
    }
        
    render() {
	const { asset, currency, isBalanceHidden } = this.props;
	return (
	    <View style={styles.container}>
		<View style={styles.assetHeader}>
		    <AssetRow asset={asset} currency={currency} isBalanceHidden={isBalanceHidden}/>
		</View>
		<View style={styles.transactionsContainer}>
		    { (asset.contractAddress === "0x000_ether") ?
		      <EtherTransactions asset={asset} navigator={this.props.navigator} /> :
		      <TokenTransactions asset={asset} navigator={this.props.navigator} />
		    }
		</View>
            </View>
	);
    }
}


const mapStateToProps = (state, props) => ({
    currency: getSelectedCurrency(state),
    asset: getAsset(state, {symbol: props.tokenSymbol} ),
    isBalanceHidden: state.data.balanceHidden
});


export default connect(mapStateToProps)(wrapWithCurrencySwitcher(HistoryScreen));
