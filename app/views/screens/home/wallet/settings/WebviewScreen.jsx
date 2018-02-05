import React from 'react';
import { WebView } from 'react-native';

const WebviewScreen = (props) => {
    return (
         <WebView
            source={props.source}
	    style={{flex: 1}} />
    );
}

export default WebviewScreen;
