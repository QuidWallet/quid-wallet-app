import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { toFixed } from 'quid-wallet/app/utils';
import TokenAvatar from 'quid-wallet/app/views/components/TokenAvatar';
import { formatToCurrency } from 'quid-wallet/app/utils';
import { human } from 'react-native-typography';


const styles = StyleSheet.create({
    assetRow: {
        flexDirection: 'row',
        height: 80,
    },
    fiatValue: {
	color: "#a7a9af",
	marginRight: 12,
	marginTop: 11,
	lineHeight: 13
    },    
    centeredFlexEnd: {
        flexDirection: "column",
        alignItems: 'flex-end'
    }
});


export const AssetRow = (props) => {
    const { asset, currency } = props;
    let fiatBalanceString = (asset.balanceFiat > 0) ? `${formatToCurrency(asset.balanceFiat, currency)}` : '-';
    let qntyString = toFixed(asset.balance, 2);
    if (props.isBalanceHidden) {
	qntyString = "-";
	fiatBalanceString = "-";
    }
    
    return (
        <View style={styles.assetRow}>
          <TokenAvatar symbol={asset.symbol} contractAddress={asset.contractAddress} />
          <View style={styles.centeredFlexEnd}>
            <Text style={ [human.title3, { marginTop: 20, marginRight: 11, color: '#242836', lineHeight: 20 }]}>{qntyString}</Text>
            <Text style={[human.caption1, styles.fiatValue]}>{fiatBalanceString}</Text>
	  </View> 	  
        </View>
    );
}


export default AssetRow;
