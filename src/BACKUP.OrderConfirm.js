//This is the code to have a screen for 2 second and then navigate to another page

import React,{Component}from 'react';
import {View,Text,Image,Dimensions} from 'react-native';
import {Button} from 'native-base';

const { width, height } = Dimensions.get('window');

export default class  OrderConfirm extends Component<Props>{
  static navigationOptions = ({ navigation }) => {
    return{
      headerStyle:{ backgroundColor:'#0451A5',marginLeft:0},
      headerTintColor: '#fff',
    };
  };
  constructor(props){
    super(props)
    this.state={executive_Visit:false,visit_to_Shop:false};
  }
  componentDidMount() {
    setTimeout( () => {this.load()}, 2000);
  }
  load = () => {
    this.props.navigation.navigate('order_detail');
  }
  render(){

    Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;


    const state = this.state;
    const { navigation } = this.props;
    const customerName= navigation.getParam('customerName', '');
    const measurementDate= navigation.getParam('measurementDate', '');

    return(
      <View>
        <View style={{flexDirection:'row',justifyContent:'center',marginTop:20}}>
         <Image style={{width:80,height:80}} source={require('../img/om.png')} />
        </View>
        <View style={{flexDirection:'column',alignItems:'center',marginTop:80}}>
          <View>{/*/Confirm Order*/}
            <Text style={{fontSize:18}}>Hello,</Text>
            <Text style={{fontSize:18,marginLeft:40}}>{customerName} your order  </Text>
            <Text style={{fontSize:18,marginLeft:40}}> is confirm with </Text>
            <Text style={{fontSize:18,marginLeft:40}}>measurement of </Text>
            <Text style={{fontSize:18,marginLeft:40}}>date:{measurementDate}</Text>
          </View>
        </View>
      </View>
    );
  }
}
