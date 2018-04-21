import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
	flex: 1,
	backgroundColor: '#fff',
	alignItems: 'center',
	paddingTop: 120
    },
    unlinkWalletButton: {
	marginTop: 20,
	paddingTop: 5,
	paddingBottom: 5,
	paddingLeft: 25,
	paddingRight: 25,
	backgroundColor: '#fff',
	borderRadius: 10,
	borderWidth: 3,
	borderColor: '#E33E59'
    },
    unlinkWalletButtonText: {
	color: '#BD3A52',
	textAlign: 'center',
	fontWeight: 'bold',
	fontSize: 20,
    },
    text: {
	fontSize: 10,
	color: 'rgba(36, 40, 54, 0.4)',
	margin: 6
    },
    address: {
	fontWeight: 'bold',
	fontSize: 13,
	marginTop: 10,
	marginBottom: 15
    }
});


export default styles;
