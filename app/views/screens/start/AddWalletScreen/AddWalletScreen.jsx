import React from 'react';
import { connect } from 'react-redux';
import { View, TextInput, Image, Text } from 'react-native';
import web3Service from 'quid-wallet/app/services/web3Service';
import { linkWatchWallet } from 'quid-wallet/app/actions/wallet';
import styles from './styles';
import { Navigation } from 'react-native-navigation';
import FabricService from 'quid-wallet/app/services/FabricService';


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
	    addressIsValid: "",
	    warning: false
	};

	this.web3 = web3Service.getWeb3();

   	// listen navigator events
    	this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    
    submit() {
	// strip spaces from input string
	const address = this.state.address.replace(/\s/g, '');
	
	const isAddress = this.web3.isAddress(address);
	this.setState({addressIsValid: isAddress});
	if (!isAddress){
	    FabricService.logAddWalletFailed(address.length);
	    this.setState({warning: true});	    
	} else{
	    this.setState({inputTheme: "bordered", warning: false});
	    this.props.linkWatchWallet(address);
	}		
    }

    
    _onAddressChange(address) {
	this.setState({address, inputTheme: "bordered", warning: false});
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
			    {borderColor: (this.state.warning ? '#BD3A52' : '#7C7E86')}
			]}
			onChangeText={(address) => this._onAddressChange(address)}
			autoCapitalize='none'
			autoFocus={false}
			multiline={true}
			blurOnSubmit={true}
			autoGrow={true}		      
			placeholderTextColor="#bcbcbc"
			underlineColorAndroid="#242836"
			placeholder='Enter wallet address to watch'/>
		    <Text style={styles.textRow}>{this.state.warning === true ? "Wallet you entered does not exist" : ""}</Text>
		    <Text style={styles.button} onPress={() => this.submit() }>Continue</Text>
		    
		</View>	      
	    </View>
	);
    }
}


export default connect(null, {linkWatchWallet})(AddWalletScreen);
