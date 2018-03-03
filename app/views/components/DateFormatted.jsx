import React from 'react';
import { Text } from 'react-native';
import { TimeAgoText } from 'quid-wallet/app/views/components/TimeAgo';
var moment = require('moment');


const DateFormatted = (props) => {
    return (
        <Text style={props.style}>{moment(new Date(props.timestamp)).diff(Date.now(), 'minutes') < -59 ? new Date(props.timestamp).toLocaleString() : <TimeAgoText timestamp={props.timestamp}/>}</Text>
    )
}

export default DateFormatted;
