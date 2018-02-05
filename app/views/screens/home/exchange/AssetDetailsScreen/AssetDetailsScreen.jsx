import React from 'react';
import { connect } from 'react-redux';
import { Text, View,
	 TouchableOpacity, Image, FlatList } from 'react-native';
import NumberFormat from 'react-number-format';
import cryptocompareApiService from 'quid-wallet/app/services/cryptocompareApiService';
import wrapWithCurrencySwitcher from 'quid-wallet/app/views/components/currency-switcher';
import { getSelectedCurrency, getTokenWithMarketInfo } from 'quid-wallet/app/data/selectors';
import CurrencySwitcher from 'quid-wallet/app/views/components/currency-switcher';
import PortfolioQuantityFormatted from 'quid-wallet/app/views/screens/home/portfolio/components/PortfolioQuantityFormatted';
import { toggleFavoriteToken } from 'quid-wallet/app/actions/app';
import { formatToCurrency, toFixed } from 'quid-wallet/app/utils';
import { AssetRow } from 'quid-wallet/app/views/screens/home/exchange/AssetDetailsScreen/components/AssetRow';


const MarketDetailsHeader = (props) => {
    return (
        <View>
            <View style={{ flex: 5 }}>
		<View style={{ flex: 2, alignItems: 'flex-start', paddingTop: 20, marginBottom: 20 }}>
		    <AssetRow asset={props.token} currency={props.currency}/>
		</View>
		
		<View style={{ flex: 1, marginLeft: 10 }}>
		    <TouchableOpacity onPress={() => { props.toggleFavoriteToken(props.token.contractAddress); }}>
			<View style={{ flexDirection: 'row', marginBottom: 20 }}>
			    <Image
				style={{ marginRight: 10 }}
				source={require('quid-wallet/app/views/assets/icons/icon_favorite.png')} />
			    <Text style={{ fontWeight: 'bold', color: "#FECB2E" }}>{props.token.isFavorite ? "Remove from favorites" : "Add to favorites"}</Text>
			</View>
		    </TouchableOpacity>
		</View>
		<View style={{ flex: 1, paddingBottom: 20, marginTop: 10, marginLeft: 15 }}>
		    <View style={{ flex: 2, marginBottom: 10 }}>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
			    <View style={{ flex: 1 }}>
				<Text style={{ color: "#24283666", fontSize: 11 }}>Market Cap</Text>
			    </View>
			    <View style={{ flex: 1 }}>
                    </View>
			</View>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>		  
			    <View style={{ flex: 1 }}>
				<PortfolioQuantityFormatted style={{ fontSize: 12, fontWeight: 'bold' }} value={props.token.marketCap} precision={2} currency={props.currency}/>  
			    </View>
			    <View style={{ flex: 1}}>
			    </View>
			</View>
		    </View>
		    <View style={{ flex: 2 }}>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
			    <View style={{ flex: 1 }}>
				<Text style={{ color: "#24283666", fontSize: 11 }}>Circulating supply</Text>
			    </View>
			    <View style={{ flex: 1 }}>
				<Text style={{ color: "#24283666", fontSize: 11 }}>Total supply</Text>
			    </View>
			</View>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
			    <View style={{ flex: 1}}>		    
				<NumberFormat value={toFixed(props.token.available_supply, 0)} displayType={'text'} thousandSeparator={' '} renderText={(formattedValue) => <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{formattedValue}</Text>} decimalScale={0}/>
			    </View>
			    <View style={{ flex: 1}}>
				<NumberFormat value={toFixed(props.token.total_supply, 0)} displayType={'text'} thousandSeparator={' '} renderText={(formattedValue) => <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{formattedValue}</Text>} decimalScale={0}/>
			    </View>
			</View>
		    </View>
		</View>
	    </View>
	    
	    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 20, marginLeft: 15 }}>
		<View style={{ flex: 1 }}>
		    <Text style={{ color: "#24283666", fontSize: 15 }}>Date</Text>
		</View>
		<View style={{ flex: 1 }}>
		    <Text style={{ color: "#24283666", fontSize: 15}}>Price</Text>
		</View>
		<View style={{ flex: 1 }}>
		    <Text style={{ color: "#24283666", fontSize: 15 }}>Market Cap</Text>
		</View>
	    </View>
	</View>    
    );
}


class AssetDetailsScreen extends React.Component {
    static navigationOptions = () => ({
        headerRight: <CurrencySwitcher />
    })

    constructor(props) {
        super(props);
        this.state = {
            data: {},
	    refreshing: false
        };
    }

    _fetchHistory() {
        const component = this;
        const details = cryptocompareApiService.getPriceHistoryByDate(component.props.token.cc_ticker, component.props.currency, 30);
	this.setState({refreshing: true});
        details.then(function (result) {
            const data = component.state.data;            
            data[component.props.currency] = result.Data;
            data[component.props.currency].sort((a, b) => {
                return b.time - a.time;
            });
	    
            component.setState({ data: data, refreshing: false });
        }).catch(() =>{
	    component.props.navigator.showInAppNotification({
		screen: "quidwallet.components.Notification", // unique ID registered with Navigation.registerScreen
		passProps: {}, // simple serializable object that will pass as props to the lightbox (optional)
		autoDismissTimerSec: 3 // auto dismiss notification in seconds
	    });
	    component.setState({refreshing: false});
	});
    }

    componentDidMount() {
        this._fetchHistory();
    }

    componentDidUpdate(prevProps) {
        if (this.state.data[this.props.currency] === undefined && this.props.currency!== prevProps.currency) {
            this._fetchHistory();
        }
    }

    _timestampToDate(timestamp) {
        const time = new Date(timestamp * 1000);
        let yyyy = time.getFullYear();
        let mm = ('0' + (time.getMonth() + 1)).slice(-2);	// Months are zero based. Add leading 0.
        let dd = ('0' + time.getDate()).slice(-2);
        return dd + '.' + mm + '.' + yyyy;
    }

    _keyExtractor = (item) => item.time;
    

    render() {
        const component = this;
        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 10 }}>
                    <FlatList
			ListEmptyComponent={
			    <View style={{height: 100}}>
				<Text style={{color: "#ccc", textAlign: 'center', fontSize: 20}}>-</Text>
			    </View>
			}
			onRefresh={() => {}}
			refreshing={this.state.refreshing} 
			ListHeaderComponent={MarketDetailsHeader(component.props)}
                        data={(component.state.data[component.props.currency] || [])}
			renderItem={({ item }) => {
				const marketCap = item.close * this.props.token.available_supply;
				return (<HistoryDataRow time={this._timestampToDate(item.time)} close={item.close} volume={item.volumeto} marketCap={marketCap} currency={this.props.currency} />);}}
		      keyExtractor={this._keyExtractor} />
                </View>
            </View>
        );
    }
}


const HistoryDataRow = (props) => {
    return (
        <View style={{ flex: 1, flexDirection: 'row', marginBottom: 20, marginLeft: 15 }}>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12 }}>{props.time}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{formatToCurrency(props.close, props.currency)}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <PortfolioQuantityFormatted style={{ fontSize: 12, fontWeight: 'bold' }} value={props.marketCap} precision={2} currency={props.currency}/>
            </View>
        </View>
    );
}


const mapStateToProps = (state, props) => {
    return {
        currency: getSelectedCurrency(state),
        token: getTokenWithMarketInfo(state, props)
    };
};


export default connect(mapStateToProps, { toggleFavoriteToken })(wrapWithCurrencySwitcher(AssetDetailsScreen));
