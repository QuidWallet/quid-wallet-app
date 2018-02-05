import React from 'react';
import { Text } from 'react-native';
import moment from 'moment';


const TimeAgo = (props) => {
    const timeAgo = moment(new Date(props.timestamp)).fromNow();
    return (
        <Text style={props.style}>{timeAgo}</Text>
    );
}


export default TimeAgo
