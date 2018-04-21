import React from 'react';
import { connect } from 'react-redux';
import { View, Platform, RefreshControl } from 'react-native';
import styles from './styles';
import components from './components';
const { WalletHeader, WalletTokensList } = components;
import { fetchWalletTokens } from 'quid-wallet/app/actions/wallet';
import wrapWithCurrencySwitcher from 'quid-wallet/app/views/components/currency-switcher';
import CollapsibleToolbar from 'quid-wallet/app/views/components/CollapsibleToolbar';
import TransparentNavBar from 'quid-wallet/app/views/components/TransparentNavBar';
import FabricService from 'quid-wallet/app/services/FabricService';


class WalletScreen extends React.PureComponent {    
    static navigatorStyle = {
	statusBarTextColorSchemeSingleScreen: 'light',	
	navBarHidden: true,	
	screenBackgroundColor: '#fff'
    }
    
   componentDidMount() {
    	this._fetchData();
   }
    
    async _fetchData() {	
	const { fetchWalletTokens,
		activeWallet, navigator } = this.props;

	try { 	    
	    await fetchWalletTokens(activeWallet.address);
	} catch(err){
	    navigator.showInAppNotification({
		screen: "quidwallet.components.Notification", // unique ID registered with Navigation.registerScreen
		passProps: {}, // simple serializable object that will pass as props to the lightbox (optional)
		autoDismissTimerSec: 3 // auto dismiss notification in seconds
	    });		
	};
    }

    
    renderContent() {
	return (<WalletTokensList navigator={this.props.navigator}/>);
    }

    renderNavbar() {
	return (
	    <View style={styles.androidBottomMargin}> 
	      <TransparentNavBar title="Wallet" navigator={this.props.navigator}/>
	    </View>
	);
    }

    renderToolbar() {
	return (<WalletHeader navigator={this.props.navigator}/>);
    }

    _pullRefresh() {
	// #fabric-analytics
	FabricService.logScreenPullRefreshed('quidwallet.home.wallet.WalletScreen');
	
	this._fetchData();
    }
    
    render() {
	const component = this;
	return (
	    <View style={styles.container}>
	      <View style={styles.assets}>
		<CollapsibleToolbar
		   refreshControl={<RefreshControl onRefresh={() => component._pullRefresh()}
							     refreshing={this.props.fetchingData}/>}
		renderContent={this.renderContent.bind(this)}
		renderNavBar={this.renderNavbar.bind(this)}
		renderToolBar={this.renderToolbar.bind(this)}
		collapsedNavBarBackgroundColor='#242836'
		translucentStatusBar={Platform.Version >= 21}
		toolBarHeight={245} />		  
	      </View>
	    </View>
	);
    }
}


export default connect(state => ({
    fetchingData: state.refreshers.fetchingAddressAssets
}), {
    fetchWalletTokens
})(wrapWithCurrencySwitcher(
    WalletScreen,
    true, // withDrawer,
    'WalletScreen',
    false
));
