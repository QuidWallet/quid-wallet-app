import React from 'react';
import { Text, View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { fetchTokenTransactions } from 'quid-wallet/app/actions/transactions';
import { getActiveWallet, getAssetTransfers } from 'quid-wallet/app/data/selectors';
import TransactionRow from './TransactionRow';


class TokenTransactions extends React.Component {
    _keyExtractor = (item) => item.id;
    
    componentDidMount() {
	this._fetchData();
    }

    _fetchData() {
	const { fetchTokenTransactions, address } = this.props;	
	const tokenAddress = this.props.asset.address; // token contract address	
	fetchTokenTransactions(address, tokenAddress);
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
		    renderItem={({ item }) => <TransactionRow tx={item} asset={this.props.asset} navigator={this.props.navigator}/>}
		/>
	    </View>
	);
    }
}


const mapStateToProps = (state, props) => ({
    address: getActiveWallet(state).address,
    transactions: getAssetTransfers(state, props),
    refreshing: state.refreshers.fetchingTransactions
});


export default connect(mapStateToProps, {fetchTokenTransactions})(TokenTransactions);
