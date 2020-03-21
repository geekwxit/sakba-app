import React, { Component } from 'react';
import { FlatList, View, Alert, Text, Image,Platform, Dimensions,TouchableWithoutFeedback, ActivityIndicator, Modal, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import {Button} from 'native-base';
import axios from "./axios/AxiosInstance";
import RadioGroup from './components/RadioGroupCustom';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {B, I, U} from "./components/TextStyles";

const isIos = Platform.OS == 'ios';

const { width, height } = Dimensions.get('window');

export default class ShopScreen extends Component<Props>{

  static navigationOptions = ({ navigation }) => {
    const cartCount = navigation.state.params.cartCount?navigation.state.params.cartCount:null;
    return {
      headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 },
      headerTintColor: '#fff',
      title: navigation.getParam('title'),
      headerRight: (
          <View style={{marginRight: 10}}>
          <TouchableOpacity onPress={()=>navigation.state.params.showCart?navigation.state.params.showCart():
            Alert.alert(this.state.language.commonFields.alertTitle, navigation.getParam('error'), [{text: this.state.language.commonFields.okButton}])
          }>
            <View style={{padding: 10, flexDirection: 'row'}}>
              <Icon color="white" name="md-cart" size={25}></Icon>
              {cartCount?<View style={{backgroundColor: 'white', padding: 5, position: 'absolute', borderRadius: 15,zIndex: 10, marginLeft: 25}}>
                <Text style={{fontSize: 10, color: '#0451A5'}}>{cartCount}</Text>
              </View>:null}
            </View>
          </TouchableOpacity>
          </View>
      )
    };
  };
  constructor(props) {
    super(props)
    this.state = {
      measurement: 0,
      language: props.navigation.getParam('language'),
      isLoading: true,
      noOfPieces: this.props.navigation.getParam('noOfPieces', null),
      mobileNo: this.props.navigation.getParam('mobileNo', null),
      patternOverlayHeight: 0, cartVisible: false, productBox: false,
      cart : [],
      products: [],
      totalCartItems: 0, selectionChanged: false, changeType: null,
      fabricPreview: false, previewTitle: 'Preview', previewPath: null,
      // productDetail: null, productDetailVisible: false,
    };
    this.showCart = this.showCart.bind(this);
    this.doCheckout = this.doCheckout.bind(this);
    this.props.navigation.setParams({showCart: this.showCart})
  }
  componentDidMount() {
    this.setState({language: this.props.navigation.getParam('language'), measurement: this.props.navigation.getParam('measurement')});
    this.props.navigation.setParams({title: 'Products', error: this.state.language.fabricScreen.commonError});
    this.getAllProducts();
  }

  async getAllProducts(){
    var screen = this.state.language.fabricScreen;
    axios.get('get_products.php'+'?lang='+this.state.language.getLanguage())
        .then(response=>response.data)
        .then(response=>this.setState({products: response.products}))
        .then(()=>this.setState({isLoading:false}))
        .catch(error=>{
          console.log("Get fabrics error: ", error);
          Alert.alert(this.state.language.commonFields.alertTitle, screen.commonError, [{text: this.state.language.commonFields.okButton}]);
        })
  }

  showCart(){
    this.setState({cartVisible: true})
  }

  addToCart(product){
    var screen = this.state.language.fabricScreen;
    var product_found = this.state.cart.findIndex(c=>c.product_id==product.product_id);
    if(product_found>=0){
      this.updateQuantity(product_found, 1);
    } else {
      product = {...product, quantity: 1};
      this.setState({cart : [...this.state.cart, product]});
      this.props.navigation.setParams({cartCount: this.state.cart.length+1});
      this.setState(prev=>({totalCartItems: prev.totalCartItems+1}))
    }
  }

  removeFromCart(quantity, index){
    tempCart = this.state.cart;
    tempCart.splice(index,1);
    this.setState({
      cart: tempCart,
      totalCartItems: this.state.totalCartItems - quantity,
    });
    this.props.navigation.setParams({cartCount: this.state.cart.length});
  }

  doCheckout(){
    var screen = this.state.language.fabricScreen;
      this.setState({cartVisible : false});
    const inHomeCount = this.state.inHomeCount;
    const outsideCount= this.state.outsideCount;
    const mobileNo    = this.props.navigation.getParam('mobileNo', null);
    const customerName= this.props.navigation.getParam('customerName', null);
    const cart        = this.state.cart;
    console.log("PLEASE CHECK:", screen.moreThan(inHomeCount));
    this.state.totalCartItems>inHomeCount?Alert.alert(this.state.language.commonFields.alertTitle, screen.moreThan(inHomeCount), [{text: this.state.language.commonFields.okButton}]):
        this.state.totalCartItems<inHomeCount?Alert.alert(this.state.language.commonFields.alertTitle, screen.lessThan(inHomeCount), [{text: this.state.language.commonFields.okButton}]):
            this.state.totalCartItems==inHomeCount?
                this.props.navigation.navigate('delivery',
                    {language: this.state.language, inHomeCount, outsideCount, mobileNo, customerName, fabrics: this.state.brands, cart, noOfPieces: this.state.noOfPieces, measurement: this.state.measurement}):
                Alert.alert(this.state.language.commonFields.alertTitle, screen.commonError, [{text: this.state.language.commonFields.okButton}])
  }

  selectionChanged(type){
    this.setState({selectionChanged: true, changedType: type})
    setTimeout(()=>this.temp(), 1000);
  }

  getPatternData(){
    if(this.state.brands.length){
      return this.state.brands[this.state.selectedBrand].patterns?this.state.brands[this.state.selectedBrand].patterns:null;
    }
    return null;
  }
  getColorData(){
    if(this.state.brands.length){
      patterns = this.state.brands[this.state.selectedBrand].patterns;
      if(patterns && patterns.length){
        return patterns[this.state.selectedPattern].colors?patterns[this.state.selectedPattern].colors:null;
      }
    }
    return null;
  }

  temp(){
    this.setState({selectionChanged: false, changedType: null});
  }

  updateQuantity(index, amount){
    var cart2 = Object.assign([], this.state.cart);
    var product  = cart2[index];
    product.quantity += amount;
    var finalCart = [...(cart2.splice(0, index)), product,...(cart2.splice(1, cart2.length))];
    this.setState({cart: finalCart})
  }

  render() {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    const { deliveryOption, deliveryOptionPickUpFormStore } = this.state;
    console.log(this.state);
    var screen = this.state.language.fabricScreen;
    var parentHeight = null;
    const sizeCtrl = {width: 40, height: 40}
    return (
      <SafeAreaView>
        {false && this.state.isLoading?
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator style={{top: height*0.4}}  color={'#0451A5'} size={'large'} animating={true}/>
            </View>:
            <View style={{borderWidth:1}}>
              <ScrollView>
          {/**Define all modals here**/}
          {/*<ProductModal isRTL={this.state.language.isRTL} measurement={this.state.measurement} text={screen} price={0} brands={this.state.brands} onAdd={()=>this.setState({productBox: false},this.addToCart.bind(this))} selected={null} visible={this.state.productBox} close={()=>this.setState({productBox: false})}/>*/}
          <CartModal
              measurement={this.state.measurement}
              isRTL={this.state.language.isRTL}
              texts={screen}
              checkout={this.doCheckout}
              removeItem={(quantity, index)=>this.removeFromCart(quantity, index)}
              updateQuantity={(index, amount)=>this.updateQuantity(index, amount)}
              close={()=>this.setState({cartVisible: false})}
              visible={this.state.cartVisible}
              // visible={true}
              cartItems={this.state.cart}/>
          {/*<FabricPreview ok={screen.previewOKButton} title={this.state.previewTitle} source={this.previewPath} close={()=>this.setState({fabricPreview: false})} visible={this.state.fabricPreview}/>*/}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 50}}>
            <Image style={{ width: 80, height: 80 }} source={require('../img/om.png')} />
          </View>
          <View style={{ flexDirection: 'column', marginHorizontal: 40 }}>
              <View style={{marginTop: 20, marginBottom: 10}}>
                <Text style={{fontSize: 20, textAlign: 'center'}}>Products</Text>
              </View>
          </View>
                <View style={{marginBottom:10,alignItems:'center'}}>
                <FlatList
                    numColumns={2}
                    key={2}
                    data={this.state.products}
                    renderItem={({item})=> {
                     return <View style={{
                        marginTop: 10,
                        borderWidth: 1,
                        borderColor: '#0551a5',
                        marginHorizontal: 10,
                        width: (width / 2) - 30
                      }}>
                       <View style={{width:'100%'}}>
                        <View style={{width: '100%', height: 170}}>
                          <Image resizeMode={'contain'} style={{width:'100%',height:'100%', alignSelf: 'center'}}
                                 source={{uri: item.product_image}}/>
                        </View>
                        <View style={{paddingHorizontal: 10}}>
                          <Text style={{fontSize: 15}} numberOfLines={2}><B>{item.product_name}</B></Text>
                          <Text style={{fontSize: 15}}><B>Price: </B>{item.product_price} KD</Text>
                        </View>
                       </View>
                        <TouchableOpacity onPress={()=>this.addToCart(item)} style={{paddingVertical: 5, backgroundColor: '#0551a5', alignItems: 'center'}}>
                          <Text style={{color: 'white', fontWeight: 'bold'}}>ADD TO CART</Text>
                        </TouchableOpacity>
                      </View>
                    }}
                    />
                </View>
            {/*<View style={{ marginTop: 20, marginBottom: 20, flexDirection: 'row', justifyContent: 'center' }}>*/}
            {/*  <Button*/}
            {/*      style={{ borderRadius: 15, borderWidth: 2, backgroundColor: '#0451A5', height: 40, width: width - 80, justifyContent: 'center' }}*/}
            {/*      onPress={() =>this.setState({productBox: true})}>*/}
            {/*    <Text style={{ fontSize: 18, color: 'white' }}>{screen.addToCartButton}</Text>*/}
            {/*  </Button>*/}
            {/*</View>*/}
            {/*<View style={{ marginBottom: 30, flexDirection: 'row', justifyContent: 'center' }}>*/}
            {/*  <Button*/}
            {/*      style={{ borderRadius: 15, borderWidth: 2, backgroundColor: '#0451A5', height: 40, width: width - 80, justifyContent: 'center' }}*/}
            {/*      onPress={() =>this.showCart()}>*/}
            {/*    <Text style={{ fontSize: 18, color: 'white' }}>{screen.checkoutButton}</Text>*/}
            {/*  </Button>*/}
            {/*</View>*/}
        </ScrollView>
            </View>
        }
      </SafeAreaView>
    );
  }
}

