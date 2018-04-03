import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import TokenAvatar from 'quid-wallet/app/views/components/TokenAvatar';
import { systemWeights, human } from 'react-native-typography';
import { TimeAgoWithIcon } from 'quid-wallet/app/views/components/TimeAgo';
import { getPriceChangeFormatObj } from 'quid-wallet/app/views/helpers/price';


const styles = StyleSheet.create({
    tokenHeaderRow: {
        flex: 1,
        flexDirection: 'row',
        height: 44,
        marginLeft: 12,
        marginRight: 12,
        marginTop: 12,
	marginBottom: 12
    },
    tokenRow: {
        flex: 1,
        flexDirection: 'row',
        height: 80,
        justifyContent: 'space-between',
        marginLeft: 12,
        marginRight: 12,
    },
    centeredFlexEnd: {
        flex: 2,
        flexDirection: "column",
        alignItems: 'flex-end',
        justifyContent: 'center'
    },    
    tableTitle: {
	fontSize: 13,
	color: '#7C7E86',
	lineHeight: 13,
	paddingTop: 13,
	paddingBottom: 18,
	textAlign: 'right'
    },
    updated: {
	textAlign: 'right',
	fontSize: 9,
	color: '#7C7E86',
	lineHeight: 10,
	...systemWeights.light,
	paddingRight: 14
    },
    
});

const cachedStyles = {
    priceValue: [human.title3White, { marginTop: 7, lineHeight: 20, textAlign: 'right', ...systemWeights.bold }],
    priceValueDetailsScreen: [human.title3, { marginTop: 7, lineHeight: 20, textAlign: 'right' }],    
    priceChange: [human.caption1, {
	marginTop: 5,
	textAlign: 'right',
	...systemWeights.bold
    }]
}


export const TokenPriceHeaderRow = (timestampUpdated) => {
    return (
	    <View>
	    <TimeAgoWithIcon timestamp={timestampUpdated} style={
		[...human.caption2,
		 styles.updated
		]
	    } />
	    
            <View style={styles.tokenHeaderRow}>
            <View style={{ flex: 1 }}>
            <Text style={[styles.tableTitle, {textAlign: 'left', marginLeft: 58, minWidth: 100}]}> Token </Text>
            </View>
            <View style={{ flex: 2 }}>
            <Text style={styles.tableTitle}> Current Price</Text>
            </View>
            </View>
	    </View>
    );
}


export class TokenPriceRow extends React.PureComponent {
    render() {
	const { token, navigator, currency } = this.props;
	const { price, color, priceChangeString } = getPriceChangeFormatObj({...token, currency});
	
	return (
            <TouchableOpacity onPress={() => {
		    navigator.push({
                      screen: "quidwallet.home.market.TokenMarketDetailsScreen",
			passProps: { token: token },
			title: `${token.symbol}`, // navigation bar title of the pushed screen (optional)
			navigatorStyle: {		      
			    tabBarHidden: true,
			},			
			backButtonTitle: "" // override the back button title (optional)		    
		    });
            }}>
		<View style={styles.tokenRow}>
		    <View style={{flex: 2, flexDirection: 'row'}}>
			<TokenAvatar symbol={token.symbol} contractAddress={token.contractAddress} darkTheme={true} />
			<View style={{flexDirection: "column", alignItems: 'center', justifyContent: 'center'}}>
			    {token.isFavorite ? <Image style={{marginRight: 10}} source={require('quid-wallet/app/views/assets/icons/icon_favorite.png')} /> : null}
			</View>                                
                    </View>            
		    <View style={styles.centeredFlexEnd}>
			<Text style={cachedStyles.priceValue}>{price}</Text>
			<Text style={[...cachedStyles.priceChange ,{ color }]}>{priceChangeString}</Text>
		    </View>
		</View>
	    </TouchableOpacity>
	);
    }
}


export default TokenPriceRow;
