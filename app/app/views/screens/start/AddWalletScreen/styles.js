import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    addressInput: {
	paddingTop: 10,
	paddingBottom: 10,
	paddingLeft: 15,
	paddingRight: 15,
	color: '#fff',
	borderWidth: 1,
	borderRadius: 10,
	marginTop: 2,
	marginBottom: 2,
	fontSize: 16,
	borderColor: '#7C7E86'
    },
    screen: {
	flex: 1,
	justifyContent: 'center',
	backgroundColor: '#242836' //theme.colors.screen.quid
    },
    image: {		    
	marginRight: 20,
    },
    header: {
	alignItems: 'center',
	marginBottom: 70
    },
    content: {
	justifyContent: 'center',
	marginBottom: 120,
	padding: 10
    },
    save: {
	marginVertical: 20
    },
    buttons: {
	flexDirection: 'row',
	marginHorizontal: 24,
	justifyContent: 'space-around',
    },
    textRow: {
	flexDirection: 'row',
	justifyContent: 'center',
	textAlign: 'center',
	height: 20,
	color: '#BD3A52', 
	fontSize: 15
    },
    button: {
	textAlign: 'center',	
	color: '#fff',
	fontSize: 20,
	lineHeight: 44
    },
    input: {
	height: 100
    },
    footer: {}
});

export default styles;
