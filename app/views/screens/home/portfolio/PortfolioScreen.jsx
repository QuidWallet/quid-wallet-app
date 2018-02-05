import React from 'react';
import { View, AppState } from 'react-native';
import PortfolioHeader from 'quid-wallet/app/views/screens/home/portfolio/components/portfolioHeader';
import wrapWithCurrencySwitcher from 'quid-wallet/app/views/components/currency-switcher';
import PositionsContainer from './components/PositionsContainer';


class PortfolioScreen extends React.Component {
    static navigatorStyle = {
	// (ios only) for transparent navbar
	statusBarTextColorSchemeSingleScreen: 'light',

	// using custom navbar (components/TransparentNavBar) 
	navBarHidden: true,
	screenBackgroundColor: '#fff'
    }
    
    state = {
	appState: AppState.currentState
    };
    
    componentDidMount() {
	AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
	AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
	// for rerendering screen on resume
	this.setState({appState: nextAppState});
    }
    

    render() {
	return (
	    <View style={{flex: 1}}>
		<PortfolioHeader navigator={this.props.navigator}/>
		<PositionsContainer navigator={this.props.navigator}/>
	    </View>
	);
    }
}


export default wrapWithCurrencySwitcher(PortfolioScreen, true, 'PortfolioScreen', false);
