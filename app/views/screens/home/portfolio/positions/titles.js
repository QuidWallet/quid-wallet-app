import { Text, View } from 'react-native';

const styles = StyleSheet.create({
    AssetRowTitlesContainer: {
	flex: 1,
	flexDirection: 'row',
	justifyContent: 'space-between',
	marginLeft: 10,
	marginRight: 10,
	marginTop: 35
    },
});


export const AssetRowTitles = () => {
    return (
	<View style={styles.AssetRowTitlesContainer}>
	  <View style={{ flex: 3 }}>
	    <Text style={{ color: '#24283666' }}>Token </Text>
	  </View>
	  <View style={{ flex: 2 }}>
	    <Text style={{ color: '#24283666' }}>Price</Text>
	  </View>
	  <View style={{ flex: 2 }}>
	    <Text style={{ color: '#24283666' }}>Quantity</Text>
	  </View>
	</View>
    );
};
