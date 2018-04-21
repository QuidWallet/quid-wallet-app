// import React from 'react';
// import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
// import tokenIcons from 'quid-wallet/app/utils/tokenIcons.js';
// import { toFixed } from 'quid-wallet/app/utils';
// import TokenAvatar from 'quid-wallet/app/views/components/TokenAvatar';


// export const AssetPriceHeaderRow = () => {
    
//     return (
//             <View style={styles.assetHeaderRow}>
//             <View style={styles.assetSymbolContent}>
//             <Text style={{color: "#24283666", marginLeft:20}}> Token </Text>
//             </View>
//             <View style={{ flex: 2 }}>
//             <Text style={{alignSelf: 'flex-end', color: "#24283666" }}> Current Price</Text>
//             </View>
//         </View>
//     )
// }


// export const AssetPriceRow = ({asset, currency}) => {
//     const { symbol, rate, diff } = asset;
//     let digitsAfterDot, priceString, diffPercent, diffAbs, sign, color, diffString;
//     if (rate > 0) {
// 	digitsAfterDot = (rate < 1) ? 6 : 2;    
// 	priceString = `${currency.toLowerCase()} ${toFixed(rate, digitsAfterDot)}`;
// 	diffPercent = toFixed(diff,2);
// 	diffAbs = toFixed((diff * rate)*0.01, digitsAfterDot);
// 	sign = (diffPercent < 0) ? "" : "+";
// 	color = (diffPercent < 0) ? "#E33E59" : "#00BF19";
//     } else {
// 	priceString = "-";
//     }
    
//     return (
//         <View style={styles.assetRow}>
//             <TokenAvatar symbol={symbol} />
//             <View style={styles.centeredFlexEnd}>
//                 <Text style={{ fontSize: 20 }}> {priceString}</Text>
//             { rate > 0 ? <Text style={{ fontSize: 12, color }}>
// 	      {sign}{diffAbs} ({diffPercent}%)
// 	      </Text> : null }
//             </View>
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     assetHeaderRow: {
//         flex: 1,
//         flexDirection: 'row',
//         height: 40,
//         justifyContent: 'space-between',
// 	marginLeft: 20,
// 	marginRight:10,
// 	marginTop: 20
//     },    
//     assetRow: {
//         flex: 1,
//         flexDirection: 'row',
//         height: 60,
//         justifyContent: 'space-between',
//         marginLeft: 10,
//         marginRight: 10,
//         marginTop: 10,
//         alignItems: 'center',
//     },

//     centeredFlexEnd: {
//         flex: 1,
//         flexDirection: "column",
//         alignItems: 'flex-end',
//         justifyContent: 'center' 
//     }
// });

// export default AssetPriceRow;
