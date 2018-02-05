import React from 'react';
import {
    Switch,
    Platform
} from 'react-native';


export default class CurrencySwitcher extends React.Component {
    constructor(props) {
	super(props);
	this.onChange = this.props.onValueChange ?
	    this.props.onValueChange
	    : () => true;
    }

    
    render() {
	return (
		<Switch style={this.props.style}
            value={this.props.value}
	    disabled={this.props.disabled}
            onValueChange={(value) => this.onChange(value)}
            onTintColor={'#00bf19'}
	    thumbTintColor={ (Platform.OS === 'android') ? '#fff' : null }
		/>
	);
    }
}


