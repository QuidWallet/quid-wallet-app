import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { human, systemWeights } from 'react-native-typography';
import { changeCurrency } from 'quid-wallet/app/actions/currency';
import { getSelectedCurrency } from 'quid-wallet/app/data/selectors';


const styles = StyleSheet.create({
    buttonContainer: {
    },
    button: {
	flexDirection: 'row',
	justifyContent: 'space-between',
	width: 61,
    },
    currency: {
	paddingTop: 9,
	...systemWeights.medium
    },
});


class CurrencySwitcherIcon extends React.PureComponent {
    _changeCurrency() {
	this.props.changeCurrency();
    }
    
    render() {
	const { currency, color } = this.props;
	const icon = (color === 'white') ? require("quid-wallet/app/views/assets/icons/btn_currency_white.png") : require("quid-wallet/app/views/assets/icons/btn_currency_black.png");
	const curCodeFont =  (color === 'white') ? human.caption1White : human.caption1;
	
	return (
	    <TouchableOpacity onPress={() => { this._changeCurrency(); }} style={[styles.buttonContainer, {...this.props.stylesContainer} ]}>
	      <View style={[styles.button, {...this.props.stylesButton}]}>
		<Text style={[curCodeFont, styles.currency, {color}]}>{currency} </Text>
		<Image source={icon}/>
	      </View>
	    </TouchableOpacity>
	);
    }
}


export default connect(state => ({
    currency: getSelectedCurrency(state)
}), { changeCurrency })(CurrencySwitcherIcon);