const ProductModal = (props) => {
  isColorAnImage = true;
  texts = props.text;
  return(
      <Modal
          style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%) !important'}}
          animationType='fade'
          transparent={true}
          onRequestClose={()=>props.close()}
          visible={props.visible}
      >
        <TouchableWithoutFeedback onPress={()=>props.close()}>
          <View style={{flex:1 ,alignItems: 'center', justifyContent: 'center', backgroundColor:'#00000069'}}>
            <TouchableWithoutFeedback>
            <View  style={{width: width*0.8, backgroundColor:'#fff', borderRadius: 10}}>
              <View style={{padding: 8,borderTopLeftRadius:10, borderTopRightRadius: 10,backgroundColor: '#0451A5',justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 20, color: 'white'}}>
                  {texts.selectPTitle}
                </Text>
              </View>
              <View style={{padding: 10}}>
                <View style={[{flexDirection: 'row'}, (props.isRTL?{justifyContent:'flex-end'}:null)]}>
                  <Text style={{fontSize: 18}}><B>{texts.selectPBrand}</B>{props.selected.brand}</Text>
                </View>
                <Text style={{fontSize: 18, fontWeight: 'bold', alignSelf:props.isRTL?'flex-end':'flex-start',textAlign:props.isRTL?'right':'left'}}>{texts.selectPPattern}</Text>
                  <View style={[{flexDirection: 'row'}, (props.isRTL?{justifyContent:'flex-end'}:null)]}>
                    <Text style={{fontSize: 18}}><B>{texts.selectPPrice}</B> {props.price} {texts.selectPerMeter}</Text>
                  </View>
                  <View style={[{flexDirection: 'row'}, (props.isRTL?{justifyContent:'flex-end'}:null)]}>
                      {props.isRTL?<Text style={{fontSize: 18}}> {(props.price*props.measurement)!=0?(props.price*props.measurement):props.price + texts.kd}</Text>:null}
                      <Text style={{fontSize: 18, fontWeight: 'bold'}}>{texts.selectPFinalPrice}</Text>
                      {!props.isRTL?<Text style={{fontSize: 18}}> {(props.price*props.measurement)!=0?(props.price*props.measurement):props.price + texts.kd}</Text>:null}
                </View>
              </View>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <View style={{ alignItems : 'center', justifyContent: 'center'}}>
                  {props.selected.pattern && props.selected.color?
                  <Image style={{width: width*0.8, height: 200, resizeMode: 'contain',borderRadius: 10}} source={{uri: props.selected.color}} /> :
                      <Text style={{fontSize:20, color:'rgba(255,40,67,0.67)'}}>{texts.noColorPattern}</Text>
                  }
                </View>
              </View>
              <View style={{height: 10}}/>
              {/*<View style={{padding: 10,flexDirection: 'row',marginTop:0, alignItems :'center'}}>*/}
              {/*  <Text style={{fontSize: 18}}>Fabric Color:</Text>*/}
              {/*  <View style={{marginLeft: 5, width: 100, height:20}}>*/}
              {/*    {this.isColorAnImage?*/}
              {/*    <Image style={{flex: 1, height:20, width: 100,   resizeMode: 'cover'}} source={{uri: props.selected.color}}/>:null*/}
              {/*    }*/}
              {/*  </View>*/}
              {/*</View>*/}
              <TouchableOpacity onPress={()=>(props.selected.pattern&&props.selected.color)?props.onAdd():props.close()}>
                <View style={{ backgroundColor: '#0451A5', alignItems: 'center', justifyContent: 'center', padding:10, borderBottomLeftRadius:10, borderBottomRightRadius: 10}}>
                  <Text style={{fontSize: 20, color: 'white'}}>{texts.selectPButton}</Text>
                </View>
              </TouchableOpacity>
            </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
  )
}
const CartModal = ({updateQuantity, isRTL, texts, close, visible, cartItems, checkout, removeItem, measurement, showDetail}) => {
  cartTotal = 0;
  return(
      <Modal
          style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%) !important'}}
          animationType='fade'
          transparent={true}
          onRequestClose={()=>close()}
          visible={visible}
      >
        <TouchableWithoutFeedback onPress={()=>close()}>
          <View style={{flex:1 ,alignItems: 'center', justifyContent: 'center', backgroundColor:'#00000069'}}>
            <TouchableWithoutFeedback onPress={()=>{}}>
              <View  style={{width: width*0.8, backgroundColor:'#fff', borderRadius: 10}}>
                <View style={{padding: 8,borderTopLeftRadius:10, borderTopRightRadius: 10,backgroundColor: '#0451A5',justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 20, color: 'white'}}>
                    {texts.cartTitle}
                  </Text>
                </View>
                <View style={{height: height*0.5}}>
                  {cartItems.length>0?
                    <View style={{flex:1}}>
                      <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{flex:1}} onStartShouldSetResponder={()=>true}>
                          {cartItems.map((item, index)=>{
                              cartTotal += (item.quantity*parseFloat(item.product_price));
                              return <CartItem
                                  name={item.product_name}
                                  rate={parseFloat(item.product_price).toFixed(2)}
                                  showDetail={(product)=>{showDetail(product)}}
                                  isRTL={isRTL}
                                  texts={texts}
                                  price={(item.quantity*parseFloat(item.product_price)).toFixed(2)}
                                  quantity={item.quantity}
                                  key={index}
                                  onRemove={()=>removeItem(item.quantity,index)}
                                  img={item.product_image}
                                  incQuantity={()=>updateQuantity(index, 1)}
                                  decQuantity={()=>item.quantity==1?removeItem(item.quantity, index):updateQuantity(index, -1)}
                              />
                          })
                          }
                        </View>
                      </ScrollView>
                        <View style={{
                            borderTopColor: 'rgba(255,255,255,0)',
                          borderBottomColor: '#fff', borderLeftColor: '#fff', borderRightColor: '#fff',
                            borderWidth:2,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding:10}}>
                            <Text style={{fontSize: 20, color: '#0451A5', alignSelf: 'center'}}>{texts.cartTotal} {parseFloat(cartTotal).toFixed(2)} {texts.kd}</Text>
                        </View>
                        <TouchableOpacity onPress={checkout}>
                          <View style={{ backgroundColor: '#0451A5', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding:10, borderBottomLeftRadius:10, borderBottomRightRadius: 10}}>
                            <Text style={{fontSize: 20, color: 'white', alignSelf: 'center'}}>{texts.cartConfirm}</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      :
                  <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: 'grey', fontSize: 20}}>{texts.cartEmpty}</Text>
                  </View>
                  }
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
  )
}
const FabricPreview = (props) => {
  console.log({src: props.source});
  return(
      <Modal
          style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%) !important'}}
          animationType='fade'
          transparent={true}
          onRequestClose={()=>props.close()}
          visible={props.visible}
          //onShow={()=>console.log("CAAART", cart)}
      >
        <TouchableWithoutFeedback onPress={()=>props.close()}>
          <View style={{flex:1 ,alignItems: 'center', justifyContent: 'center', backgroundColor:'#00000069'}}>
            <TouchableWithoutFeedback onPress={()=>{}}>
              <View  style={{width: width*0.8, backgroundColor:'#fff', borderRadius: 10}}>
                <View style={{padding: 8,borderTopLeftRadius:10, borderTopRightRadius: 10,backgroundColor: '#0451A5',justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 20, color: 'white'}}>{props.title}</Text>
                </View>
                <View style={{height: height*0.4}}>
                  {/*<View style={{flex:1, backgroundColor: 'black'}}>*/}
                  <Image source={{uri: props.source}} style={{flex:1, resizeMode: 'stretch', height: null, width: null}}/>
                  {/*</View>*/}
                </View>
                <TouchableOpacity onPress={()=>props.close()}>
                  <View style={{ backgroundColor: '#0451A5', alignItems: 'center', justifyContent: 'center', padding:10, borderBottomLeftRadius:10, borderBottomRightRadius: 10}}>
                    <Text style={{fontSize: 20, color: 'white'}}>{props.ok}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
  )
}

