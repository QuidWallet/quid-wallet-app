/* eslint-disable */
import Reactotron, {
    trackGlobalErrors,
    openInEditor,
    overlay,
    asyncStorage,
    networking
} from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';


Reactotron
    .configure() // controls connection & communication settings
    .use(trackGlobalErrors())
    //.use(overlay())
    //.use(asyncStorage())
    .use(networking())
    .useReactNative() // add all built-in react native plugins
    .connect(); // let's connect!

console.tron = Reactotron;
