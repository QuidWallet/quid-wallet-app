import React from 'react';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { StyleSheet, View, Text, Dimensions } from 'react-native';


const styles = StyleSheet.create({
    container: {
	width: 300,
	backgroundColor: '#E33E59',
	padding: 15,
	...ifIphoneX({
	    paddingTop: 45
	}, {
	    paddingTop: 15
	})
    },
    title: {
	fontSize: 18,
	textAlign: 'center',
	color: '#fff'	
    },
    content: {
	textAlign: 'center',
	color: '#fff'
    },
});


class Notification extends React.Component {
    render() {
	const { width } = Dimensions.get('window');
	return (
	    <View style={[styles.container, {width}]}>
	      <Text style={styles.title}> Network error.</Text>
	      <Text style={styles.content}> Please try again later.</Text>
	    </View>
	);
    }
}


export default Notification;
