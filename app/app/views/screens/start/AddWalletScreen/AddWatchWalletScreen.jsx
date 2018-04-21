import React from 'react';
import { connect } from 'react-redux';
import { View, TextInput, Image, Text } from 'react-native';
import { linkWatchWallet } from 'quid-wallet/app/actions/wallet';
import styles from './styles';
import FabricService from 'quid-wallet/app/services/FabricService';
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
	this.state = {
	    address: "",
	    error: ""
	};
	this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    
    submit() {
	// strip spaces from input string	
	const address = this.state.address.replace(/\s/g, '');
	try {
	    this.props.linkWatchWallet(address);
	} catch (error) {
	    FabricService.logAddingAddressFailed(address.length);
	    this.setState({ error: error.message });		
	}
    }

    
    _onAddressChange(address) {
	this.setState({address, inputTheme: "bordered", error: ""});
    }

    
    render() {	
	return (
	    <View style={styles.screen}> 
		<View style={styles.content}>
		    <View style={styles.header}>
			<Image style={styles.image} source={require('quid-wallet/app/views/assets/images/quid_logo_white.png')}/>
		    </View>
		    
		    <TextInput
			style={[
			    styles.addressInput,
			    {borderColor: (this.state.error && this.state.error.length > 0 ? '#BD3A52' : '#7C7E86')}
			]}
			onChangeText={(address) => this._onAddressChange(address)}
			autoCapitalize='none'
			autoFocus={false}
			multiline={true}
			blurOnSubmit={true}
			autoGrow={true}		      
			placeholderTextColor="#bcbcbc"
			underlineColorAndroid="#242836"
			placeholder='Enter Ethereum address to watch'/>
		    <Text style={styles.textRow}>{this.state.error}</Text>
		    <Text style={styles.button} onPress={() => this.submit() }>Continue</Text>
		    
		</View>	      
	    </View>
	);
    }
}


export default connect(null, {linkWatchWallet})(AddWalletScreen);
