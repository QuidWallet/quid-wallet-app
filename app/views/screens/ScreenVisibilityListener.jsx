import {ScreenVisibilityListener as RNNScreenVisibilityListener} from 'react-native-navigation';

class ScreenVisibilityListener {
    constructor(didAppear) {
	this.listener = new RNNScreenVisibilityListener({
	    didAppear
	});
    }

    register() {
	this.listener.register();
    }

    unregister() {
	if (this.listener) {
	    this.listener.unregister();
	    this.listener = null;
	}
    }
}


export default ScreenVisibilityListener;
