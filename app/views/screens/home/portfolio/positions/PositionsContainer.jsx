import React from 'react';
import { connect } from 'react-redux';
import { View, FlatList } from 'react-native';
import {
    getAssetsWithPrice,    
    getActiveWallet,
    getPositionChangeDct,    
    getSelectedCurrency
} from 'quid-wallet/app/data/selectors';
import { fetchAddressAssets } from 'quid-wallet/app/actions/wallet';
import { fetchMarketData } from 'quid-wallet/app/actions/market';
import AssetPriceRow from './assetRow';
var Fabric = require('react-native-fabric');
var { Answers } = Fabric;


class PositionsContainer extends React.PureComponent {
    _fetchData() {	
	const { fetchAddressAssets, fetchMarketData,
		activeWallet, navigator } = this.props;
	
	Promise.all([
	    fetchAddressAssets(activeWallet.address),
	    fetchMarketData()
	]).catch(() =>{
	    navigator.showInAppNotification({
		screen: "quidwallet.components.Notification", // unique ID registered with Navigation.registerScreen
		passProps: {}, // simple serializable object that will pass as props to the lightbox (optional)
		autoDismissTimerSec: 3 // auto dismiss notification in seconds
	    });		
	});

	// ANAL|YTYCS
	Answers.logCustom("REFRESH", { screen: 'quidwallet.home.portfolio.PortfolioScreen' });
    }
    
    _renderAssetRow({ item }) {
	const { currency, changeDct, isBalanceHidden } = this.props;

	const props = {
	    symbol: item.symbol,
	    contractAddress: item.contractAddress,
	    price: item.price,
	    priceChange: item.marketInfo.diff,
	    balanceChangeAbs: changeDct[item.address].value,
	    balanceChangePerc: changeDct[item.address].percent,
	    balance: item.balanceFiat,
	    qnty: item.balance,
	    currency,
	    isBalanceHidden
	};

	return (
	    <AssetPriceRow {...props} />
	);
    }

    render() {
	const component = this;
	const { assets } = this.props;
	
	return (
	      <FlatList
		 data={assets}
		 ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor: '#e9eaeb'}} />}
		 onRefresh={() => component._fetchData()}
		refreshing={this.props.fetchingData}
		renderItem={this._renderAssetRow.bind(this)}
		/>
	);
    }
}


const mapStateToProps = state => ({
    fetchingData: state.refreshers.fetchingAddressAssets,
    activeWallet: getActiveWallet(state),    
    assets: getAssetsWithPrice(state),
    currency: getSelectedCurrency(state),    
    isBalanceHidden: state.data.balanceHidden,
    changeDct: getPositionChangeDct(state)
});


export default connect(mapStateToProps, {
    fetchAddressAssets,
    fetchMarketData
})(PositionsContainer);
