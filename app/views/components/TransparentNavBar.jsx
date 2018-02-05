import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { human } from 'react-native-typography';
import { getWalletIcon } from 'quid-wallet/app/utils/getWalletIcon';
import CurrencySwitcherIcon from 'quid-wallet/app/views/components/currency-switcher/CurrencySwitcherIcon';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { getActiveWallet } from 'quid-wallet/app/data/selectors';


const styles = StyleSheet.create({
    navbarContainer: {
	height: 49,
	...Platform.select({
	    ios: {
		...ifIphoneX({
		    marginTop: 30
		}, {
		    marginTop: 20
		})
	    },
	    android: {
		marginTop: 0,
	    },	    
	}),
    },
    navbar: {
	backgroundColor: 'transparent',
	flex: 1,
	flexDirection: 'row',
        justifyContent: 'space-between',
	height: 50
    },
    title: {
	marginLeft: -4,
	paddingTop: 17,
	lineHeight: 20
    },
    walletIcon: {
	marginLeft: 14,
	marginTop: 15,	
	width: 28,
	height: 28,
	borderColor: "#fff",
	borderWidth: 2,
	borderRadius: 14
    },
});


class TransparentNavBar extends React.PureComponent {
    render() {
	const { title, walletIcon, navigator } = this.props;
	let iconAddress;
	if (walletIcon !== false) {
	    iconAddress = getWalletIcon(walletIcon);
	} else {
	    iconAddress = false;
	}
	return (
	    <View style={styles.navbarContainer}>
	      <View style={styles.navbar}>
		  <TouchableOpacity style={{width: 80}} onPress={() => {
		      navigator.toggleDrawer({
			  side: 'left',
			  animated: true
		      });}}>
		      <Image
			  style={styles.walletIcon}
			  source={iconAddress} />
		  </TouchableOpacity>
		  <Text style={[human.bodyWhite, styles.title]}>{title}</Text>
		  <CurrencySwitcherIcon navigator={navigator}
		  color='white'
				    stylesContainer={{paddingTop: 12, paddingRight: 12}}
					stylesButton={{}}/>
	      </View>
	    </View>
	);
    }
}


export default connect(state => ({
    walletIcon: getActiveWallet(state).icon
}))(TransparentNavBar);
