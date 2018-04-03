import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import moment from 'moment';


export const TimeAgoText = ({timestamp}) => {
    if (!timestamp || timestamp === 0 || timestamp === Infinity) { return ": unknown"; }
    const timeAgo = moment(new Date(timestamp)).fromNow();
    return timeAgo;
}


export const TimeAgoWithIcon = ({style, timestamp}) => {
    // show warning icon if more than 15 minutes passed
    const showIcon = moment().diff(timestamp, 'minutes') > 15;
    return (
	    <View>
	    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
	    { showIcon ? <Icon name='error' color='#E33E59' size={10} iconStyle={{paddingRight: 5}}/> : null }
	    <Text style={style}>Updated {TimeAgoText({timestamp})}</Text>
	    </View>
	    </View>
    );
}
