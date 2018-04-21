import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { toFixed } from 'quid-wallet/app/utils';
import TokenAvatar from 'quid-wallet/app/views/components/TokenAvatar';
import { formatToCurrency } from 'quid-wallet/app/utils';
import { human } from 'react-native-typography';


const styles = StyleSheet.create({
    tokenRow: {
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


export const TokenRow = ({ token, currency, isBalanceHidden }) => {
    let fiatBalanceString = (token.balance > 0) ? `${formatToCurrency(token.balance, currency)}` : '-';
    let qntyString = toFixed(token.qnty, 2);
    if (isBalanceHidden) {
	qntyString = "-";
	fiatBalanceString = "-";
    }
    
    return (
        <View style={styles.tokenRow}>
          <TokenAvatar symbol={token.symbol} contractAddress={token.contractAddress} />
          <View style={styles.centeredFlexEnd}>
            <Text style={ [human.title3, { marginTop: 20, marginRight: 11, color: '#242836', lineHeight: 20 }]}>{qntyString}</Text>
            <Text style={[human.caption1, styles.fiatValue]}>{fiatBalanceString}</Text>
	  </View> 	  
        </View>
    );
}


export default TokenRow;
