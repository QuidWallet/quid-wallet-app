import React from 'react';
import { connect } from 'react-redux';
import { Text, View, Image, TouchableOpacity,
	 ImageBackground, Dimensions } from 'react-native';
import { human, systemWeights } from 'react-native-typography';
import { toggleHiddenBalance } from 'quid-wallet/app/actions/app';
import {
    getActiveWalletTotalBalance,
    getActiveWallet,
    getSelectedCurrency
} from 'quid-wallet/app/data/selectors';
import { shortAddress } from 'quid-wallet/app/utils';
import TextWithCopy from 'quid-wallet/app/views/components/TextWithCopy';
import { formatToCurrency } from 'quid-wallet/app/utils';


const smallLabelStyle = {
    color: "#737477",
    backgroundColor: 'transparent',
    paddingLeft: 14 
}


const TotalBalanceRow = (totalBalance, currency, isBalanceHidden, toggleHiddenBalance) => {
    const totalBalanceFormatted  = formatToCurrency(totalBalance, currency);
    const priceFontStyles = [human.title2White, {
	marginLeft: 14,
	marginTop: 5,
	...systemWeights.bold
    }];
    const balanceString = isBalanceHidden ? "Balances Hidden" : totalBalanceFormatted;
    return (
    	<View style={{marginTop: 100}}>
	  <Text style={[ human.caption2, smallLabelStyle ]}>Total assets </Text>

	  <TouchableOpacity onPress={() => toggleHiddenBalance()}>
	    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
	      <Text style={priceFontStyles}>{balanceString}</Text>
	      <Image source={require("quid-wallet/app/views/assets/icons/eye.png")} style={{marginRight: 14, marginTop: 9}} />
	      </View>
	  </TouchableOpacity>
	</View>
    );
}


const SettingsIcon = (navigator) => {
    return (
	<TouchableOpacity
	   onPress={() => navigator.push({
	       screen: "quidwallet.home.wallet.WalletSettingsScreen",
	       title: "Settings",
	       navigatorStyle: {		      
		   tabBarHidden: true
	       }
	  })}
	  style={{paddingRight: 14, paddingTop: 23, paddingLeft: 14}}>
	  <Image source={require("quid-wallet/app/views/assets/icons/settings.png")} />
	</TouchableOpacity>
    );
}


class HeaderContent extends React.PureComponent {
    render () {
	const { wallet, totalBalance, currency, navigator, isBalanceHidden, toggleHiddenBalance } = this.props;
	const shortedAddress = shortAddress(wallet.address, 6);
	
	return (
	    <View style={{flex: 1}}>
	      { TotalBalanceRow(totalBalance, currency, isBalanceHidden, toggleHiddenBalance) }
	      <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginTop: 33}}>		
		<TextWithCopy valueToCopy={wallet.address}>
		  <Text style={[ human.caption2, smallLabelStyle ]}>Wallet address (press to copy)</Text>
		  <Text style={{
			    fontSize: 12,
			    color: "#fff",
			    lineHeight: 16,
			    letterSpacing: 0.1,
			    backgroundColor: 'transparent',
			    paddingLeft: 14,
			    marginTop: 10
			}}>{shortedAddress}</Text>
		</TextWithCopy>		
		{ SettingsIcon(navigator) } 
	      </View>
	    </View>	  
	    
	);
    }
} 


const mapStateToProps = state => ({
    wallet: getActiveWallet(state),
    totalBalance: getActiveWalletTotalBalance(state),
    currency: getSelectedCurrency(state),
    isBalanceHidden: state.data.balanceHidden
});


const ConnectedHeaderContent = connect(mapStateToProps, {
    toggleHiddenBalance
})(HeaderContent);


class WalletHeader extends React.PureComponent {
    render() {
	const backgroundImg = require('quid-wallet/app/views/assets/images/wallet_backgrounds/moon.jpg');
	const { width } = Dimensions.get('window');
	return (
	    <View>
	      <ImageBackground style={{width, height: 245}} source={backgroundImg}>	
		<ConnectedHeaderContent navigator={this.props.navigator} />
	      </ImageBackground>
	    </View>
	);
    }    
}


export default WalletHeader;
