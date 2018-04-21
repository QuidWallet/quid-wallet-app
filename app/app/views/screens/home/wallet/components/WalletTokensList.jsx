import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity,
    Platform, Dimensions } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import {
    getActiveWallet,
    getActiveWalletTokens,
    getSelectedCurrency
} from 'quid-wallet/app/data/selectors';
import TokenRow from './tokenRow';


class WalletTokensList extends React.PureComponent {
    
    _renderRow(props) {
	const {token, navigator} = props;
	return (
		<TouchableOpacity onPress={() => {
		    navigator.push({
			screen: "quidwallet.home.wallet.history.WalletHistoryScreen",
			passProps: { tokenAddress: token.contractAddress },
			title: `${token.symbol} Transactions`, // navigation bar title of the pushed screen (optional)
			navigatorStyle: {		      
			    tabBarHidden: true,
			},
			backButtonTitle: "" // override the back button title (optional)		    
		    });
		}}>
		<TokenRow {...props} />
		</TouchableOpacity>
	);
    }

    
    render() {
	const {
	    navigator,
	    tokens,
	    isBalanceHidden,
	    currency
	} = this.props;

	const { height } = Dimensions.get('window');
	const HEIGHT_OFFSET = (isIphoneX() || Platform.OS === 'android' ) ? 325 : 290;
	const whiteBGHeight = Math.max(height - HEIGHT_OFFSET, (tokens.length * 81));
	const Separator = (<View style={{height: 1, backgroundColor: '#e9eaeb'}} />);
	
	const Rows = tokens.map((token, index) => {
	    return (
		<View key={index}>
		    { (index > 0) ? Separator : null }
		{
		    this._renderRow({
			currency,
			navigator,
			currency,
			token,
			isBalanceHidden
		    })
		}
		</View>
	    );
	});
	
	return (
	    <View style={{height: whiteBGHeight, backgroundColor: "#fff"}}>
	      { Rows }		
	    </View>
	);
    }
}


const mapStateToProps = state => ({
    activeWallet: getActiveWallet(state),
    tokens: getActiveWalletTokens(state),
    currency: getSelectedCurrency(state),
    isBalanceHidden: state.data.balanceHidden
});


export default connect(mapStateToProps)(WalletTokensList);
