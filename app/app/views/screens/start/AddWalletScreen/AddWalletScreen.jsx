import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import { Navigation } from 'react-native-navigation';


class AddWalletScreen extends React.Component {
    static navigatorStyle = {
	statusBarTextColorSchemeSingleScreen: 'light',
	statusBarColor: '#242836'
    }

    
    onNavigatorEvent(event) {
	if (event.type === 'NavBarButtonPress') { 
	    if (event.id === 'cancel') {
		Navigation.dismissAllModals({
		    animationType: 'slide-down' 
		});;
	    }
	}	
    }
    
    
    constructor(props) {
	super(props);
    	this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }


    _navigateTo(screen) {
	this.props.navigator.push({screen})
    }
    
    render() {	
	return (
	    <View style={styles.screen}> 
		<View style={styles.content}>
		<Text style={styles.button} onPress={() => this._navigateTo('quidwallet.start.AddWallet.CreateWallet')}>Create Wallet</Text>
		<Text style={styles.button} onPress={() => this._navigateTo('quidwallet.start.AddWallet.ImportPrivateKey')}>Import Private Key</Text>
		<Text style={styles.button} onPress={() => this._navigateTo('quidwallet.start.AddWallet.ImportKeystore')}>Import Keystore</Text>		
		<Text style={styles.button} onPress={() => this._navigateTo('quidwallet.start.AddWallet.AddWatchWallet')}>Add Watch Wallet</Text>
		</View>	      
	    </View>
	);
    }
}


export default AddWalletScreen;
