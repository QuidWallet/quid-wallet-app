import React from 'react';
import { StyleSheet, Text, View, 
	 TouchableOpacity, Image,
	 ScrollView, Linking, Platform } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import DeviceInfo from 'react-native-device-info';


const styles = StyleSheet.create({
    container: {
	flex: 1,
	flexDirection: 'column',
	alignItems: 'center',
	paddingTop: 10
    },
    buttonsContainer: {
	flex: 2
    },
    text: {
	fontSize: 11,
	marginBottom: 18,
	color: "#24283666",
    },
    buttonText: {
	fontSize: 16,

    },
    button: {
	height: 40,
	flexDirection: "column",
	justifyContent: 'center',
	paddingLeft: 20
    }
});


const ListTitle = ({title}) => {
    return (
	<Text style={{marginTop: 30, marginBottom: -10, marginLeft: 20, fontWeight: 'bold'}}>{title}</Text>
    );
}


class AboutScreen extends React.Component {
    render() {
	return (
	    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
	      <View style={styles.container}>
		<Image
		   style={{marginTop: 30, marginBottom: 10}}
		   source={require('quid-wallet/app/views/assets/images/quid_logo.png')} />
		<View style={{ alignItems: 'center' }}>
		    <Text style={styles.text}>Quid Wallet is a powerful tool to{"\n   "} manage your digital assets</Text>
		  </View>
	      </View>
	      <View style={styles.buttonsContainer}>
		<List>
		  <ListItem title="Version" rightIcon={<Text>{DeviceInfo.getReadableVersion()}</Text>}/>		
		</List>
		<ListTitle title="Legal"/>
		<List>
		  <TouchableOpacity onPress={() => this.props.navigator.push({
			screen: 'quidwallet.home.wallet.settings.WebviewScreen',
			passProps: {
			    source: Platform.OS === 'ios' ? require('quid-wallet/app/views/assets/docs/privacy.html') : {uri: "file:///android_asset/privacy.html"}
			},
			title: "Privacy Policy",
			navigatorStyle: {		      
			    tabBarHidden: true
			}
		    })}>
		    <ListItem title="Privacy Policy" />
		  </TouchableOpacity>
		  <TouchableOpacity onPress={() => this.props.navigator.push({
			screen: 'quidwallet.home.wallet.settings.WebviewScreen',
			passProps: {
			    source: Platform.OS === 'ios' ? require('quid-wallet/app/views/assets/docs/tos.html') : {uri: "file:///android_asset/tos.html"}
			},
			title: "Terms of Use",
			navigatorStyle: {		      
			    tabBarHidden: true
			}
		    })}>		    
		    <ListItem title="Terms of Use" />
		  </TouchableOpacity>
		</List>

		<ListTitle title="Powered by"/>
		<List>
		<TouchableOpacity onPress={() => Linking.openURL("https://infura.io/").catch(() => null) }>
		    <ListItem title="Infura" rightIcon={{name: "external-link", type: 'evilicon'}} />
		  </TouchableOpacity>
		  <TouchableOpacity onPress={() => Linking.openURL("https://etherscan.io/").catch(() => null) }>
		    <ListItem title="Etherscan" rightIcon={{name: "external-link", type: 'evilicon'}} />
		  </TouchableOpacity>
		<TouchableOpacity onPress={() => Linking.openURL("https://www.cryptocompare.com/").catch(() => null) }>
		    <ListItem title="Cryptocompare" rightIcon={{name: "external-link", type: 'evilicon'}} />
		  </TouchableOpacity>
		  <TouchableOpacity onPress={() => Linking.openURL("https://ethplorer.io/").catch(() => null) }>
		    <ListItem title="Ethplorer" rightIcon={{name: "external-link", type: 'evilicon'}} />
		  </TouchableOpacity>		  
		</List>
	      </View>
	      <View style={{ flex: 1, alignItems: 'center', marginTop: 30, marginBottom: 50 }}>
		  <Text style={{ fontSize: 11, color: "#24283666" }}>Copyright &copy; 2018 QuidProject</Text>
		  <Text style={{ fontSize: 11, color: "#24283666" }}>All rights reserved</Text>
	      </View>
	      
	    </ScrollView>
	);
    }
}


export default AboutScreen;
