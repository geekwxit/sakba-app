/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

//import t from './src/PayPal';
console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => App);
