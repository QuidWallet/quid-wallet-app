import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, FlatList,
	 Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { getTokensList, getActiveWalletDisplayTokensSettings, getActiveWalletTokens } from 'quid-wallet/app/data/selectors';
import { SearchBar } from 'react-native-elements';
import escapeRegExp from 'escape-string-regexp';
import { toggleDisplayTokenSetting } from 'quid-wallet/app/actions/wallet/common';
// import FabricService from 'quid-wallet/app/services/FabricService';
import TokenAvatar from 'quid-wallet/app/views/components/TokenAvatar';


const styles = StyleSheet.create({
    container: {
	flex: 1,
	backgroundColor: "#fff",
    },
    row: {
	flexDirection: 'row',
	justifyContent: 'space-between',
	paddingHorizontal: 17.5,
	alignItems: 'center',
	height: 60
    },
});


class TokensListScreen extends React.Component {
    static navigatorButtons = {
	rightButtons: [{
	    icon: require('quid-wallet/app/views/assets/icons/infoicon.png'), // for icon button, provide the local image asset name
	    id: 'info' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
	}]
    }

    
    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
	if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
	    if (event.id == 'info') { // this is the same id field from the static navigatorButtons definition
		Alert.alert(
		    'Token Display Options',
			`\nHIDE: always hides token.\n\nAUTO: shows token only when positive balance autodetected.\n\nSHOW: always shows token.`
		);
	    }
	}
    }
    
    constructor(props) {
	super(props);
	this.state = {
	    search: ""
	};

	// tokens to show
	this.tokensDct = {};
	
	// if tokens are not searched, show tokens in wallet + tokens with not default setting	    
	const { displaySettingsDct, walletTokens } = this.props;
        Object.keys(displaySettingsDct).map(tokenAddress => {
	    const value = displaySettingsDct[tokenAddress];
	    if (value === "HIDE" || value === "SHOW") {
		this.tokensDct[tokenAddress] = true;
	    }
        });

	// add wallet tokens
        walletTokens.map(token => this.tokensDct[token.contractAddress] = true);

	// catch info icon click
	this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    
    _renderCurrencyRow({ item }) {
	const token = item;
	const currentValue = this.props.displaySettingsDct[token.contractAddress] || "AUTO";
	const isEther = token.contractAddress === '0x000_ether'; // TODO move to constants.js
	if (isEther) { return null }
	
	const buttonConfigDct = {
	    "SHOW": {
		next: "HIDE",
		styles: {
		    backgroundColor: "#00BF19",
		    color: 'white'
		}
	    },
	    "AUTO": {
		next: "SHOW",
		styles: {
		    color: "black",
		    backgroundColor: "#eee"
		}
	    },
	    "HIDE": {
		next: "AUTO",
		styles: {
		    backgroundColor: "#E33E59",
		    color: 'white'
		}
	    }
	};	  
	
	return (
	    <View key={token.symbol}>
	      <View style={styles.row}>
		<TokenAvatar symbol={token.symbol} contractAddress={token.contractAddress} />
		  <TouchableOpacity
		  style={[ {
		      padding: 10,
		      width: 63,
		      alignItems: 'center',
		      borderRadius: 20
		  }, {backgroundColor: buttonConfigDct[currentValue].styles.backgroundColor}]}
	    onPress={() => {
		// show tokens in list 
		this.tokensDct[token.contractAddress] = true;
		const nextValue = buttonConfigDct[currentValue].next;
		this.props.toggleDisplayTokenSetting(token.contractAddress, nextValue);		      
	    }}>
		   <Text style={{color: buttonConfigDct[currentValue].styles.color}}>{currentValue}</Text>
		   </TouchableOpacity>
	    </View>
		</View>
	);
    }
    
    render() {
	const { allTokens } = this.props;

	// show 
	let showingTokens;
	if (this.state.search) {
	    const match = new RegExp(escapeRegExp(this.state.search), 'i');
	    showingTokens = allTokens.filter((token) => match.test(token.symbol));
	} else {
	    // if tokens are not searched, show tokens in wallet + tokens with not default setting
	    showingTokens = allTokens.filter(token => this.tokensDct[token.contractAddress]);
	}

	return (
	    <View style={{ flex: 1 }}>
	      <SearchBar
		 lightTheme
		 round={true}
		  containerStyle={{
		      backgroundColor: '#fff',
		      borderTopWidth: 0
		  }}		     
		 onChangeText={(input) => {
			 this.setState({ search: input });

			 // #fabric-analytics
			 //FabricService.logTokenSearchOnDisplayCurrencyScreen(input);
		 }}
	         defaultValue={this.state.search}
		 clearIcon={this.state.search ? true : false}			
		  placeholder='Search token...' />
	      <FlatList
		  style={styles.container}
		  data={showingTokens}
		  renderItem={this._renderCurrencyRow.bind(this)}
	    keyExtractor={token => token.contractAddress}
	    ListFooterComponent={this._renderFooter.bind(this)}

	    
		/>

	    </View>
	);
    }
    
    _renderFooter() {
	const tokensCount = Object.keys(this.tokensDct).length;
	let noSearchMsg;
	if (tokensCount > 1) {
	    noSearchMsg = `Showing tokens currently found in active wallet. To set display settings for other tokens search token by symbol.`;
	} else {
	    noSearchMsg = `No tokens found in active wallet. To set display settings for other tokens search token by symbol.`;
	}

	
	return (
		<View style={{padding: 20}}>
		{ !this.state.search ? <Text>{noSearchMsg}</Text> :
		  <View>
		<Text>If you can't find needed token, please inform us at:</Text>
<Text style={{fontWeight: 'bold'}} onPress={() => Linking.openURL('mailto:tokens@quidwallet.com?subject=New Token Request')}>tokens@quidwallet.com</Text>
<Text>And we will add them briefly.</Text>
</View> }
	   </View>
	);
    }
}


const mapStateToProps = (state) => {
    return ({
	allTokens: getTokensList(state),
	walletTokens: getActiveWalletTokens(state),
	displaySettingsDct: getActiveWalletDisplayTokensSettings(state)
    });
}

export default connect(mapStateToProps, { toggleDisplayTokenSetting })(TokensListScreen);
