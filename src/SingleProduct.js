import React, { Component } from 'react';
import { FlatList, View, Alert, Text, Image,Platform, Dimensions,TouchableWithoutFeedback, ActivityIndicator, Modal, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import {Button} from 'native-base';
import axios from "./axios/AxiosInstance";
import RadioGroup from './components/RadioGroupCustom';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {B, I, U} from "./components/TextStyles";
import Store from "./CommonStore/Store";

const isIos = Platform.OS == 'ios';

const { width, height } = Dimensions.get('window');

export default class SingleProduct extends Component{
    state = {products: [], isLoading: false};
    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 },
            headerTintColor: '#fff',
            title: navigation.getParam('title'),
        };
    };

  componentDidMount(){
      this.getProductDetails(this.props.navigation.getParam('product_id'));
  }

  async getProductDetails(id){
      debugger
      await Store.getProductDetail(id);
  }

  addToCart(product){
    const {main} = this.props;
    const {product_image: image, product_name:name,  product_price:price} = product;
    let data =  {isFabric: false, image,name, price, quantity:1, product_id: product.product_id, isProduct: true};
    var screen = main.state.language.fabricScreen;
    var product_found = main.state.cart.findIndex(c=>(c.isProduct && c.product_id==product.product_id));
    if(product_found>=0){
      main.updateQuantity(product_found, 1);
    } else {
      main.addToCart(data);
    }
  }

  render() {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    // var screen = this.state.language.fabricScreen;
    const {main} = this.props;
    const {isLoading} = Store.getStore();
    debugger
    // console.log(this.state.products)
    const products = this.state.products;
    // console.log(await Store.getProducts());
    var screen = this.props.screen;
    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{borderColor:'#0451A5',borderWidth:1,borderTopWidth:0,flex:1}}>
          {isLoading?
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator style={{top: height*0.4}}  color={'#0451A5'} size={'large'} animating={true}/>
              </View>:null
          }
        </ScrollView>
    );

  }
}
