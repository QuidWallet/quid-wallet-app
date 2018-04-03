import React from 'react';
import { connect } from 'react-redux';
import {
    Text, View,
    FlatList, Platform } from 'react-native';
import cryptocompareApiService from 'quid-wallet/app/services/cryptocompareApiService';
import wrapWithCurrencySwitcher from 'quid-wallet/app/views/components/currency-switcher';
import { getSelectedCurrency, getTokenWithMarketInfo } from 'quid-wallet/app/data/selectors';
import PortfolioQuantityFormatted from 'quid-wallet/app/views/screens/home/portfolio/components/PortfolioQuantityFormatted';
import { toggleFavoriteToken } from 'quid-wallet/app/actions/app';
import { formatToCurrency } from 'quid-wallet/app/utils';
import TokenMarketDetailsHeader from './components/TokenMarketDetailsHeader';


class TokenMarketDetailsScreen extends React.Component {
    static navigatorStyle = {
	...Platform.select({
	    ios: {
		screenBackgroundColor: 'white'
	    }
	})
    }
    
    constructor(props) {
        super(props);
        this.state = {
            data: {},
	    refreshing: false
        };
    }

    async _fetchHistory() {
        const component = this;
	this.setState({refreshing: true});
	try { 
            const result = await cryptocompareApiService.getPriceHistoryByDate(component.props.token.cc_ticker, component.props.currency, 30);
            const data = component.state.data;            
            data[component.props.currency] = result.Data;
            data[component.props.currency].sort((a, b) => {
                return b.time - a.time;
            });
	    
            component.setState({ data: data, refreshing: false });
        } catch (err) {
	    component.props.navigator.showInAppNotification({
		screen: "quidwallet.components.Notification", // unique ID registered with Navigation.registerScreen
		passProps: {}, // simple serializable object that will pass as props to the lightbox (optional)
		autoDismissTimerSec: 3 // auto dismiss notification in seconds
	    });
	    component.setState({refreshing: false});
	}
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

    _keyExtractor = (item) => item.time.toString();


    _renderHistoryPriceRow({timestamp, price, currency, marketCap}){
	const date = this._timestampToDate(timestamp);
	return (
		<View style={{ flex: 1, flexDirection: 'row', marginBottom: 20, marginLeft: 15 }}>
		<View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12 }}>{date}</Text>
		</View>
		<View style={{ flex: 1 }}>
		<Text style={{ fontSize: 12, fontWeight: 'bold' }}>{formatToCurrency(price, currency)}</Text>
		</View>
		<View style={{ flex: 1 }}>
                <PortfolioQuantityFormatted style={{ fontSize: 12, fontWeight: 'bold' }} value={marketCap} precision={2} currency={currency}/>
		</View>
		</View>
	);
    }
    
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
			ListHeaderComponent={TokenMarketDetailsHeader(component.props)}
                        data={(component.state.data[component.props.currency] || [])}
			renderItem={({ item }) => {
			    const marketCap = item.close * this.props.token.available_supply;
			    return (this._renderHistoryPriceRow({
				timestamp: item.time,
				volume: item.volumeto,
				price: item.close,
				marketCap,
				currency: this.props.currency
			    }));}}
	    keyExtractor={this._keyExtractor} />
                </View>
		</View>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        currency: getSelectedCurrency(state),
        token: getTokenWithMarketInfo(state, props)
    };
};


export default connect(mapStateToProps, { toggleFavoriteToken })(wrapWithCurrencySwitcher(TokenMarketDetailsScreen));
