import React from 'react';
import { View } from 'react-native';
import SettingsRow from './SettingsRow';


class SettingsScreen extends React.Component {
    render() {
	const { navigator } = this.props;
	return (
	    <View style={{
		      flex: 1, 
		      backgroundColor: '#fff'
		  }}>
	      <View style={{flex: 4}}>
		<View style={{marginTop: 40}}>
		  <SettingsRow navigator={navigator} title="Display Currencies" screen="CurrenciesSettingsScreen" icon={require('quid-wallet/app/views/assets/icons/settings/icon_currency_settings.png')}/>
		</View>
		<View style={{marginTop: 20}}>
		  <SettingsRow navigator={navigator} title="Token List" screen="TokensListScreen" icon={require('quid-wallet/app/views/assets/icons/settings/icon_token_settings.png')}/>
		</View>	
		<View style={{marginTop: 20}}>
		  <SettingsRow navigator={navigator} title="Notifications" screen="NotificationSettingsScreen" icon={require('quid-wallet/app/views/assets/icons/settings/icon_token_settings.png')}/>
		</View>
		
		<View style={{marginTop: 20}}>
		  <SettingsRow navigator={navigator} title="Unlink Wallet" screen="UnlinkWalletScreen" icon={require('quid-wallet/app/views/assets/icons/settings/icon_unlink_wallet_settings.png')}/>
		    </View>
		<View style={{marginTop: 20}}>
		  <SettingsRow navigator={navigator} title="About" screen="AboutScreen" icon={require('quid-wallet/app/views/assets/icons/settings/icon_about_us.png')}/>
		    </View>
	      </View>

	      
	    </View>
	);
    }
}


export default SettingsScreen;
