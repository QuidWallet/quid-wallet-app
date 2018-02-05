import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
import tokenIcons from 'quid-wallet/app/utils/tokenIcons.js';
import { human } from 'react-native-typography';


const styles = StyleSheet.create({
    circleIcon: {
        height: 22,
        width: 22,
        borderRadius: 11,
        margin: 1,	
	backgroundColor: 'white'
    },
    circle: {
        height: 26,
        width: 26,
        marginRight: 8,
        borderRadius: 13,
        borderColor: "#d4d4d7",
        borderWidth: 1,
    },
    assetSymbolContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
    }
});


class TokenAvatarSmall extends React.PureComponent {    
    render() {
	const { symbol, contractAddress} = this.props;
	return (	    
            <View style={styles.assetSymbolContent}>
		<View style={styles.circle}>
		  <ImageLoad
                  source={tokenIcons(contractAddress)}
                  style={styles.circleIcon}
		  isShowActivity={false}
		  placeholderSource={require('quid-wallet/app/views/assets/icons/default_token.png')}
		  customImagePlaceholderDefaultStyle={styles.circleIcon}
		  loadingStyle={styles.circleIcon}
		  borderRadius={15}
		  placeholderStyle={styles.circleIcon}
		  />
		  
              </View>
		<Text style={[human.callout, {color: '#242836', lineHeight: 16}]}>{symbol}</Text>
            </View>
	);
    }
}


export default TokenAvatarSmall
