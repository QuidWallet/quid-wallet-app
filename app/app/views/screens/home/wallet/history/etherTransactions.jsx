import React from 'react';
import { Text, View,
	 FlatList, Platform,
	 TouchableOpacity, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { fetchEtherTransactions } from 'quid-wallet/app/actions/transactions';
import { getAssetTransfers } from 'quid-wallet/app/data/selectors';
import etherscanService from 'quid-wallet/app/services/etherscanApiService';
import TransactionRow from './TransactionRow';


class EtherTransactions extends React.Component {
    _keyExtractor = (item) => item.id;

    constructor(props) {
	super(props);
	this.state = {
	    moreTxs: [], // transactions loaded on button "Load More"
	    fetching: false,
	    noMoreTxs: false // flag that no more txs are fetched
	};
	this.page = 1;
    }

    _showErrorNotification() {
	this.props.navigator.showInAppNotification({
	    screen: "quidwallet.components.Notification", // unique ID registered with Navigation.registerScreen
	    passProps: {}, // simple serializable object that will pass as props to the lightbox (optional)
	    autoDismissTimerSec: 3 // auto dismiss notification in seconds
	});		
    }
    
    componentDidMount() {
	this._fetchData();
    }

    async _fetchData() {
	this.page = 1;
	this.state.moreTxs = [];	
	const { fetchEtherTransactions, wallet } = this.props;
	try { 
	    await fetchEtherTransactions(wallet.address);
	} catch(err) {
	    this._showErrorNotification();
	};
    }

    
    async _onLoadMore() {
	const { wallet	} = this.props;
	this.page += 1;
	this.setState({fetching: true});
	try { 
	    const moreTxs = await etherscanService.getTransactions({
		address: wallet.address,
		startBlock: 0,
		page: this.page
	    });
	    if (moreTxs.length > 0) {
		this.setState({moreTxs, fetching: false});
	    } else {
		// there are no txs to fetch left
		this.setState({noMoreTxs: true, fetching: false});
	    }	    
	} catch(error) {	    
	    this.setState({error, fetching: false});
	    this._showErrorNotification();
	};	
    }
    

    _renderFooter() {		
	const refreshing = this.props.refreshing || this.state.fetching;	
	if (refreshing) {	    
	    // show loading indicator only for ios
	    if (Platform.OS === "android") { return null; };
	    return (<ActivityIndicator/>);
	}

	// don't render load more button if there are less than 50 txs
	const txsCount = this.props.cachedTxs.length + this.state.moreTxs.length;	
	if (txsCount < 50) { return null }

	// don't render button if there are no more txs left 
	if (this.state.noMoreTxs) { return null }

	// render button otherwise
	return (
	    <TouchableOpacity
		style={{ height: 44, backgroundColor: "#fff" }}
		onPress={this._onLoadMore.bind(this)}>
		<Text style={{
		    color: '#242836',
		    textAlign: 'center',
		    fontSize: 18,
		    fontWeight: 'bold'
		}}>Load more</Text>
	    </TouchableOpacity>
	)
    }

    
    render() {
	const transactions = [...this.props.cachedTxs, ...this.state.moreTxs];
	const refreshing = this.props.refreshing || this.state.fetching;
	return (
	    <View>
		<FlatList
		    data={transactions}
		    ListEmptyComponent={
			<View style={{height: 100}}>
			    <Text style={{color: "#ccc", textAlign: 'center', fontSize: 20}}>-</Text>
			</View>}		     			   
		    onRefresh={() => this._fetchData()}
		    refreshing={refreshing}
		    ListFooterComponent={this._renderFooter.bind(this)}		
		    keyExtractor={this._keyExtractor}
		    renderItem={({ item }) => <TransactionRow tx={item} token={this.props.token} navigator={this.props.navigator}/>}
		/>
	    </View>
	);
    }
}


const mapStateToProps = (state, props) => ({
    cachedTxs: getAssetTransfers(state, props),
    refreshing: state.refreshers.fetchingTransactions
});


export default connect(mapStateToProps, {fetchEtherTransactions})(EtherTransactions);
