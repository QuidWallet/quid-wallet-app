import React from 'react';
import { connect } from 'react-redux';
import {
    TextInput,
    Text,
    View,
    ActivityIndicator
} from 'react-native';
import { generateKeystore } from 'quid-wallet/app/actions/wallet';
import { derivePkFromKeystore } from 'quid-wallet/app/services/keystoreService';
import styles from './styles';


class ImportKeystoreScreen extends React.Component {
    constructor(props) {
	super(props);
	// default wallet config
	this.state = {
	    name: "",
	    password: "",
	    confirmPassword: "",
	    keystore: '',
	    keystorePassword: '',	    
	    loading: false,
	    error: null
	};
    }

    async _generateKeystore() {
	const { name, password, confirmPassword, keystore, keystorePassword } = this.state;
	const payload = {
	    name,
	    password,
	    confirmPassword,
	    keystore,
	    keystorePassword
	};
	try {
	    payload.privateKey = await derivePkFromKeystore({keystore: keystore, password: keystorePassword});
	    await this.props.generateKeystore(payload);
	} catch (error) {
	    this.setState({ error: error.message, loading: false });
	}
    }
    
    onSubmit() {
	// show loading indicator 
	this.setState({loading: true, error: null });

	// generate keystore
	this._generateKeystore();
    }

    render() {
	return (
	    <View style={styles.screen}> 
		<View style={styles.content}>
		    
		<TextInput style={[styles.addressInput]}
			onChangeText={(name) => this.setState({name})}
			placeholderTextColor="#bcbcbc"
			underlineColorAndroid="#242836"
			       placeholder='Wallet Name'/>
		<TextInput style={[styles.addressInput, {height: 80}]}
			onChangeText={(keystore) => this.setState({keystore})}
	    placeholderTextColor="#bcbcbc"
	    underlineColorAndroid="#242836"
	    autoCapitalize='none'
	    autoFocus={false}
	    multiline={true}
	    blurOnSubmit={true}
	    autoGrow={true}
	    maxHeight={80}
	    
	    placeholder='Keystore'/>
		
		    <TextInput style={[styles.addressInput]}
			onChangeText={(keystorePassword) => this.setState({keystorePassword})}
			placeholderTextColor="#bcbcbc"
			underlineColorAndroid="#242836"
			placeholder='Password'/>

		
		    <TextInput style={[styles.addressInput, {marginTop: 30}]}
			onChangeText={(password) => this.setState({password})}
			placeholderTextColor="#bcbcbc"
			underlineColorAndroid="#242836"
			placeholder='Password'/>
		    <TextInput style={styles.addressInput}
			onChangeText={(confirmPassword) => this.setState({confirmPassword})}
			placeholderTextColor="#bcbcbc"
			underlineColorAndroid="#242836"
			placeholder='Password Confirmation'/>		    
		    <Text style={styles.textRow}>{this.state.error ? this.state.error : ""}</Text>
		    { this.state.loading ?
		      <ActivityIndicator /> :	    
		      <Text style={styles.button} onPress={() => this.onSubmit() }>Continue</Text>}
		</View>	      
	    </View>	   
	);
    }
}


export default connect(null, { generateKeystore })(ImportKeystoreScreen);
