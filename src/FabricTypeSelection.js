import React, { Component } from 'react';
import { View, Alert, Text, Image, Dimensions, ActivityIndicator, Modal, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Form, Item, Input, Container, Content, Button, Radio, Icon, Textarea } from 'native-base';
import renderIf from 'render-if';
import PayPal from 'react-native-paypal-wrapper';
import CustomRadioButton from 'react-native-vector-icons/MaterialCommunityIcons';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import axios from 'axios';
import RadioGroup from './components/RadioGroupCustom';


const { width, height } = Dimensions.get('window');
const fabric = {
  types     : ['Toyobo', 'Shikibo', 'Fine Gold',],
  patterns  : [require('../img/patterns/pattern1.jpg'), require('../img/patterns/pattern2.jpg'),
    require('../img/patterns/pattern3.jpg'), require('../img/patterns/pattern4.jpg'),require('../img/patterns/pattern2.jpg'),],
  colors    : [
      {name: 'Red', code: '#ff3d01'},
    {name: 'White', code: '#ffffff'},
    {name: 'Green', code: '#148500'},
    {name: 'Purple', code: '#f99bff'},
    {name: 'Cream', code: '#fad0a7'}],
  selected : {pattern : 0, type    : 0, color   : 0},
}

export default class FabricTypeSelection extends Component<Props>{

  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 },
      headerTintColor: '#fff',
      title: 'Select Fabric Options'
    };
  };
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      noOfPieces: this.props.navigation.getParam('noOfPieces', null),
      mobileNo: this.props.navigation.getParam('mobileNo', null),
      inHomeCount: this.props.navigation.getParam('inHomeCount', null),
      outsideCount: this.props.navigation.getParam('outsideCount', null),
      selectedFabricType: null
    };
  }
  componentDidMount() {

  }

  updateQuantity(type, quantity){
    total = this.state.noOfPieces;
    home = this.state.inHomeCount;
    out  = this.state.outsideCount;
    // if(!(home+quantity<0  out+quantity<0)){
      if(type==='home'){
        if(home+quantity>=0){
        if(home+quantity<=total){
          i = quantity+home;
          p = total-(quantity+home);
          this.setState({inHomeCount: quantity+home});
          this.setState({outsideCount: total-(quantity+home)});
        }
        else{alert("In home count value cannot exceed total no of dishdashas!");}}
      }
      else if(type==='outside'){
        if(out+quantity>=0){
        if(out+quantity<=total){
          i = quantity+out;
          p = total-(quantity+out);
          this.setState({outsideCount: quantity+out});
          this.setState({inHomeCount: total-(quantity+out)});
        }
        else{alert("Outside count value cannot exceed total no of dishdashas!");}}
      }
    // }
  }

  selectFabricType = (fabric) => {
    this.setState({selectedFabricType: this.fabricTypes[fabric]});
  }

  proceed(){
    const fabricType = fabric.types[fabric.selected.type];
    const fabricColor = fabric.colors[fabric.selected.color];
    const fabricPattern = fabric.patterns[fabric.selected.pattern];
    // console.warn("Options: ", type, color, pattern);
    this.props.navigation.navigate('delivery', {fabricType, fabricColor, fabricPattern})
  }

  render() {

    Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;


    const { deliveryOption, deliveryOptionPickUpFormStore } = this.state
    console.log(deliveryOption);

    const sizeCtrl = {width: 40, height: 40}
    return (
      <SafeAreaView >
        <ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 50 }}>
            <Image style={{ width: 80, height: 80 }} source={require('../img/om.png')} />
          </View>
          <View style={{ flexDirection: 'column', marginHorizontal: 40 }}>
            <View style={{ marginTop: 50, marginBottom: 10}}>
              <Text style={{ fontSize: 20, textAlign: 'center' }}>Choose fabric Brand: </Text>
            </View>

            <View>
              <RadioGroup
                data={fabric.types}
                isImage={false}
                default={0}
                onSelect={(index)=>{fabric.selected.type=index}}
              />
            </View>

            <View style={{ marginTop: 50, marginBottom: 10}}>
              <Text style={{ fontSize: 20, textAlign: 'center' }}>Choose fabric pattern </Text>
            </View>

            <View>
              <RadioGroup
                  data={fabric.patterns}
                  isImage={true}
                  default={0}
                  onSelect={(index)=>{fabric.selected.pattern=index}}
              />
            </View>

            <View style={{ marginTop: 50, marginBottom: 10}}>
              <Text style={{ fontSize: 20, textAlign: 'center' }}>Choose fabric color </Text>
            </View>

            <View>
              <RadioGroup
                  data={fabric.colors}
                  isImage={false}
                  isColor={true}
                  default={0}
                  onSelect={(index)=>{fabric.selected.color=index}}
              />
            </View>
            <View style={{ marginTop: 20, marginBottom: 30, flexDirection: 'row', justifyContent: 'center' }}>
              <Button
                  style={{ borderRadius: 15, borderWidth: 2, backgroundColor: '#0451A5', height: 40, width: width - 80, justifyContent: 'center' }}
                  onPress={() => this.proceed()}>
                <Text style={{ fontSize: 18, color: 'white' }}>Set Delivery Options</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
