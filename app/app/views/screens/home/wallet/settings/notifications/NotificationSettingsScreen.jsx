import React from 'react';
import { connect } from 'react-redux';
import { Text, StyleSheet, View, FlatList, Alert, Platform, Linking, AppState } from 'react-native';
import { getWallets } from 'quid-wallet/app/data/selectors';
import { toggleCurrency } from 'quid-wallet/app/actions/currency';
import { shortAddress } from 'quid-wallet/app/utils';
import {
    updateGeneralNotificationsIsOnValue,
    getNotificationsSettings,
    updateAddressSubscription
} from 'quid-wallet/app/actions/notifications';
import Switch from 'quid-wallet/app/views/components/switch/CurrencySwitcher';
import firebase from 'react-native-firebase';


const styles = StyleSheet.create({
    container: {
	flex: 1,
	backgroundColor: "#fff",
    },
    row: {
	flexDirection: 'row',
	justifyContent: 'space-between',
	paddingHorizontal: 17.5,
	alignItems: 'center'
    },
});


class NotificationSettingsScreen extends React.Component {
    constructor(props) {
	super(props);
	this.state = {
	    fetching: false,
	    permissionsGranted: true,
	    appState: AppState.currentState
	};
    }

    
    componentWillUnmount() {
	AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {	
	// for rerendering screen on resume
	this._checkIosNotificationPermissions();	
	this.setState({appState: nextAppState});
    }
    

    componentDidMount() {
	AppState.addEventListener('change', this._handleAppStateChange);
	
	this._fetchNotificationsSettingsFromServer();

	// check persmissions for ios in order to show
	// help text how to allow notifications
	this._checkIosNotificationPermissions();
    }
    
    async _checkIosNotificationPermissions() {
	if (Platform.OS === 'ios') {
	    const result = await firebase.messaging().requestPermissions();
	    const permissionsGranted = result && result.granted;
	    this.setState({permissionsGranted});
	}
    }
    
    async _updateNotificationSettings(value) {
	this.setState({fetching: true});
	
	try {
	    await this.props.updateGeneralNotificationsIsOnValue(value);
	    this.setState({fetching: false});
	} catch (err) {
	    // console.tron.log(err);
	    Alert.alert("Error on Notifications update.", "Please try again later.");
	    this.setState({fetching: false});
	};
    }
    
    async _fetchNotificationsSettingsFromServer() {
	if (!this.props.deviceId) { return null; }
	this.setState({fetching: true});
	try {
	    await this.props.getNotificationsSettings({deviceId: this.props.deviceId});
	    this.setState({fetching: false});
	} catch (err) {
	    this.setState({fetching: false});
	};
    };

    async _onAddressSettingToggle({isOn, address}) {
	this.setState({fetching: true});
	try {
	    await this.props.updateAddressSubscription({
		address,
		isOn
	    });
	    this.setState({fetching: false});
	} catch (err) {
	    Alert.alert("Error on Notifications update.", "Please try again later.");
	    this.setState({fetching: false});
	};
    }
    
    _renderAddressRow({ item }) {
	const { address, active } = item;
	return (
	    <View>
		<View style={styles.row}>
		<Text style={{fontSize: 18}}>{shortAddress(address, 6)}</Text>
		<Switch style={{marginVertical: 14}}
	    value={active}
	    name="Display"
	    disabled={this.state.fetching}
	    onValueChange={newVal => this._onAddressSettingToggle({isOn: newVal, address})} />
		</View>
		</View>
	);
    }

    _renderMainSwitch() {
	const Separator = (<View style={{height: 1, backgroundColor: '#e9eaeb'}} />);
	return (
	    <View>
		<View style={styles.row}>
		<Text style={{fontSize: 18}}>Allow Notifications</Text>
		<Switch style={{marginVertical: 14}}
	    value={this.props.isOn}
	    name="Display"
	    disabled={this.state.fetching}
	    onValueChange={this._updateNotificationSettings.bind(this)} />
		</View>
		{ Separator }
		</View>
	);
    }
    
    render() {
	const addressesData = this.props.wallets.map(wallet => {
	    return {
		address: wallet.address,
		active: this.props.addressNotificationsDct[wallet.address]
	    };
	});

	
	// addresses on server
	const subscribedAddressesFromServer = Object
		  .keys(this.props.addressNotificationsDct)
		  .map(address => address)
		  .filter(address => this.props.addressNotificationsDct[address])
		  .filter(address => addressesData.filter(a => a.address === address).length === 0);
	
	
	// add addresses from server, which were not in local state
	subscribedAddressesFromServer.map(address => {
	    addressesData.push({
		address,
		active: true
	    });
	});
					  

	if (!this.state.permissionsGranted) {
	    return (
		    <View style={{padding: 10}}>
		    <Text style={{fontWeight: 'bold'}}>Notifications are off.</Text>		    
		    <Text>Turn on notifications in device settings.</Text>
		    <Text style={{color: 'blue', paddingTop: 20}} onPress={() => {Linking.openURL('app-settings:');}}>GO TO DEVICE SETTINGS</Text>
		    </View>
	    );
	}
	
	return (
		<View style={{ flex: 1 }}>		
		{ this._renderMainSwitch() }
	    { this.props.isOn ?
	      <FlatList
	      style={styles.container}
	      data={addressesData}
	      renderItem={this._renderAddressRow.bind(this)}
	      keyExtractor={(item) => item.address}
	      /> : null }
	    </View>		
	);
    }
}


const mapStateToProps = state => {
    const { isOn } = state.data.notifications.generalSettings;
    return ({
	wallets: getWallets(state),
	isOn,
	addressNotificationsDct: state.data.notifications.addresses,
    });
}


export default connect(mapStateToProps, {
    toggleCurrency,
    updateGeneralNotificationsIsOnValue,
    getNotificationsSettings,
    updateAddressSubscription
})(NotificationSettingsScreen);
