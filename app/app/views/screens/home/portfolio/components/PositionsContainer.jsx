import React from 'react';
import { connect } from 'react-redux';
import { View, FlatList } from 'react-native';
import {
    getActiveWallet,
    getPortfolioPositions,    
    getSelectedCurrency
} from 'quid-wallet/app/data/selectors';
import { fetchWalletTokens } from 'quid-wallet/app/actions/wallet';
import PositionRow from './PositionRow';
import FabricService from 'quid-wallet/app/services/FabricService';


class PositionsContainer extends React.PureComponent {
    async _fetchData() {	
	const { fetchWalletTokens, fetchMarketData,
		activeWallet, navigator } = this.props;

	try { 
	    await fetchWalletTokens(activeWallet.address);
	} catch(err) {
		navigator.showInAppNotification({
		screen: "quidwallet.components.Notification", // unique ID registered with Navigation.registerScreen
		passProps: {}, // simple serializable object that will pass as props to the lightbox (optional)
		autoDismissTimerSec: 3 // auto dismiss notification in seconds
	    });		
	}

	// #fabric-analytics
	FabricService.logScreenPullRefreshed('quidwallet.home.portfolio.PortfolioScreen');
    }
    
    _renderAssetRow({ item }) {
	const { currency, isBalanceHidden } = this.props;
	return (
		<PositionRow
	    token={item}
	    currency={currency}
	    isBalanceHidden={isBalanceHidden}/>
	);	
    }

    render() {
	const { tokens } = this.props;
	
	const Separator = () => (<View style={{height: 1, backgroundColor: '#e9eaeb'}} />);
	return (
		<FlatList
	    data={tokens}
	    ItemSeparatorComponent={Separator}
	    keyExtractor={item => item.contractAddress}
	    onRefresh={() => this._fetchData()}
	    refreshing={this.props.fetchingData}
	    renderItem={this._renderAssetRow.bind(this)}
		/>
	);	
    }
}


const mapStateToProps = state => ({
    fetchingData: state.refreshers.fetchingAddressAssets,
    activeWallet: getActiveWallet(state),    
    tokens: getPortfolioPositions(state),
    currency: getSelectedCurrency(state),    
    isBalanceHidden: state.data.balanceHidden,
});


export default connect(mapStateToProps, {
    fetchWalletTokens
})(PositionsContainer);
