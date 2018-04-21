import React from 'react';
import { Clipboard, TouchableOpacity } from 'react-native';


const TextWithCopy = (props) => {
    return (
        <TouchableOpacity onPress={() => Clipboard.setString(props.valueToCopy)}>
            {props.children}
        </TouchableOpacity>
    )
}


export default TextWithCopy
