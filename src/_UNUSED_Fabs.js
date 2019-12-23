import React, { Component } from 'react';
import { View, Alert, Text, Image, Dimensions, TouchableWithoutFeedback, ActivityIndicator, Modal, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Form, Item, Input, Container, Content, Button, Radio, Icon, Textarea } from 'native-base';
import renderIf from 'render-if';
import PayPal from 'react-native-paypal-wrapper';
import CustomRadioButton from 'react-native-vector-icons/MaterialCommunityIcons';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import axios from 'axios';
import RadioGroup from './components/RadioGroupCustom';
import Brands from "./fabrics/brands/brands";

const { width, height } = Dimensions.get('window');

export default class Fabs extends Component<Props>{

  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 },
      headerTintColor: '#fff',
      title: 'Select a brand'
    };
  };
  constructor(props) {
    super(props)
    console.log("SOMEBRANDS: ", Brands);
    this.state = {
      isLoading: false,
      noOfPieces: 3,
      isShowingBrands : true,
      selectedBrand: 0
    };
  }

  selectBrand(){
    this.setState({})
  }

  render() {

    Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;


    const { deliveryOption, deliveryOptionPickUpFormStore } = this.state
    console.log(deliveryOption);

    const sizeCtrl = {width: 40, height: 40}
    return (
      <SafeAreaView >
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 50 }}>
            <Image style={{ width: 80, height: 80 }} source={require('../img/om.png')} />
          </View>
          <View style={{ flexDirection: 'column'}}>
            <View style={{ marginTop: 50, marginBottom: 10}}>
              <Text style={{ fontSize: 20, textAlign: 'center' }}>Select a brand to continue :</Text>
            </View>

            <View style={{justifyContent: 'center', alignItems: 'center', width: width}}>
              <View style={{width: width -90, height:300,borderColor: '#0451A5', borderWidth: 1}}>
                <ScrollView>
                  <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{marginBottom: 10}}/>
                      {this.state.isShowingBrands?Brands.map((brand,index)=>{
                        return (
                            <TouchableWithoutFeedback key={index} onPress={()=>this.selectBrand()}>
                              <View style={{padding: 10, marginBottom: 15, borderColor: '#000',
                                borderWidth: 0.3, backgroundColor: this.state.selectedBrand===index?'#0451A5':'#fff', borderRadius: 10, width: width-120}}>
                                <Text style={{fontSize: 20, color: this.state.selectedBrand===index?'#fff':'#000'}}>{brand.name}</Text>
                              </View>
                            </TouchableWithoutFeedback>
                        )}):
                          null}
                  </View>
                </ScrollView>
              </View>
            </View>

            <View style={{ marginTop: 20, marginBottom: 30, flexDirection: 'row', justifyContent: 'center' }}>
              <Button
                  style={{ borderRadius: 15, borderWidth: 2, backgroundColor: '#0451A5', height: 40, width: width - 80, justifyContent: 'center' }}
                  onPress={() =>null}>
                <Text style={{ fontSize: 18, color: 'white' }}>ADD TO CART</Text>
              </Button>
            </View>
          </View>
      </SafeAreaView>
    );
  }
}

/**

 <View style={{padding: 10, marginBottom: 15,
                      borderColor: '#000', borderWidth: 0.3, backgroundColor: '#fff', borderRadius: 10, width: width-120}}>
                       shadowOpacity: 0.25,
                      shadowRadius: 5,
                      shadowColor: '#000',
                      shadowOffset: { height: 2, width: 2 }


<Text style={{fontSize: 20}}>Toyoba</Text>
</View>

<View style={{padding: 10, marginBottom: 15,

  shadowOpacity: 0.25,
  shadowRadius: 5,
  shadowColor: '#000',
  shadowOffset: { height: 2, width: 2 }

  , backgroundColor: '#fff', borderRadius: 10, width: width-120}}>
  <Text style={{fontSize: 20}}>Toyoba</Text>
</View>

**/
