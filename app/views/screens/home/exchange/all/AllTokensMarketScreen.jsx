import React from 'react';
import { connect } from 'react-redux';
import { fetchMarketData } from 'quid-wallet/app/actions/market';
import { StyleSheet, View, VirtualizedList} from 'react-native';
import { AssetPriceRow, AssetPriceHeaderRow } from 'quid-wallet/app/views/screens/home/exchange/assetPriceRow';
import { getSelectedCurrency, getTokensSortedByMarketCap } from 'quid-wallet/app/data/selectors';
import wrapWithCurrencySwitcher from 'quid-wallet/app/views/components/currency-switcher';
import { SearchBar } from 'react-native-elements';
import escapeRegExp from 'escape-string-regexp';
import TransparentNavBar from 'quid-wallet/app/views/components/TransparentNavBar';
import FabricService from 'quid-wallet/app/services/FabricService';


const styles = StyleSheet.create({
    container: {
	flex: 1,
	backgroundColor: '#242836'
    },
    button: {
	alignItems: 'center',
	height: 56,
	width: 56
    }
});


class TokenListContainer extends React.Component {
    constructor(props) {
	super(props);
	this.state = {
	    searchString: ""
	};
    }

    render() {
	return (
	    <View>
	    <SearchBar
	       darkTheme
	       round={true}
	       containerStyle={
		   {backgroundColor: '#242836',
		    borderTopWidth: 0,
		    borderBottomWidth: 0,
		    marginTop: 0
	       }}
	       onChangeText={(input) => {
		       this.setState({ searchString: input });

		       // #fabric-analytics
		       FabricService.logTokenSearchOnMarketScreen(input);
	       }}
	      placeholder='Search token...' />
	      <ConnectedTokenListComponent navigator={this.props.navigator} searchString={this.state.searchString}/>
	    </View>
	);
    }
}


class TokenListComponent extends React.PureComponent {
    _fetchData() {
	const { navigator, fetchMarketData } = this.props;
	
	fetchMarketData().catch(() =>{
	    navigator.showInAppNotification({
		screen: "quidwallet.components.Notification", // unique ID registered with Navigation.registerScreen
		passProps: {}, // simple serializable object that will pass as props to the lightbox (optional)
		autoDismissTimerSec: 3 // auto dismiss notification in seconds
	    });		
	});

	// #fabric-analytics
	FabricService.logScreenPullRefreshed('quidwallet.home.exchange.MarketScreen');
    }

    isScreenActive(props) {
    	return props.activeScreenId.substring(0, 24) === 'quidwallet.home.exchange';
    }

    render() {
	const component = this;
	const { assets } = this.props;
	
	let showingTokens;
	if (this.props.searchString) {
	    const match = new RegExp(escapeRegExp(this.props.searchString), 'i');
	    showingTokens = assets.filter((asset) => match.test(asset.symbol));
	} else {
	    showingTokens = assets;
	}

	//if screen is not active rerender only visible part
	let windowSize;
	if (!this.isScreenActive(this.props)) {
	    windowSize = 1;
	} else {
	    windowSize = 10;
	}

	const ITEM_HEIGHT = 81;

	return (
	    <VirtualizedList	       
	       ListHeaderComponent={AssetPriceHeaderRow()}
	    data={showingTokens}
	    onRefresh={() => component._fetchData()}
	      refreshing={this.props.fetchingData}
	      getItemCount={(data) => data ? data.length : 0}
	      getItem={(data, index) => data[index]}
	      initialNumToRender={7}
	      windowSize={windowSize}
	    getItemLayout={(data, index) => (
		{length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
	    )}
	    removeClippedSubviews={true}
	    ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor: '#3a3d4a'}} />}	    
	      renderItem={({ item, index }) => <AssetPriceRow currency={this.props.currency} asset={item} navigator={this.props.navigator} index={index}/>} />
	);
    }
}


const mapStateToProps = state => ({
    assets: getTokensSortedByMarketCap(state),
    fetchingData: state.refreshers.fetchingMarketData,
    currency: getSelectedCurrency(state),
    activeScreenId: state.activeScreenId
});


const ConnectedTokenListComponent = connect(mapStateToProps, { fetchMarketData })(TokenListComponent);


class AllTokensMarketScreen extends React.Component {
    static navigatorStyle = {
	statusBarTextColorSchemeSingleScreen: 'light',
	navBarHidden: true,
	screenBackgroundColor: '#242836'
    }
    
    render() {
	return (
	    <View style={styles.container}>
	      <TransparentNavBar title="Market" navigator={this.props.navigator}/>
	      <TokenListContainer navigator={this.props.navigator}/>
	    </View>
	);
    }
}


export default wrapWithCurrencySwitcher(AllTokensMarketScreen, true, 'ExchangeScreen', false);
