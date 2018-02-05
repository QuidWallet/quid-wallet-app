import React from 'react';
import { connect } from 'react-redux';
import { Text, View, TouchableOpacity } from 'react-native';
import { getActiveWallet } from 'quid-wallet/app/data/selectors';
import { unlinkWallet } from 'quid-wallet/app/actions/wallet';
import styles from './styles';


class UnlinkScreen extends React.Component {
    unlinkWallet() {
	this.props.unlinkWallet(this.props.address);
    }

    render() {
	const component = this;
	return (
	    <View style={styles.container}>
	      <Text style={styles.text}>Your wallet address:</Text>
	      <Text style={styles.address}> {this.props.address} </Text>
	      <Text style={styles.text}>By clicking "Stop watching" button you unlink the wallet</Text>
	      <Text style={styles.text}>This will NOT affect your funds or access to the wallet itself</Text>
	      <TouchableOpacity
		 style={styles.unlinkWalletButton}
		 onPress={() => component.unlinkWallet()}
		underlayColor='#fff'>
		<Text style={[styles.unlinkWalletButtonText]}>Stop watching</Text>
	      </TouchableOpacity>
	    </View>
	);
    }
}


const mapStateToProps = state => ({
    address: getActiveWallet(state).address
});


export default connect(mapStateToProps, { unlinkWallet })(UnlinkScreen);
