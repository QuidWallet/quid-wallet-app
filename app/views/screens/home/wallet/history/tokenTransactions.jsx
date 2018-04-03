import React from 'react';
import { Text, View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { fetchTokenTransactions } from 'quid-wallet/app/actions/transactions';
import { getAssetTransfers } from 'quid-wallet/app/data/selectors';
import TransactionRow from './TransactionRow';


class TokenTransactions extends React.Component {
    _keyExtractor = (item) => item.id;
    
    componentDidMount() {
	this._fetchData();
    }

    async _fetchData() {
	const { fetchTokenTransactions, wallet } = this.props;	
	const tokenAddress = this.props.token.contractAddress; // token contract address
	try { 
	    await fetchTokenTransactions(wallet.address, tokenAddress);
	} catch (err) {
	    this._showErrorNotification();
	}	
    }
    
    _showErrorNotification() {
	this.props.navigator.showInAppNotification({
	    screen: "quidwallet.components.Notification", // unique ID registered with Navigation.registerScreen
	    passProps: {}, // simple serializable object that will pass as props to the lightbox (optional)
	    autoDismissTimerSec: 3 // auto dismiss notification in seconds
	});			
    }
    
    render() {	
	return (
	    <View>
		<FlatList
		    data={this.props.transactions}
		    ListEmptyComponent={
			<View style={{height: 100}}>
			    <Text style={{color: "#ccc", textAlign: 'center', fontSize: 20}}>-</Text>
			</View>}		     			   
		    onRefresh={() => this._fetchData()}
		    refreshing={this.props.refreshing}
		    keyExtractor={this._keyExtractor}
		    renderItem={({ item }) => <TransactionRow tx={item} token={this.props.token} navigator={this.props.navigator}/>}
		/>
	    </View>
	);
    }
}


const mapStateToProps = (state, props) => ({
    transactions: getAssetTransfers(state, props),
    refreshing: state.refreshers.fetchingTransactions
});


export default connect(mapStateToProps, {fetchTokenTransactions})(TokenTransactions);
