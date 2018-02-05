import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';


const styles = StyleSheet.create({
    settingsRow: {
        flexDirection: 'row',
    },
    settingsIcon: {
        marginLeft: 15,
        marginRight: 20
            },
    settingsRowContent: {
        flex: 2,
        marginRight: 10,
        marginTop: 12,
        flexDirection: 'row',
    }
});


const SettingsRow = (props) => {
    return (
        <TouchableOpacity onPress={() => props.navigator.push({
		screen: `quidwallet.home.wallet.settings.${props.screen}`,
		title: props.title,
		navigatorStyle: {		      
		    tabBarHidden: true
		}
	})}>
            <View style={[styles.settingsRow]}>
		<View style={[styles.settingsRowContent]}>
		    <Image style={[styles.settingsIcon]} source={props.icon} />
		    <Text style={{ fontSize: 20, marginTop: 3 }}>{props.title}</Text>
		</View>
          </View>
        </TouchableOpacity>
    );
}


export default SettingsRow;
