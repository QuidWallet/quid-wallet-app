import React from 'react';
import { connect } from 'react-redux';
import { fetchMarketData } from 'quid-wallet/app/actions/market';
import { StyleSheet, View, VirtualizedList,
	 ActivityIndicator, Platform,
	 TouchableOpacity, Text } from 'react-native';
import { AssetPriceRow, AssetPriceHeaderRow } from 'quid-wallet/app/views/screens/home/exchange/components/assetPriceRow';
import { getSelectedCurrency, getTokensSortedByMarketCap } from 'quid-wallet/app/data/selectors';
import wrapWithCurrencySwitcher from 'quid-wallet/app/views/components/currency-switcher';
import { SearchBar } from 'react-native-elements';
import escapeRegExp from 'escape-string-regexp';
import TransparentNavBar from 'quid-wallet/app/views/components/TransparentNavBar';
import FabricService from 'quid-wallet/app/services/FabricService';
import { paginateArray } from 'quid-wallet/app/utils';
import _ from 'lodash';


// TODO move to constants
const PAGE_SIZE = 10;

const styles = StyleSheet.create({
    container: {
	flex: 1,
	backgroundColor: '#242836',
	//paddingBottom: 120
    },
    button: {
	alignItems: 'center',
	height: 56,
	width: 56
    }
});


class MarketScreen extends React.Component {
    static navigatorStyle = {
	statusBarTextColorSchemeSingleScreen: 'light',
	navBarHidden: true,
	screenBackgroundColor: '#242836'
    }

    constructor(props) {
	super(props);
	this.state = {
	    searchString: "",
	    page: 0
	};

	this._onChangeSearchStringDelayed = _.debounce(this._onChangeSearchString.bind(this), 500);
    }

    _getFoundTokens(input) {
	const { assets } = this.props;	
	const match = new RegExp(escapeRegExp(input), 'i');
	return assets.filter((asset) => match.test(asset.symbol));
    }
    
    _onChangeSearchString(input) {
	if (input.length > 0) {
	    const tokensToFetch = this._getFoundTokens(input);
	    this._fetchData(tokensToFetch);
	}
    }
    
    _renderSearchBar() {	
	return (
	    <SearchBar
	       darkTheme
	       round={true}
	       containerStyle={
		   {backgroundColor: '#242836',
		    borderTopWidth: 0,
		    borderBottomWidth: 0,
		    marginTop: 0
		   }}
	    clearIcon={this.state.searchString ? true : false}
	    defaultValue={this.state.searchString}
		onChangeText={(input) => {
			this._onChangeSearchStringDelayed.bind(this)(input);
			this.setState({ searchString: input, page: 0 });
			
			// #fabric-analytics
			FabricService.logTokenSearchOnMarketScreen(input);				
		}}
	    
	    placeholder='Search token...' />	    
	);
    }

    _onRefresh() {
	if (this.state.searchString.length > 0) {
	    // fetch data only for tokens being searched
	    const foundTokens = this._getFoundTokens(this.state.searchString);
	    this._fetchData(foundTokens);
	} else {
	    // otherwise fetch data for first batch of tokens
	    this.setState({page: 0});
	    this._fetchData();
	}
	
	// #fabric-analytics
	FabricService.logScreenPullRefreshed('quidwallet.home.exchange.MarketScreen');	
    }
    
    _fetchData(tokens) {
	const { navigator, fetchMarketData} = this.props;
	
	return fetchMarketData(tokens).catch(() =>{
	    navigator.showInAppNotification({
		screen: "quidwallet.components.Notification", // unique ID registered with Navigation.registerScreen
		passProps: {}, // simple serializable object that will pass as props to the lightbox (optional)
		autoDismissTimerSec: 3 // auto dismiss notification in seconds
	    });		
	});	
    }    
    
    
    _renderFooter() {
	// don't render footer when searching
	if (this.state.searchString) { return null }
	const { assets } = this.props;

	// if fetching show activity indicator
	if (this.props.fetchingData) {
	    // show loading indicator only for ios	    
	    if (Platform.OS === "android") { return null };
	    return (<ActivityIndicator />);
	}
	return (
	    <TouchableOpacity style={{
		height: 44,
	    }} onPress={() => {
		    const page = this.state.page + 1;
		    const tokensToFetch = paginateArray(assets, page, PAGE_SIZE);
		    this._fetchData(tokensToFetch).then(() => {
			this.setState({page});
			const index = page * PAGE_SIZE;
			this.list.scrollToIndex({index});
		    });
	    }}>
		<Text style={{
		    color: "#fff",
		    textAlign: 'center',
		    fontSize: 18
		}}>Load More</Text>
	    </TouchableOpacity>
	);
    }

    
    isScreenActive(props) {
    	return props.activeScreenId.substring(0, 24) === 'quidwallet.home.exchange';
    }

    
    render() {
	const { assets } = this.props;
	
	let showingTokens;
	if (this.state.searchString) {
	    showingTokens = this._getFoundTokens(this.state.searchString)
	} else {
	    // paginate tokens (if user isn't searching tokens)
	    showingTokens = assets.filter((item, index) => index < (this.state.page + 1) * PAGE_SIZE)
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
	    <View style={styles.container}>
		<TransparentNavBar title="Market" navigator={this.props.navigator}/>
		{ this._renderSearchBar() }		
		<VirtualizedList	       
ListHeaderComponent={AssetPriceHeaderRow(this.props.timestampUpdated)}
data={showingTokens}
onRefresh={this._onRefresh.bind(this)}
refreshing={this.props.fetchingData}
ListFooterComponent={this._renderFooter.bind(this)}
getItemCount={(data) => data ? data.length : 0}
getItem={(data, index) => data[index]}
initialNumToRender={7}
ref={(ref) => { this.list = ref; }}		
windowSize={windowSize}
getItemLayout={(data, index) => ({length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index})}
removeClippedSubviews={true}
ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor: '#3a3d4a'}} />}	    
renderItem={({ item, index }) => <AssetPriceRow currency={this.props.currency} asset={item} navigator={this.props.navigator} index={index}/>} />
	    </View>
	);
    }
}


const mapStateToProps = state => ({
    assets: getTokensSortedByMarketCap(state),
    fetchingData: state.refreshers.fetchingMarketData,
    currency: getSelectedCurrency(state),
    activeScreenId: state.activeScreenId,
    timestampUpdated: state.marketData.timestamp
});


export default connect(mapStateToProps, { fetchMarketData })(wrapWithCurrencySwitcher(MarketScreen, true, 'ExchangeScreen', false));
