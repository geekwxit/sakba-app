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

export default class ProductsScreen extends Component{
  state = {products: [], isLoading: false};

  componentDidMount(){
    this.getProducts();
  }

  async getProducts(){
    this.setState({isLoading: true},
        async ()=>this.setState({products: await Store.getProducts()},
            ()=>this.setState({isLoading: false})
        )
    );
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
    // console.log(this.state.products)
    const products = this.state.products;
    // console.log(await Store.getProducts());
    var screen = this.props.screen;
    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{borderColor:'#0451A5',borderWidth:1,borderTopWidth:0,flex:1}}>
          {this.state.isLoading?
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator style={{top: height*0.4}}  color={'#0451A5'} size={'large'} animating={true}/>
              </View>:null
          }
                  <View style={{flex:1,marginBottom:10,alignItems:'center', justifyContent:'center'}}>
                    {
                      (this.state.products && this.state.products.length>0)?

                          <FlatList
                              numColumns={2}
                              key={2}
                              data={products}
                              renderItem={({item})=> {
                                return <Product item={item} onAddToCart={()=>this.addToCart(item)}
                                                openProduct={()=>main.props.navigation.navigate('single_product',{
                                                    title: item.product_name,
                                                })}
                                                addToCartLabel={screen.addToCartLabel}
                                                outOfStockLabel={screen.outOfStockLabel}
                                        />
                              }}
                          />:
                          !this.state.isLoading && <View style={{alignItems:'center', justifyContent:'center'}}>
                            <Feather size={80} color={'grey'} name={'alert-circle'}/>
                            <Text style={{fontWeight:'bold', fontSize:20}}>
                                {screen.noProducts}
                            </Text>
                            <TouchableOpacity onPress={()=>this.getProducts()} style={{justifyContent:'center',borderRadius:10,alignItems:'center',padding:10, backgroundColor:'#0551a5'}}>
                              <Text style={{color: '#fff', letterSpacing:2}}>{screen.retryButton}</Text>
                            </TouchableOpacity>
                          </View>
                    }
                  </View>
                </ScrollView>
    );

  }
}

const Product=({item, openProduct, onAddToCart, addToCartLabel, outOfStockLabel })=>(
    <TouchableOpacity onPress={()=>false} style={{marginTop: 10, borderWidth: 1, borderColor: '#0551a5', marginHorizontal: 10, width: (width / 2) - 30, justifyContent:'space-between'}}>
        <View style={{width:'100%'}}>
            <View style={{width: '100%', height: 170}}>
                <Image style={{flex:1,resizeMode:'contain'}} source={{uri: item.product_image}}/>
            </View>
            <View style={{paddingHorizontal: 10}}>
                <Text style={{fontSize: 15}} numberOfLines={2}><B>{item.product_name}</B></Text>
                <Text style={{fontSize: 15}}><B>Price: </B>{item.product_price} KD</Text>
            </View>
        </View>
        <TouchableOpacity disabled={!parseInt(item.from_supplier)?false:!(parseInt(item.product_qty)>0)}
                          onPress={()=>onAddToCart()}
                          style={{paddingVertical: 5,
                            backgroundColor: (parseInt(item.from_supplier)?(parseInt(item.product_qty)>0):true)?'#0551a5':'#ff0000', alignItems: 'center'}}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              {(parseInt(item.from_supplier)?(parseInt(item.product_qty)>0):true)?addToCartLabel:outOfStockLabel}
            </Text>
        </TouchableOpacity>
    </TouchableOpacity>
)