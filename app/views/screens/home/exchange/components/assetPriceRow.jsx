import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import TokenAvatar from 'quid-wallet/app/views/components/TokenAvatar';
import { systemWeights, human } from 'react-native-typography';


const styles = StyleSheet.create({
    assetHeaderRow: {
        flex: 1,
        flexDirection: 'row',
        height: 44,
        marginLeft: 12,
        marginRight: 12,
        marginTop: 12,
	marginBottom: 12
    },
    assetRow: {
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


export const AssetPriceHeaderRow = () => {
    return (
        <View style={styles.assetHeaderRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.tableTitle, {marginRight: 20}]}> Token </Text>
          </View>
          <View style={{ flex: 2 }}>
            <Text style={styles.tableTitle}> Current Price</Text>
          </View>
        </View>
    );
}


export class AssetPriceRow extends React.PureComponent {
    render() {
	const { asset, navigator } = this.props;
	
	const { renderRowCache } = asset;
	return (
            <TouchableOpacity onPress={() => {
		    navigator.push({
                      screen: "quidwallet.home.exchange.AssetDetailsScreen",
			passProps: { asset: asset },
			title: `${asset.symbol}`, // navigation bar title of the pushed screen (optional)
			navigatorStyle: {		      
			    tabBarHidden: true,
			},			
			backButtonTitle: "" // override the back button title (optional)		    
		    });
            }}>
		<View style={styles.assetRow}>
		    <View style={{flex: 2, flexDirection: 'row'}}>
			<TokenAvatar symbol={asset.symbol} contractAddress={asset.contractAddress} darkTheme={true} />
			<View style={{flexDirection: "column", alignItems: 'center', justifyContent: 'center'}}>
			    {asset.isFavorite ? <Image style={{marginRight: 10}} source={require('quid-wallet/app/views/assets/icons/icon_favorite.png')} /> : null}
			</View>                                
                    </View>            
		    <View style={styles.centeredFlexEnd}>
			<Text style={cachedStyles.priceValue}>{renderRowCache.price}</Text>
			<Text style={[...cachedStyles.priceChange ,{ color: renderRowCache.color }]}>{renderRowCache.change}</Text>
		    </View>
		</View>
	    </TouchableOpacity>	    
	);
    }
}


export default AssetPriceRow;
