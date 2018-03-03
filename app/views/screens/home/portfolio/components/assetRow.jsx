import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { toFixed } from 'quid-wallet/app/utils';
import TokenAvatar from 'quid-wallet/app/views/components/TokenAvatarSmall';
import PriceFormatted from 'quid-wallet/app/views/components/PriceFormatted';
import PortfolioQuantityFormatted from 'quid-wallet/app/views/screens/home/portfolio/components/PortfolioQuantityFormatted';
import { systemWeights, human } from 'react-native-typography';


const styles = StyleSheet.create({
    cell: {
	flex: 3,
	flexDirection: 'row',
	justifyContent: 'center',
    },
    assetRow: {
        flex: 1,
        flexDirection: 'row',
        height: 80,
	paddingLeft: 12,
	paddingRight: 12,
	backgroundColor: '#fff'
    },
    centerVertically: {
        flex: 1,
        flexDirection: "column",
        justifyContent: 'flex-end',
	paddingBottom: 15,
    },
    absoluteValue: {
	fontSize: 16,
	textAlign: 'right',
	paddingTop: 4,
	paddingBottom: 4
    },
    changeValue: {
	textAlign: 'right',
	...systemWeights.bold
    },
    qntyValue: {
	color: '#A7A9AF',
	textAlign: 'right'
    }
});


const AssetPriceChange = ({ currency, price, priceChange }) => {
    let digitsAfterDot, priceChangeAbs, sign, color;
    
    if (priceChange !== 0) {
        digitsAfterDot = (price < 1) ? 6 : 2;
        priceChangeAbs = toFixed((priceChange * price) * 0.01, digitsAfterDot);
        sign = (priceChange < 0) ? "" : "+";
        color = (priceChange < 0) ? "#E33E59" : "#00BF19";
    } else {
	color = "#24283666"; // gray
	priceChangeAbs = "-";
    }
    
    return (
        <View style={styles.centerVertically}>
          <PriceFormatted style={[human.callout,styles.absoluteValue]} value={price} currency={currency}/>	    
	  <Text style={[human.caption1, styles.changeValue ,{ color }]}>
                {sign}{priceChangeAbs}
            </Text> 
        </View>
    );
}

const HoldingsChange = ({ currency, balanceChangeAbs, balanceChangePerc, balance, qnty, isBalanceHidden }) => {
    let sign, color, balanceChangePercStr;
    const abs = (x) => x > 0 ? x : -x;
    balanceChangePercStr = `${toFixed(balanceChangePerc, 2)}%`;
    balanceChangeAbs = toFixed(balanceChangeAbs, 2);
    sign = (balanceChangeAbs < 0) ? "-" : "+";
    
    color = (balanceChangeAbs < 0) ? "#E33E59" : "#00BF19";
    if (abs(balanceChangeAbs) < 0.01) {
	balanceChangePercStr = "-";
	color = "#24283666";
	sign = "";
    }

    // if balance is hidden show only perc change
    if (isBalanceHidden) {
	sign = (balanceChangeAbs > 0) ? "+" : "";
	return (
            <View style={styles.centerVertically}>
	      <Text style={[human.caption1, styles.changeValue, {color}]}>
		{sign}{balanceChangePercStr}
	      </Text>
            </View>
	);
    }
        
    return (
        <View style={styles.centerVertically}>
	  <Text style={ [human.caption1, styles.qntyValue]}>{toFixed(qnty, 2)}</Text>
          <PortfolioQuantityFormatted style={[ human.callout, styles.absoluteValue]} value={balance} currency={currency} precision={2}/>
	  <Text style={[human.caption1, styles.changeValue, {color}]}>
	    {sign}<PortfolioQuantityFormatted value={Math.abs(balanceChangeAbs)} precision={2}/> ({balanceChangePercStr})
	  </Text>
        </View>
    );
}


class AssetPriceRow extends React.PureComponent {
    render() {
	const { symbol, contractAddress } = this.props;
	return (
            <View style={styles.assetRow}>
              <View style={{flex: 2}}>
		<TokenAvatar symbol={symbol} contractAddress={contractAddress} />
              </View>
              <View style={styles.cell}>
		{ AssetPriceChange(this.props) }
              </View>
              <View style={styles.cell}>
		{ HoldingsChange(this.props) } 
              </View>	      
            </View>
	);
    }
}


export default AssetPriceRow;
