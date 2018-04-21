import React, { Component } from 'react';
import { Animated, Image, Platform, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { isIphoneX } from 'react-native-iphone-x-helper';

const DEFAULT_TOOLBAR_HEIGHT = 300;


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    toolBarOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0
    },
    navBarContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOpacity: 0.1,
                shadowRadius: StyleSheet.hairlineWidth,
                shadowOffset: {
                    height: StyleSheet.hairlineWidth
                },
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: 'rgba(0, 0, 0, .3)'
            },
            android: {
                elevation: 4
            }
        })
    },
    navBarOverlay: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        position: 'absolute',
        left: 0,
        right: 0
    }
});


export default class CollapsibleToolbar extends Component {
    static propTypes = {
        collapsedNavBarBackgroundColor: PropTypes.string,
        imageSource: PropTypes.string,
        onContentScroll: PropTypes.func,
        renderContent: PropTypes.func.isRequired,
        renderNavBar: PropTypes.func.isRequired,
        renderToolBar: PropTypes.func,
        toolBarHeight: PropTypes.number,
        translucentStatusBar: PropTypes.bool
    };

    static defaultProps = {
        collapsedNavBarBackgroundColor: '#FFF',
        imageSource: '',
        onContentScroll: undefined,
        renderToolBar: undefined,
        toolBarHeight: DEFAULT_TOOLBAR_HEIGHT,
        translucentStatusBar: false
    };

    constructor(props) {
        super(props);

        let APPBAR_HEIGHT = Platform.OS === 'ios' ? 69 : 59;
	if (isIphoneX()) { APPBAR_HEIGHT = 79; };

        this.statusBarHeight = 0;
        this.navBarHeight = APPBAR_HEIGHT + this.statusBarHeight;
        this.maxScrollableHeight = props.toolBarHeight - this.navBarHeight;
	
        const inputRange1 = [this.maxScrollableHeight / 10, this.maxScrollableHeight / 2];
        const inputRange2 = [this.maxScrollableHeight - 0.1, this.maxScrollableHeight];

        this.scrollOffsetY = new Animated.Value(0);

        this.toolBarOpacity = this.scrollOffsetY.interpolate({
            inputRange: inputRange1,
            outputRange: [1, 0]
        });

        this.toolBarOverlayOpacity = this.scrollOffsetY.interpolate({
            inputRange: inputRange1,
            outputRange: [0, 1]
        });

        this.navBarOpacity = this.scrollOffsetY.interpolate({
            inputRange: inputRange2,
            outputRange: [0, 1]
        });

        this.navBarOverlayOpacity = this.scrollOffsetY.interpolate({
            inputRange: inputRange2,
            outputRange: [1, 0]
        });
    }

    render() {
        const {
            collapsedNavBarBackgroundColor,
            imageSource,
            onContentScroll,
            renderContent,
            renderNavBar,
            renderToolBar,
            toolBarHeight,
            ...props
        } = this.props;

        
        return (
            <View style={styles.container}>
                <Animated.ScrollView
                    {...props}
                    scrollEventThrottle={1}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.scrollOffsetY } } }],
                        {
                            useNativeDriver: true,
                            listener: onContentScroll
                        }
                    )}
                >
                    <Animated.View
                        style={[
                            styles.toolBarOverlay,
                            {
                                backgroundColor: collapsedNavBarBackgroundColor,
                                height: toolBarHeight,
                                opacity: this.toolBarOverlayOpacity
                            }
                        ]}
                    />

                    <Animated.View style={{ opacity: this.toolBarOpacity }}>
                        {renderToolBar
                            ? renderToolBar()
                            : <Image
                                source={{ uri: imageSource || '' }}
                                style={{ height: toolBarHeight }}
                            />
                        }
                    </Animated.View>

                    {renderContent()}
                </Animated.ScrollView>

                <Animated.View
                    style={[
                        styles.navBarContainer,
                        {
                            backgroundColor: collapsedNavBarBackgroundColor,
                            height: this.navBarHeight,
                            opacity: this.navBarOpacity,
                            paddingTop: this.statusBarHeight
                        }
                    ]}
                >
                    {renderNavBar()}
                </Animated.View>

                <Animated.View
                    style={[
                        styles.navBarOverlay,
                        {
                            height: this.navBarHeight,
                            opacity: this.navBarOverlayOpacity,
                            paddingTop: this.statusBarHeight
                        }
                    ]}
                >
                    {renderNavBar()}
                </Animated.View>
            </View>
        );
    }
}
