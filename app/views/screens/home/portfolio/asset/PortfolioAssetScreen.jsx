import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import TokenTransactions from './assetHistory';
import { AssetRow } from 'quid-wallet/app/views/components/wallet/assetRow';
import CurrencySwitcher from 'quid-wallet/app/views/components/currency-switcher';
import { getAsset, getSelectedCurrency } from 'quid-wallet/app/data/selectors';


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


class PortfolioAssetScreen extends React.Component {
    static navigationOptions = ({navigation}) => ({
	title: `${navigation.state.params.symbol} History`,
	headerRight: <CurrencySwitcher/>
    })
    
    render() {
	const { params } = this.props.navigation.state;
	return (
		<PortfolioAssetContainerConnected symbol={params.symbol}/>
	);
    }
}


class PortfolioAssetContainer extends React.Component {    
    render() {
	const { asset, currency } = this.props;
	
	return (
		<View style={styles.container}>
		<View style={styles.assetHeader}>
		  <AssetRow asset={asset} currency={currency}/>
		</View>
		<View style={styles.transactionsContainer}>
		<TokenTransactions asset={asset} currency={currency}/>
		</View>
		</View>
	);
    }
}


const mapStateToProps = (state, props) => ({
    currency: getSelectedCurrency(state),
    asset: getAsset(state, props)
});


const PortfolioAssetContainerConnected = connect(mapStateToProps)(PortfolioAssetContainer);
export default PortfolioAssetScreen;
