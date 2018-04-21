import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
import tokenIcons from 'quid-wallet/app/utils/tokenIcons.js';
import { human } from 'react-native-typography';


const styles = StyleSheet.create({
    circleIcon: {
        height: 30,
        width: 30,
        borderRadius: 15,
        margin: 2
    },
    circle: {
        marginLeft: 14,
        height: 36,
        width: 36,
        marginRight: 15,
        borderRadius: 18,
        borderColor: "#d4d4d7",
        borderWidth: 1,
    },
    assetSymbolContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
    }
});


class TokenAvatar extends React.PureComponent {    
    render() {
	const { symbol, contractAddress, darkTheme } = this.props;
	const tickerColor = darkTheme ? '#fff' : '#242836';
	const circleColor = darkTheme ? '#242836' : '#fff';
	
	return (	    
            <View style={styles.assetSymbolContent}>
		<View style={[styles.circle, {backgroundColor: circleColor}]}>
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
		<Text style={[human.title3, {color: tickerColor, letterSpacing: 1, lineHeight: 20}]}>{symbol}</Text>
            </View>
	);
    }
}


export default TokenAvatar
