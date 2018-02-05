import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity,
    Platform, Dimensions } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import {
    getActiveWallet,
    getAssets,
    getSelectedCurrency
} from 'quid-wallet/app/data/selectors';
import AssetRow from 'quid-wallet/app/views/components/wallet/assetRow';


const AssetRowWithNavigation = (props) => {
    return (
            <TouchableOpacity onPress={() => {
		  props.navigator.push({
		    screen: "quidwallet.home.wallet.history.WalletHistoryScreen",
		      passProps: { tokenSymbol: props.asset.symbol },
		      title: `${props.asset.symbol} Transactions`, // navigation bar title of the pushed screen (optional)
		      navigatorStyle: {		      
			  tabBarHidden: true,
		      },
		      backButtonTitle: "" // override the back button title (optional)		    
		});
	    }}>
            <AssetRow {...props} />
        </TouchableOpacity>
    );
}


class WalletAssetsContainer extends React.PureComponent {
    render() {
	const {
	    navigator,
	    assets,
	    isBalanceHidden,
	    currency
	} = this.props;

	const { height } = Dimensions.get('window');
	const HEIGHT_OFFSET = (isIphoneX() || Platform.OS === 'android' ) ? 325 : 290;
	const whiteBGHeight = Math.max(height - HEIGHT_OFFSET, (assets.length * 81));
	const Separator = (<View style={{height: 1, backgroundColor: '#e9eaeb'}} />);
	
	const Rows = assets.map((item, index) => {
	    return (
		<View key={index}>
		  { (index > 0) ? Separator : null }
		  {AssetRowWithNavigation({currency,
					   navigator,
					   currency,
					   asset: item,
					   isBalanceHidden})
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
    assets: getAssets(state),
    currency: getSelectedCurrency(state),
    isBalanceHidden: state.data.balanceHidden,
});


export default connect(mapStateToProps)(WalletAssetsContainer);
