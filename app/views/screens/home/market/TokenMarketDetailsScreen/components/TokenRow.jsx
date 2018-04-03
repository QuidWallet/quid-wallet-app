import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TokenAvatar from 'quid-wallet/app/views/components/TokenAvatar';
import { systemWeights, human } from 'react-native-typography';
import { getPriceChangeFormatObj } from 'quid-wallet/app/views/helpers/price';


const styles = StyleSheet.create({
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


export class TokenRow extends React.PureComponent {
    render() {
	const { token, currency } = this.props;
	const { price, color, priceChangeString } = getPriceChangeFormatObj({...token, currency});
	
	return (
	    <View style={styles.tokenRow}>
		<View style={{flex: 2, flexDirection: 'row', marginLeft: -25}}>
		    <TokenAvatar symbol={token.name} contractAddress={token.contractAddress} darkTheme={false} />
		</View>            
		<View style={styles.centeredFlexEnd}>
		    <Text style={[cachedStyles.priceValueDetailsScreen, ] }>{price}</Text>
		    <Text style={[...cachedStyles.priceChange ,{ color }]}>{priceChangeString}</Text>
		</View>
	    </View>
	);
    }
}


export default TokenRow;
