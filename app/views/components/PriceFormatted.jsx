import React from 'react';
import { Text } from 'react-native';
import { formatToCurrency } from 'quid-wallet/app/utils';


class PriceFormatted extends React.PureComponent {
    render() {
	const {style, value, currency } = this.props;
	return (
	    <Text style={style}>{formatToCurrency(value, currency)}</Text>
	);
    }
}


 export default PriceFormatted;
