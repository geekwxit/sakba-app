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
const baseURL = 'https://sakba.net/images/product/';

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

  addToCart(product, main, productRef){
    // const {main} = this.props;
    let data =  {isFabric: false, ...product, isProduct: true};
    var screen = main.state.language.fabricScreen;
    var product_found = main.state.cart.findIndex(c=>(c.isProduct && c.product_id==product.product_id));
    if(product_found>=0){
      main.updateQuantity(product_found, 1);
    } else {
      main.addToCart(data);
    }
    productRef.props.navigation.goBack();
  }

  render() {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    // var screen = this.state.language.fabricScreen;
    const {main, isRTL=0} = this.props;
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
                  <View style={{flex:1, marginBottom:10}}>
                    {
                      (this.state.products && this.state.products.length>0)?

                          <FlatList
                              contentContainerStyle={{paddingBottom:5}}
                              numColumns={2}
                              key={2}
                              data={products}
                              showsVerticalScrollIndicator={false}
                              keyExtractor={(item, index) => 'products_'+index.toString()}
                              renderItem={({item})=> {
                                  const that= this;
                                  const {main} = that.props;
                                return <Product item={item} onAddToCart={()=>this.addToCart(item)}
                                                openProduct={()=>main.props.navigation.navigate('single_product',{
                                                    title: item.product_name,product_id: item.product_id,
                                                    addToCartCallback: function (product, ref){
                                                        that.addToCart(product, main, ref)
                                                    }
                                                })}
                                                isOutofStock={parseInt(item.from_supplier)?!parseInt(item.product_qty)>0:false}
                                                isRTL={isRTL}
                                                discountLabel={screen.discountLabel}
                                                priceLabel={screen.priceLabel}
                                                salePriceLabel={screen.salePriceLabel}
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

const Product=({item, openProduct,isOutofStock, priceLabel, discountLabel, salePriceLabel, outOfStockLabel, isRTL })=>(
    <TouchableOpacity disabled={isOutofStock} onPress={openProduct}
                      style={{borderColor: isOutofStock?'#FF0000':'#0551a5', marginTop: 10, borderWidth: 1, marginHorizontal: 10, width: (width / 2) - 30, justifyContent:'space-between'}}>
        <View style={{width:'100%'}}>
            {isOutofStock?<Text style={{
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#FFFFFF',
                backgroundColor: 'red'
            }}>{outOfStockLabel}</Text>:null}
            <View style={{width: '100%', height: 170}}>
                <Image style={{flex:1,resizeMode:'contain'}} source={{uri: baseURL+item.product_gallery.split(',')[0]}}/>
            </View>
            <View style={{paddingHorizontal: 10}}>
                <B style={{fontSize: 15, textAlign: isRTL?'right':'left'}} numberOfLines={2}>{item.product_name}</B>
                <View style={{flexDirection:isRTL?'row-reverse':'row'}}>
                    <B>{priceLabel}</B>
                    <Text style={{fontSize: 15, textDecorationLine: (item.discount_percentage && parseFloat(item.discount_percentage))?'line-through':''}}>
                        {item.product_price} KD
                    </Text>
                </View>
                {item.discount_percentage && parseFloat(item.discount_percentage)?
                    <View style={{flexDirection:isRTL?'row-reverse':'row'}}>
                        <B>{discountLabel}</B>
                        <Text style={{fontSize: 15}}>{item.discount_percentage} %</Text>
                    </View>
                    :null}
                {item.product_sale_price && parseFloat(item.product_sale_price) && item.discount_percentage && parseFloat(item.discount_percentage) ?
                    <View style={{flexDirection:isRTL?'row-reverse':'row'}}>
                        <B>{salePriceLabel}</B>
                        <Text style={{fontSize: 15, color: '#0551a5'}}>{item.product_sale_price} KD</Text>
                    </View>
                    :null}
            </View>
        </View>
    </TouchableOpacity>
)
// const Product=({item, openProduct, onAddToCart, addToCartLabel, outOfStockLabel })=>(
//     <TouchableOpacity onPress={()=>false} style={{marginTop: 10, borderWidth: 1, borderColor: '#0551a5', marginHorizontal: 10, width: (width / 2) - 30, justifyContent:'space-between'}}>
//         <View style={{width:'100%'}}>
//             <View style={{width: '100%', height: 170}}>
//                 <Image style={{flex:1,resizeMode:'contain'}} source={{uri: item.product_image}}/>
//             </View>
//             <View style={{paddingHorizontal: 10}}>
//                 <Text style={{fontSize: 15}} numberOfLines={2}><B>{item.product_name}</B></Text>
//                 <Text style={{fontSize: 15}}><B>Price: </B>{item.product_price} KD</Text>
//             </View>
//         </View>
//         <TouchableOpacity disabled={!parseInt(item.from_supplier)?false:!(parseInt(item.product_qty)>0)}
//                           onPress={()=>onAddToCart()}
//                           style={{paddingVertical: 5,
//                             backgroundColor: (parseInt(item.from_supplier)?(parseInt(item.product_qty)>0):true)?'#0551a5':'#ff0000', alignItems: 'center'}}>
//             <Text style={{color: 'white', fontWeight: 'bold'}}>
//               {(parseInt(item.from_supplier)?(parseInt(item.product_qty)>0):true)?addToCartLabel:outOfStockLabel}
//             </Text>
//         </TouchableOpacity>
//     </TouchableOpacity>
// )
