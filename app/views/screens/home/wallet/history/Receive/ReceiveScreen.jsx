import React from 'react';
import { connect } from 'react-redux';
import {
    Button,
    Text,
    View,
    Clipboard,
    Alert
} from 'react-native';
import QRCode from 'react-native-qrcode';
import { getActiveWallet } from 'quid-wallet/app/data/selectors';


class ReceiveScreen extends React.Component {
    _copy(value, alertText) {
	Clipboard.setString(value);
	Alert.alert(
	    '',
	    alertText,
	);
    }

    render() {
	const component = this;
	const { wallet } = this.props;
	const address = wallet.address;
	return (
	    <View style={{
		flex: 1,
		backgroundColor: '#fff'
	    }}>
		<View style={{
		    flexDirection: 'row',
		    justifyContent: 'center',
		    marginTop: 100
		}}>
		    <QRCode value={ `ethereum:${address}`} size={200} />
		</View>
		<View style={{marginTop: 50}}>
		    <Text>{ address }</Text>		    
		    <Button title="Copy address" onPress={() => component._copy(address, "Address Copied")}/>		
		    <Button title="Copy keystore" onPress={() => component._copy(wallet.keystore, "Keystore Copied")}/>
		</View>
	    </View>
	);
    }
}


const mapStateToProps = (state) => ({
    wallet: getActiveWallet(state)
});


export default connect(mapStateToProps)(ReceiveScreen);