const CartItem = ({texts, isRTL, name, quantity, price, showDetail, onRemove, img, incQuantity, decQuantity}) =>{
    return (
        <View style={{borderColor: '#0451A5', borderWidth: 1, padding: 0, flexDirection: 'row'}}>
          {!isRTL?
            <View style={{flexDirection: 'row', width:'70%'}}>
              <View style={{ flex: 2, padding : 10}}>
                <Image style={{width: 80, height: 80,resizeMode: 'contain', flex: 1}} source={{uri: img}}/>
              </View>
              <View style={{flex:2}}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>{name}</Text>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>{texts.cartQuantity} {quantity}</Text>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>{texts.cartPrice} {parseFloat(price).toFixed(2)}</Text>
              </View>
            </View>:null}
          <View style={{alignSelf: 'flex-end',width:'30%', padding: 5}}>
            {/*<TouchableOpacity onPress={() => showDetail(1)}>*/}
            {/*  <View style={{flex: 1, backgroundColor: '#0451A5', width: 90, height: 30,*/}
            {/*    alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginBottom:10}}>*/}
            {/*    <Text style={{fontSize: 20, color: 'white'}}>Details</Text>*/}
            {/*  </View>*/}
            {/*</TouchableOpacity>*/}
            <View style={{marginBottom:20,flexDirection:'row', alignItems:'center',justifyContent:'space-between'}}>
              <TouchableOpacity onPress={()=>incQuantity()}>
                <AntDesign size={25} color={'#0451A5'} name={'pluscircle'}/>
              </TouchableOpacity>
              <Text style={{fontWeight:'bold'}}>1</Text>
              <TouchableOpacity onPress={()=>decQuantity()}>
                <AntDesign size={25} color={'#0451A5'} name={'minuscircle'}/>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => onRemove()}>
              <View style={{flex: 1, backgroundColor: '#0451A5',padding:5,
                alignItems: 'center', justifyContent: 'center', borderRadius: 10}}>
                <Text style={{fontSize: 15, color: 'white'}}>{texts.cartRemove}</Text>
              </View>
            </TouchableOpacity>
          </View>
          {isRTL?
              <View style={{flexDirection: 'row', width:'70%'}}>
                <View style={{flex: 2}}>
                  <Text style={{fontSize: 20,textAlign:'right', fontWeight: 'bold'}}>{name}</Text>
                  <Text style={{fontSize: 15, fontWeight: 'bold'}}>{texts.cartQuantity} {quantity}</Text>
                  <Text style={{fontSize: 15, fontWeight: 'bold'}}>{texts.cartPrice} {parseFloat(price).toFixed(2)}</Text>
                </View>
                <View style={{ padding:10}}>
                  <Image style={{width: 80, height: 80,flex:1,resizeMode: 'contain'}} source={{uri: img}}/>
                </View>
              </View>:null}
        </View>
    )
}
