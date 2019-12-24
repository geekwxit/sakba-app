import React,{Component} from 'react';
import {WebView,View ,Text} from 'react-native';

const source = require('./_UNUSED_test.html');

export default class Test extends Component{
  render(){
    return(
      <View style = {{height: 350}}>
         <WebView
                 style={{overflow: 'scroll'}}
                 source={source}
                 originWhitelist={["*"]}
                 style={{flex: 1}}
          />
      </View>
    );
  }
}
