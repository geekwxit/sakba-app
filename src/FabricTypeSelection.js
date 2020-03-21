import React, { Component } from 'react';
import { View, Alert, Text, Image,Platform, Dimensions,TouchableWithoutFeedback, ActivityIndicator, Modal, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import {Button} from 'native-base';
import axios from './axios/AxiosInstance';
import RadioGroup from './components/RadioGroupCustom';
import Icon from 'react-native-vector-icons/Ionicons';
import {B, I, U} from "./components/TextStyles";

const isIos = Platform.OS == 'ios';

const { width, height } = Dimensions.get('window');

export default class FabricTypeSelection extends Component<Props>{

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
      inHomeCount: this.props.navigation.getParam('inHomeCount', null),
      outsideCount: this.props.navigation.getParam('outsideCount', null),
      selectedFabricType: null,

      selectedBrand: 0, selectedPattern: 0, selectedColor: 0,
      patternOverlayHeight: 0, cartVisible: false, productBox: false,
      brands: [],
      cart : [],
      totalCartItems: 0, selectionChanged: false, changeType: null,
      shouldBrandShow: true, shouldPatternShow: true,shouldColorShow: true,
       colorLoader: false,
      fabricPreview: false, previewTitle: 'Preview', previewPath: null,

      productDetail: null, productDetailVisible: false,
    };
    this.showCart = this.showCart.bind(this);
    this.doCheckout = this.doCheckout.bind(this);
    this.props.navigation.setParams({showCart: this.showCart})
  }
  componentDidMount() {
    this.setState({language: this.props.navigation.getParam('language'), measurement: this.props.navigation.getParam('measurement')});
    this.props.navigation.setParams({title: this.state.language.fabricScreen.title, error: this.state.language.fabricScreen.commonError});
    this.getAllFabrics();
  }

  async getAllFabrics(){
    var screen = this.state.language.fabricScreen;
    axios.get('get_fabrics.php'+'?lang='+this.state.language.getLanguage())
        .then(response=>response.data)
        .then(response=>this.setState({brands: response.brands}))
        .then(()=>this.setState({isLoading:false}))
        .catch(error=>{
          console.log("Get fabrics error: ", error);
          Alert.alert(this.state.language.commonFields.alertTitle, screen.commonError, [{text: this.state.language.commonFields.okButton}]);
        })
  }

  showCart(){
    this.setState({cartVisible: true})
  }

  addToCart(){
    this.setState({productBox:false})
    var screen = this.state.language.fabricScreen;
    var productFound = false;
    const {selectedPattern, selectedBrand, selectedColor} = this.state;
    const product = {pattern: selectedPattern,brand:  selectedBrand,color: selectedColor, quantity: 1, price: parseInt(this.state.brands[selectedBrand].price)};
    this.state.cart.forEach(item=>{
        if(item.brand==product.brand && item.pattern==product.pattern && item.color==product.color){
          productFound = true;
        }
      })
    !productFound?this.setState({cart : [...this.state.cart, product]}):null;
    !productFound?this.props.navigation.setParams({cartCount: this.state.cart.length+1}):null;
    total = !productFound?parseInt(this.state.totalCartItems)+1:null;
    total?this.setState({totalCartItems: total}):null;
    productFound?this.safeAlert(this.state.language.commonFields.alertTitle, screen.alreadyInCart, [{text: this.state.language.commonFields.okButton}]):
      this.safeAlert(this.state.language.commonFields.alertTitle, screen.addedToCart, [{text: this.state.language.commonFields.okButton}])
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
    this.state.totalCartItems>inHomeCount?this.safeAlert(this.state.language.commonFields.alertTitle, screen.moreThan(inHomeCount), [{text: this.state.language.commonFields.okButton}]):
        this.state.totalCartItems<inHomeCount?this.safeAlert(this.state.language.commonFields.alertTitle, screen.lessThan(inHomeCount), [{text: this.state.language.commonFields.okButton}]):
            this.state.totalCartItems==inHomeCount?
                this.props.navigation.navigate('delivery',
                    {language: this.state.language, inHomeCount, outsideCount, mobileNo, customerName, fabrics: this.state.brands, cart, noOfPieces: this.state.noOfPieces, measurement: this.state.measurement}):
                this.safeAlert(this.state.language.commonFields.alertTitle, screen.commonError, [{text: this.state.language.commonFields.okButton}])
  }

  safeAlert(title, message, buttons){
    isIos?setTimeout(()=>Alert.alert(title, message, buttons),500):Alert.alert(title, message, buttons);
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
        {this.state.isLoading?
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator style={{top: height*0.4}}  color={'#0451A5'} size={'large'} animating={true}/>
        </View>:
        <ScrollView>
          {/**Define all modals here**/}
          <ProductModal isRTL={this.state.language.isRTL}
                        measurement={this.state.measurement}
                        text={screen}
                        price={this.state.brands[this.state.selectedBrand].price}
                        brands={this.state.brands}
                        onAdd={()=>this.addToCart()}
                        selected={{
                          brand: this.state.brands?this.state.brands[this.state.selectedBrand].name:null,
                          pattern: this.getPatternData()?(this.getPatternData())[this.state.selectedPattern].path:null,
                          color: this.getColorData()?(this.getColorData())[this.state.selectedColor].path:null
                        }}
                        visible={this.state.productBox}
                        close={()=>this.setState({productBox: false})}/>
          <CartModal
              measurement={this.state.measurement}
              isRTL={this.state.language.isRTL}
              text={screen}
              checkout={this.doCheckout}
              brands={this.state.brands}
              removeItem={(quantity, index)=>this.removeFromCart(quantity, index)}
              close={()=>this.setState({cartVisible: false})}
              visible={this.state.cartVisible}
              cartItems={this.state.cart}/>
          <FabricPreview ok={screen.previewOKButton} title={this.state.previewTitle} source={this.previewPath} close={()=>this.setState({fabricPreview: false})} visible={this.state.fabricPreview}/>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 50}}>
            <Image style={{ width: 80, height: 80 }} source={require('../img/om.png')} />
          </View>
          {this.state.brands?this.state.brands.length?
            <View style={{ flexDirection: 'column', marginHorizontal: 40 }}>
              {this.state.shouldBrandShow ?
                  <View>
                    <View style={{marginTop: 20, marginBottom: 10}}>
                      <Text style={{fontSize: 20, textAlign: 'center'}}>{screen.chooseBrand}</Text>
                    </View>
                    <View>
                      <RadioGroup
                          text={screen}
                          isRTL={this.state.language.isRTL}
                          data={this.state.brands}
                          type={screen.brandLabel}
                          isImage={false}
                          selected={this.state.selectedBrand}
                          onSelect={(index) => {
                            this.setState({selectedBrand: index, selectedColor: this.state.brands[index].patterns?0:null, selectedPattern: this.state.brands[index].patterns?0:null});
                          }}
                      />
                    </View>
                  </View>
              :null}
              {this.state.shouldPatternShow ?
              <View>
                <View style={{ marginTop: 20, marginBottom: 10}}>
                  <Text style={{ fontSize: 20, textAlign: 'center' }}>{screen.choosePattern}</Text>
                </View>
                <View>
                  <RadioGroup
                      text={screen}
                      isRTL={this.state.language.isRTL}
                      data={this.getPatternData()}
                      type={screen.patternLabel}
                      isImage={true}
                      selected={this.state.selectedPattern}
                      onSelect={(index)=>{
                        this.previewPath = this.state.brands[this.state.selectedBrand].patterns[index].path;
                        this.setState({
                        selectedPattern: index,
                        selectedColor: 0,
                        fabricPreview: true,
                        previewTitle: screen.previewTitle.t1,
                      })}}
                      isSelectionChanged={this.state.selectionChanged}
                      changeType={this.state.changeType}
                  />
                </View>
              </View>:null}
              {this.state.shouldColorShow ?
                  <View>
                    <View style={{marginTop: 20, marginBottom: 10}}>
                      <Text style={{fontSize: 20, textAlign: 'center'}}>{screen.chooseColor}</Text>
                    </View>
                    <View>
                      <RadioGroup
                          text={screen}
                          isRTL={this.state.language.isRTL}
                          data={this.getColorData()}
                          type={screen.colorsLabel}
                          isImage={true}
                          selected={this.state.selectedColor}
                          onSelect={(index) =>{
                            this.previewPath = this.state.brands[this.state.selectedBrand].patterns[this.state.selectedPattern].colors[index].path;
                            this.setState({
                              selectedColor: index,
                              previewTitle:screen.previewTitle.t2,
                              fabricPreview: true,
                            })}
                          }
                          changeType={this.state.changedType}
                      />
                    </View>
                  </View> :
                  <ActivityIndicator style={{marginTop: 10}} size={'small'} color={'#0451A5'}/>
              }
            <View style={{ marginTop: 20, marginBottom: 20, flexDirection: 'row', justifyContent: 'center' }}>
              <Button
                  style={{ borderRadius: 15, borderWidth: 2, backgroundColor: '#0451A5', height: 40, width: width - 80, justifyContent: 'center' }}
                  onPress={() =>this.setState({productBox: true})}>
                <Text style={{ fontSize: 18, color: 'white' }}>{screen.addToCartButton}</Text>
              </Button>
            </View>
            <View style={{ marginBottom: 30, flexDirection: 'row', justifyContent: 'center' }}>
              <Button
                  style={{ borderRadius: 15, borderWidth: 2, backgroundColor: '#0451A5', height: 40, width: width - 80, justifyContent: 'center' }}
                  onPress={() =>this.showCart()}>
                <Text style={{ fontSize: 18, color: 'white' }}>{screen.checkoutButton}</Text>
              </Button>
            </View>
          </View>
          :null:null
          }
        </ScrollView>
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
const CartModal = (props) => {
  cartTotal = 0;
  var isRTL = props.isRTL;
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
            <TouchableWithoutFeedback onPress={()=>{}}>
              <View  style={{width: width*0.8, backgroundColor:'#fff', borderRadius: 10}}>
                <View style={{padding: 8,borderTopLeftRadius:10, borderTopRightRadius: 10,backgroundColor: '#0451A5',justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 20, color: 'white'}}>
                    {texts.cartTitle}
                  </Text>
                </View>
                <View style={{height: height*0.5}}>
                  {props.cartItems.length>0?
                    <View style={{flex:1}}>
                      <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{flex:1}} onStartShouldSetResponder={()=>true}>
                          {
                            props.cartItems.map((item, index)=>{
                              cartTotal += (item.quantity*item.price)*props.measurement;
                              return <CartItem
                                  rate={item.price}
                                  showDetail={(product)=>{props.showDetail(product)}}
                                  isRTL={isRTL}
                                  text={props.text}
                                  price={(item.quantity*item.price)*props.measurement}
                                  quantity={item.quantity}
                                  key={index}
                                  onRemove={()=>props.removeItem(item.quantity,index)}
                                  name={props.brands[item.brand].name}
                                  pattern={props.brands[item.brand].patterns[item.pattern].path}
                                  color={props.brands[item.brand].patterns[item.pattern].colors[item.color].path}/>
                            })
                          }
                        </View>
                      </ScrollView>
                      <View style={{
                        borderWidth:1,
                        borderColor:'rgba(4,90,225,0.35)',
                        maxHeight:(isIos?undefined:5),
                        backgroundColor: 'rgba(4,92,255,0.35)',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding:(isIos?0:10)}}>
                        {!isRTL && <Text style={{fontSize: 15, color: '#fff', alignSelf: 'center'}}>{texts.measureText}</Text>}
                        <Text style={{fontSize: 15, color: '#fff', alignSelf: 'center'}}> {props.measurement} {texts.meters}</Text>
                        {isRTL && <Text style={{fontSize: 15, color: '#fff', alignSelf: 'center'}}>{texts.measureText}</Text>}
                      </View>
                        <View style={{
                            borderTopColor: 'rgba(255,255,255,0)',
                          borderBottomColor: '#fff', borderLeftColor: '#fff', borderRightColor: '#fff',
                            borderWidth:2,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding:10}}>
                            <Text style={{fontSize: 20, color: '#0451A5', alignSelf: 'center'}}>{texts.cartTotal} {cartTotal} {texts.kd}</Text>
                        </View>
                        <TouchableOpacity onPress={props.checkout}>
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
// const ProductDetail = (props) => {
//   return(
//       <Modal
//           style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%) !important'}}
//           animationType='fade'
//           transparent={true}
//           onRequestClose={()=>props.close()}
//           visible={props.visible}>
//         <TouchableWithoutFeedback onPress={()=>props.close()}>
//           <View style={{flex:1 ,alignItems: 'center', justifyContent: 'center', backgroundColor:'#00000069'}}>
//             <TouchableWithoutFeedback onPress={()=>{}}>
//               <View  style={{width: width*0.8, backgroundColor:'#fff', borderRadius: 10}}>
//                 <View style={{padding: 8,borderTopLeftRadius:10, borderTopRightRadius: 10,backgroundColor: '#0451A5',justifyContent: 'center', alignItems: 'center'}}>
//                   <Text style={{fontSize: 20, color: 'white'}}>{props.title}</Text>
//                 </View>
//                 <View style={{alignItems: 'center', padding: 10}}>
//                   {props.product &&
//                     <Image source={{uri: props.product}}
//                            style={{height: height*0.3, width: width*0.6}}/>
//                   }
//                 </View>
//                 <View>
//                   <Text style={{fontSize: 20, alignSelf: 'center', fontWeight: 'bold'}}>Toyobo</Text>
//                   <View style={{flexDirection: 'row', justifyContent: 'center'}}>
//                     <Text style={{fontSize: 20, fontWeight: 'bold'}}>Your Measurement:</Text><Text style={{fontSize: 18}}> 3.5 meters</Text>
//                   </View>
//                   <View style={{flexDirection: 'row', justifyContent: 'center'}}>
//                     <Text style={{fontSize: 20, fontWeight: 'bold'}}>Rate :</Text><Text style={{fontSize: 18}}> 3 KD per meter</Text>
//                   </View>
//                   <View style={{flexDirection: 'row', justifyContent: 'center'}}>
//                     <Text style={{fontSize: 20, fontWeight: 'bold'}}>Final Price :</Text><Text style={{fontSize: 18}}>{`${3.5*3} KD per meter`}</Text>
//                   </View>
//
//                 </View>
//                 <TouchableOpacity onPress={()=>props.close()}>
//                   <View style={{ backgroundColor: '#0451A5', alignItems: 'center', justifyContent: 'center', padding:10, borderBottomLeftRadius:10, borderBottomRightRadius: 10}}>
//                     <Text style={{fontSize: 20, color: 'white'}}>{props.ok?"OK":"OK"}</Text>
//                   </View>
//                 </TouchableOpacity>
//               </View>
//             </TouchableWithoutFeedback>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//   )
// }
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

const CartItem = (props) =>{
    texts = props.text;
    var isRTL = props.isRTL;
    return (
        <View style={{borderColor: '#0451A5', borderWidth: 1, padding: 0, flexDirection: 'row'}}>
          {!isRTL?
            <View style={{flexDirection: 'row', width:'70%'}}>
              <View style={{ flex: 2, padding : 10}}>
                <Image style={{width: 80, height: 80,resizeMode: 'contain', flex: 1}} source={{uri: props.color}}/>
              </View>
              <View style={{flex:2}}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>{props.name}</Text>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>{texts.rateLabel} {props.rate} {texts.kdPerMeter}</Text>
                {/*<Text style={{fontSize: 15, fontWeight: 'bold'}}>{texts.cartQuantity} {props.quantity}</Text>*/}
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>{texts.cartPrice} {props.price}</Text>
                {/*<Text style={{fontSize: 20, fontWeight: 'bold'}}>Color: {props.color}</Text>*/}
              </View>
            </View>:null}
          <View style={{alignSelf: 'flex-end',width:'30%', padding: 5}}>
            {/*<TouchableOpacity onPress={() => props.showDetail(props.color)}>*/}
            {/*  <View style={{flex: 1, backgroundColor: '#0451A5', width: 90, height: 30,*/}
            {/*    alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginBottom:10}}>*/}
            {/*    <Text style={{fontSize: 20, color: 'white'}}>Details</Text>*/}
            {/*  </View>*/}
            {/*</TouchableOpacity>*/}
            <TouchableOpacity onPress={() => props.onRemove()}>
              <View style={{flex: 1, backgroundColor: '#0451A5',padding:5,
                alignItems: 'center', justifyContent: 'center', borderRadius: 10}}>
                <Text style={{fontSize: 15, color: 'white'}}>{texts.cartRemove}</Text>
              </View>
            </TouchableOpacity>
          </View>
          {isRTL?
              <View style={{flexDirection: 'row', width:'70%'}}>
                <View style={{flex: 2}}>
                  <Text style={{fontSize: 20,textAlign:'right', fontWeight: 'bold'}}>{props.name}</Text>
                  <Text style={{fontSize: 15,textAlign:'right', fontWeight: 'bold'}}>{texts.rateLabel} {props.rate} {texts.kdPerMeter}</Text>
                  {/*<Text style={{fontSize: 15, fontWeight: 'bold'}}>{texts.cartQuantity} {props.quantity}</Text>*/}
                  <Text style={{fontSize: 15, textAlign:'right',fontWeight: 'bold'}}>{texts.cartPrice} {props.price}</Text>
                  {/*<Text style={{fontSize: 20, fontWeight: 'bold'}}>Color: {props.color}</Text>*/}
                </View>
                <View style={{ padding:10}}>
                  <Image style={{width: 80, height: 80,flex:1,resizeMode: 'contain'}} source={{uri: props.color}}/>
                </View>
              </View>:null}
        </View>
    )
}


// updateQuantity(type, quantity){
//   var total = this.state.noOfPieces;
//   var home = this.state.inHomeCount;
//   var out  = this.state.outsideCount;
//   // if(!(home+quantity<0  out+quantity<0)){
//   if(type==='home'){
//     if(home+quantity>=0){
//       if(home+quantity<=total){
//         var  i = quantity+home;
//         var p = total-(quantity+home);
//         this.setState({inHomeCount: quantity+home});
//         this.setState({outsideCount: total-(quantity+home)});
//       }
//       else{alert("In home count value cannot exceed total no of dishdashas!");}}
//   }
//   else if(type==='outside'){
//     if(out+quantity>=0){
//       if(out+quantity<=total){
//         i = quantity+out;
//         p = total-(quantity+out);
//         this.setState({outsideCount: quantity+out});
//         this.setState({inHomeCount: total-(quantity+out)});
//       }
//       else{alert("Outside count value cannot exceed total no of dishdashas!");}}
//   }
//   // }
// }
//
// selectFabricType = (fabric) => {
//   this.setState({selectedFabricType: this.fabricTypes[fabric]});
// }

// proceed(){
//   brand = this.state.brands[this.state.selectedBrand];
//   pattern = brand.patterns[this.state.selectedPattern];
//   color = pattern.colors[this.state.selectedColors];
//   const fabricType = fabric.types[fabric.selected.type];
//   const fabricColor = fabric.colors[fabric.selected.color];
//   const fabricPattern = fabric.patterns[fabric.selected.pattern];
//   // console.warn("Options: ", type, color, pattern);
//   this.props.navigation.navigate('delivery', {fabricType, fabricColor, fabricPattern})
// }
