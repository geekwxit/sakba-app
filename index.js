/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
// import App from './testdir/App'
import {name as appName} from './app.json';

//import t from './src/PayPal';
//GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => App);
