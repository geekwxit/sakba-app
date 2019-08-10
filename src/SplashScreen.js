// import React,{Component}from 'react';
// import {View,Text,Image} from 'react-native';

// export default class SplashScreen extends  Component<Props> {

//   render(){
//     return(
//       <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#0451A5'}}>
//         <Image style={{width:100,height:100}} source={require('../img/om.png')}/>
//       </View>
//     )
//   }
// }


import React, { Component } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

class ImageLoader extends Component {
  state = {
    opacity: new Animated.Value(0),
  }

  onLoad = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }

  render() {
    return (
      <Animated.Image
        onLoad={this.onLoad}
        {...this.props}
        style={[
          {
            opacity: this.state.opacity,
            transform: [
              {
                scale: this.state.opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.1, 1],
                })
              },
            ],
          },
          this.props.style,
        ]}
      />
    );
  }
}

const SplashScreen = () => (
  <View style={styles.container}>
    <ImageLoader
      style={styles.image}
      source={require('../img/om.png')}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#0451A5',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 150,
    resizeMode:'contain',
  },
});

export default SplashScreen;

