import React from 'react';
import { connect } from 'react-redux';
import { Text, View, Image,
	 TouchableOpacity, StyleSheet,
	 ScrollView, Platform } from 'react-native';
import { selectWallet } from 'quid-wallet/app/actions/wallet';
import { getActiveWallet, getWallets } from 'quid-wallet/app/data/selectors';
import { shortAddress } from 'quid-wallet/app/utils';
import { getWalletIcon } from 'quid-wallet/app/utils/getWalletIcon';
import { Navigation } from 'react-native-navigation';
import FabricService from 'quid-wallet/app/services/FabricService';


const styles = StyleSheet.create({
    optionRow: {
	flex: 1,
	flexDirection: 'row',
	height: 60,
	marginTop: 10
    },
    walletIconActive: {
	marginLeft: 10,
	marginTop: 12,
	marginRight: 15,
	borderWidth: 2,
	borderColor: '#242836',
	borderRadius: 18
    },
    walletIcon: {
	marginLeft: 10,
	marginTop: 12,
	marginRight: 15
    },
    textActive: {
	fontSize: 20,
	marginTop: 15,
	marginRight: 10,
	fontWeight: 'bold'
    },
    text: {
	fontSize: 20,
	marginTop: 15,
	marginRight: 10,	
    }
});


class WalletDrawerScreen extends React.Component {
    render() {
	const walletsRows = this.props.wallets.map((wallet, index) => {
	    return this._walletButton(wallet, index);
	});

	const drawerContainerStyles = { flex: 1, backgroundColor: "#fff", paddingTop: 60 };

	if (Platform.OS === "android") {
	    drawerContainerStyles.width = 280;
	}

	return (
	    // fix issue with react native navigation drawer
	    // details - https://github.com/wix/react-native-navigation/issues/1942
	    <ScrollView style={drawerContainerStyles}>
	      {walletsRows}
	      <TouchableOpacity onPress={() => this._pressAddWalletButton()}>
		<View style={[styles.optionRow]}>
		  <Image
		     style={styles.walletIcon}
		     source={require('quid-wallet/app/views/assets/icons/add_new_wallet.png')} />
		  <Text style={styles.text}>Add new wallet</Text>
		</View>
	      </TouchableOpacity>
	    </ScrollView>
	);
    }

    _pressAddWalletButton() {
	this.props.navigator.toggleDrawer({
	    side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
	    animated: false, // does the toggle have transition animation or does it happen immediately (optional)
	    to: 'closed' // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
	});

	Navigation.showModal({
	    screen: 'quidwallet.start.AddWallet',
	    passProps: {}, // simple serializable object that will pass as props to the modal (optional)
	    navigatorButtons: {
		leftButtons: [{
		    id: 'cancel',
		    title: 'Close',
		    disableIconTint: true, 
		    buttonColor: 'white'		    
		}]
	    },
	    navigatorStyle: {
		navBarTextColor: '#000000',
		navBarBackgroundColor: '#242836',
		navBarButtonColor: '#fff',
		tabBarHidden: true,
		navBarNoBorder: true,
	    },
	    animationType: 'slide-up' 
	});	
    }

    _walletButton(wallet, index) {
	const name = `Wallet ${shortAddress(wallet.address, 3)}`;
	const active = wallet.address === this.props.address;
	const iconAddress = getWalletIcon(wallet.icon);
	return (
	    <TouchableOpacity onPress={() => this._selectWallet(wallet.address)} key={index}>
	      <View style={[styles.optionRow]}>
		<Image
		   style={active ? styles.walletIconActive : styles.walletIcon}
		   source={iconAddress} />
		<Text style={active ? styles.textActive : styles.text}>{name}</Text>
	      </View>
	    </TouchableOpacity>
	);
    }

    _selectWallet(address) {
	this.props.navigator.toggleDrawer({
	    side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
	    animated: true, // does the toggle have transition animation or does it happen immediately (optional)
	    to: 'closed' // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
	});


	if (this.props.address !== address) {
	    // #fabric-analytics
	    FabricService.logWalletChanged();
	    
	    this.props.selectWallet(address);
	}
    }
}


const mapStateToProps = (state) => ({
    address: getActiveWallet(state).address,
    wallets: getWallets(state)
});


export default connect(mapStateToProps, { selectWallet })(WalletDrawerScreen);

