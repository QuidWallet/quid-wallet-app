import React from 'react';
import { connect } from 'react-redux';
import { Text, StyleSheet, View, FlatList } from 'react-native';
import { getDisplayCurrencies, getActiveDisplayCurrencies } from 'quid-wallet/app/data/selectors';
import { SearchBar } from 'react-native-elements';
import escapeRegExp from 'escape-string-regexp';
import { toggleCurrency } from 'quid-wallet/app/actions/currency';
import CurrencySwitcher from 'quid-wallet/app/views/components/switch/CurrencySwitcher';
import FabricService from 'quid-wallet/app/services/FabricService';


const styles = StyleSheet.create({
    container: {
	flex: 1,
	backgroundColor: "#fff",
    },
    row: {
	flexDirection: 'row',
	justifyContent: 'space-between',
	paddingHorizontal: 17.5,
	alignItems: 'center'
    },
});


class CurrenciesSettingsScreen extends React.Component {
    constructor(props) {
	super(props);
	this.state = {
	    search: ""
	};
    }

    _renderCurrencyRow({ item }) {
	const { currency, active, disabled } = item;
	const component = this;
	return (
	    <View key={currency}>
	      <View style={styles.row}>
		<Text style={{fontSize: 18}}>{currency}</Text>
		<CurrencySwitcher style={{marginVertical: 14}}
				  value={active}
				  name="Display"
				  disabled={disabled}
				  onValueChange={() => component.props.toggleCurrency(currency)} />
	      </View>
	    </View>
	);
    }

    render() {
	const component = this;
	const currenciesData = this.props.currencies.map(currency => {
	    const active = component.props.activeCurrencies.includes(currency);
	    const disabled = active ? component.props.activeCurrencies.length < 2 : component.props.activeCurrencies.length > 4;
	    return {
		currency,
		active,
		disabled
	    };
	});
	
	let showingCurrency;
	if (this.state.search) {
	    const match = new RegExp(escapeRegExp(this.state.search), 'i');
	    showingCurrency = currenciesData.filter((currency) => match.test(currency.currency));
	} else {
	    showingCurrency = currenciesData;
	}

	return (
	    <View style={{ flex: 1 }}>
	      <SearchBar
		 lightTheme
		 round={true}
		  containerStyle={{
		      backgroundColor: '#fff',
		      borderTopWidth: 0
		  }}		     
		 onChangeText={(input) => {
			 this.setState({ search: input });

			 // #fabric-analytics
			 FabricService.logTokenSearchOnDisplayCurrencyScreen(input);
		 }}
	         defaultValue={this.state.search}
		 clearIcon={this.state.search ? true : false}			
		  placeholder='Search currency...' />
	      <FlatList
		  style={styles.container}
		  data={showingCurrency}
		  renderItem={this._renderCurrencyRow.bind(this)}
		  keyExtractor={(item) => item.currency}
	      />
	    </View>
	);
    }
}


const mapStateToProps = state => ({
    currencies: getDisplayCurrencies(state),
    activeCurrencies: getActiveDisplayCurrencies(state)
});


export default connect(mapStateToProps, { toggleCurrency })(CurrenciesSettingsScreen);


