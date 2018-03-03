import React from 'react';
import { connect } from 'react-redux';
import {
    StyleSheet,
    Platform,    
    Text,
    View
} from 'react-native';
import {
    getAssetsBalance,
    getPortfolioChangeAbs,
    getPortfolioChangePerc,
    getSelectedCurrency
} from 'quid-wallet/app/data/selectors';
import { toFixed } from 'quid-wallet/app/utils';
import PriceFormatted from 'quid-wallet/app/views/components/PriceFormatted';
import HideBalanceToggle from 'quid-wallet/app/views/components/wallet/HideBalanceToggle';
import { TimeAgoWithIcon } from 'quid-wallet/app/views/components/TimeAgo';
import TransparentNavBar from 'quid-wallet/app/views/components/TransparentNavBar';
import { systemWeights, human } from 'react-native-typography';


const styles = StyleSheet.create({
    container: {	
	height: 193,
	backgroundColor: '#242836'
    },
    AssetRowTitlesContainer: {
	flex: 1,
	flexDirection: 'row',
	justifyContent: 'space-between',
	height: 44
    },
    totalAssetsSectionContainer: {
	height: 80,
	paddingTop: 10,
	paddingRight: 12,
	paddingBottom: 13,
	flexDirection: 'column',
	justifyContent: 'space-between'
    },
    assetChangeValue: {	
	textAlign: 'right',
	...systemWeights.bold
    },
    totalAssetsValue: {
	textAlign: 'right',
	lineHeight: 20
    },	
    updated: {
	textAlign: 'right',
	fontSize: 9,
	color: '#7C7E86',
	lineHeight: 10,
	...systemWeights.light	
    },
    tableTitle: {
	fontSize: 13,
	color: '#7C7E86',
	lineHeight: 13,
	paddingTop: 13,
	paddingBottom: 18,
	textAlign: 'right'
    },
    androidBottomMargin: {...Platform.select({
	android: {
	    marginBottom: 20
	}
    })}    
});


class TotalAssetsSection extends React.PureComponent {
	
    render() {
	const {changeAbs, changePerc, isBalanceHidden,
	       assetsBalance, currency, ts} = this.props;
		   
	const assetsChangeColor = changeAbs >= 0 ? "#00BF19" : "#E33E59";
	const changeSign = changeAbs >= 0 ? "+" : "-";
	const changePercStr = changePerc !== 0 ? `${toFixed(Math.abs(changePerc), 2)}%` : "-";    
	let assetsChange;
	if (isBalanceHidden) {
	    assetsChange = changeSign.concat(changePercStr);
	} else {
	    const changeSignPerc = changeAbs >= 0 ? "" : "-";	    
	    assetsChange = ` (${changeSignPerc}${changePercStr})`;
	}

	return (
		
		<View style={styles.totalAssetsSectionContainer}>
		<TimeAgoWithIcon timestamp={ts} style={
		    [...human.caption2,
		     styles.updated
		    ]
		} />
		
		<View style={styles.totalAssetsDigitContainer}>
		<HideBalanceToggle hiddenTextStyle={[human.calloutWhite, styles.totalAssetsValue]}> 
		<PriceFormatted value={assetsBalance} currency={currency} style={[human.calloutWhite, styles.totalAssetsValue]} />
		</HideBalanceToggle>
	        </View>
		
		<View style={{alignItems: 'flex-end'}}>
		    <View style={{flexDirection: 'row',}}>
		{isBalanceHidden ? null : <Text style={[human.caption1, styles.assetChangeValue, {color: assetsChangeColor}]}>{changeSign}</Text>}	
		{isBalanceHidden ? null : <PriceFormatted value={Math.abs(changeAbs)} style={[human.caption1, styles.assetChangeValue, {color: assetsChangeColor}]}/>}
		<Text style={[human.caption1, styles.assetChangeValue, {color: assetsChangeColor}]}>{assetsChange}</Text>
		</View>
		</View>	      
		</View>
	);
    }
}


const ConnectedTotalAssetsSection = connect(state => ({
    assetsBalance: getAssetsBalance(state),
    ts: state.marketData.timestamp,
    currency: getSelectedCurrency(state),    
    isBalanceHidden: state.data.balanceHidden,
    changeAbs: getPortfolioChangeAbs(state),
    changePerc: getPortfolioChangePerc(state)    
}))(TotalAssetsSection);


const TableTitles = () => {
    return (
	<View style={styles.AssetRowTitlesContainer}>
	  <View style={{ flex: 2 }}>
	    <Text style={[ styles.tableTitle, {textAlign: 'left', marginLeft: 46, minWidth: 100}]}>Token</Text>
	  </View>
	  <View style={{ flex: 3 }}>
	    <Text style={styles.tableTitle}>Price</Text>
	  </View>
	  <View style={{ flex: 3 }}>
	    <Text style={[styles.tableTitle, {marginRight: 12}]}>Market Value</Text>
	  </View>
	</View>
    );
}


class PortfolioHeader extends React.PureComponent {
    render() {
	return (
	    <View style={styles.container}>
	      <View style={styles.androidBottomMargin}>
		<TransparentNavBar navigator={this.props.navigator} title="Portfolio" />
	      </View>
		<ConnectedTotalAssetsSection appState={this.props.appState}/>
	      { TableTitles() }
	    </View>
	);
    }
}


export default PortfolioHeader;
