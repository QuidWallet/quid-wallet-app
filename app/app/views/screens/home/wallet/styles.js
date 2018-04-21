import { StyleSheet, Platform } from 'react-native';


export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#242836',
	},
	avatarWallet: {
		flex: 1,
		marginBottom: 20
	},

	assets: {
		flex: 2,
	},
	separator: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: '#eee',
		// marginTop: 10,
		// marginBottom: 10
	},
	address: {
	},
	tokenIcon: {
		height: 20,
		width: 20,
		marginRight: 10,
		marginTop: 10
	},
	assetSymbolContent: {
		flex: 1,
		flexDirection: 'row',
		//justifyContent: 'space-between'
	},
	balanceRow: {
		fontSize: 32, 
		fontWeight: 'bold', 
		paddingBottom: 10
	},
    androidBottomMargin: {...Platform.select({
	android: {
	    marginBottom: 20
	}
    })}
});
