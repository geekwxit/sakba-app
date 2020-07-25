import React, { Component } from 'react';
import { View, Alert, Text, Image,Platform, Dimensions,TouchableWithoutFeedback, ActivityIndicator, Modal, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import axios from './axios/AxiosInstance';
import {strings} from "../locales/Language";
import Icon from 'react-native-vector-icons/Ionicons';
import FabricsScreen from "./FabricsScreen";
import ProductsScreen from "./ProductsScreen";
import Store from "./CommonStore/Store";
import CartModal from "./components/CartModal";
import {Button} from "native-base";

const isIos = Platform.OS == 'ios';

const { width, height } = Dimensions.get('window');

export default class FabricsAndProducts extends Component<Props>{

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
    super(props);
    this.state = {
      promo_success: undefined,showPromo: false,promo:'', discount:0,
      measurement: this.props.navigation.getParam('measurement', 0), isLoading: true,
      language: props.navigation.getParam('language'),
      noOfPieces: this.props.navigation.getParam('noOfPieces', null),
      mobileNo: this.props.navigation.getParam('mobileNo', null),
      inHomeCount: this.props.navigation.getParam('inHomeCount', null),
      outsideCount: this.props.navigation.getParam('outsideCount', null),
      isCountNeeded: this.props.navigation.getParam('isCountNeeded', true),
      fabricsEnabled: this.props.navigation.getParam('fabricsEnabled', true),
      selectedFabricType: null,
      selectedBrand: 0, selectedPattern: 0, selectedColor: 0,
      patternOverlayHeight: 0, cartVisible: false, productBox: false,
      brands: [],
      cart : [],
      totalCartItems: 0,
      actualTotalCartItems: 0,
      selectionChanged: false, changeType: null,
      shouldBrandShow: true, shouldPatternShow: true,shouldColorShow: true,
       colorLoader: false,
      fabricPreview: false, previewTitle: 'Preview', previewPath: null,

      productDetail: null, productDetailVisible: false, activeTabIndex:0,
      tabHead: [
          {name: 'Fabrics', active: false, enabled: true},
        {name: 'Products', active: false, enabled:true}
        ]
    };
    this.showCart = this.showCart.bind(this);
    this.doCheckout = this.doCheckout.bind(this);
    this.props.navigation.setParams({showCart: this.showCart})
  }
  componentDidMount() {
    let shopTitle = this.props.navigation.getParam('shopTitle', '');
    let fabricsLabel = this.props.navigation.getParam('fabricsLabel', '');
    let productsLabel = this.props.navigation.getParam('productsLabel', '');
    let fabricsEnabled = this.props.navigation.getParam('fabricsEnabled', true)
    let productsEnabled = this.props.navigation.getParam('productsEnabled', true)
    const Tabs = this.state.tabHead;
    Tabs[0].enabled = fabricsEnabled;
    Tabs[0].name = fabricsLabel;
    Tabs[1].name = productsLabel;
    Tabs[1].enabled = productsEnabled;
    Tabs[0].active = (fabricsEnabled && productsEnabled)?true:fabricsEnabled;
    Tabs[1].active = (fabricsEnabled && productsEnabled)?false:productsEnabled;
    this.setState({
      language: this.props.navigation.getParam('language'),
      measurement: this.props.navigation.getParam('measurement', 0),
      tabHead: Tabs,activeTabIndex:fabricsEnabled?0:1,
      fabricsEnabled: fabricsEnabled
    });
    this.props.navigation.setParams({title: shopTitle, error: this.state.language.fabricScreen.commonError});
    this.getData();
  }

  async getData(){
    this.setState({brands: await Store.getFabrics(),
      products: await Store.getProducts()});
  }

  showCart(){
    this.setState({cartVisible: true})
  }

  updateQuantity(index, amount){
    var cart2 = Object.assign([], this.state.cart);
    var product  = cart2[index];
    product.quantity += amount;
    var finalCart = [...(cart2.splice(0, index)), product,...(cart2.splice(1, cart2.length))];
    this.setState(prev=>({cart: finalCart, actualTotalCartItems: prev.actualTotalCartItems+amount}));
  }

  removeFromCart(quantity, index){
    tempCart = this.state.cart;
    actualQuantity  = tempCart[index].quantity;
    tempCart.splice(index,1);
    this.setState({
      cart: tempCart,
      totalCartItems: this.state.totalCartItems - quantity,
      actualTotalCartItems: this.state.actualTotalCartItems - actualQuantity
    });
    this.props.navigation.setParams({cartCount: this.state.cart.length});
  }

  doCheckout(){
    // var screen = this.state.language.fabricScreen;
    const {inHomeCount, outsideCount, isCountNeeded, noOfPieces, language:{fabricScreen: screen}} = this.state;
    const mustBuyProduct = this.props.navigation.getParam('mustBuyProduct', null);
    const mobileNo    = this.props.navigation.getParam('mobileNo', null);
    const customerName= this.props.navigation.getParam('customerName', null);
    const cart        = this.state.cart;
    let params = {
      language: this.state.language, inHomeCount, outsideCount, mobileNo, noOfPieces,
      customerName, fabrics: this.state.brands, cart,
      measurementDone: this.props.navigation.getParam('measurementDone'),
      measurement: this.state.measurement, isCountNeeded: isCountNeeded,
    };

    this.setState({cartVisible : false});
    let fabricsActualCount = 0;
    cart.forEach(item=>fabricsActualCount+=(item.isFabric==true)?item.quantity:0);
    if(mustBuyProduct!=null){
      if((cart.length>0 && mustBuyProduct) || !mustBuyProduct){
        if(inHomeCount>0){
          params.noOfPieces = this.state.noOfPieces;
          fabricsActualCount>inHomeCount?
              this.safeAlert(this.state.language.commonFields.alertTitle, screen.moreThan(inHomeCount), [{text: this.state.language.commonFields.okButton}]):
              fabricsActualCount<inHomeCount?this.safeAlert(this.state.language.commonFields.alertTitle, screen.lessThan(inHomeCount), [{text: this.state.language.commonFields.okButton}]):
                  fabricsActualCount==inHomeCount?
                      this.props.navigation.navigate('delivery',params):
                      this.safeAlert(this.state.language.commonFields.alertTitle, screen.commonError, [{text: this.state.language.commonFields.okButton}])
        } else {
          // params.noOfPieces = 0;
          this.props.navigation.navigate('delivery', params)
        }
      } else {
        Alert.alert(this.state.language.commonFields.alertTitle, this.state.language.fabricScreen.cartEmpty, [{text: this.state.language.commonFields.okButton}])
      }
    } else {
      Alert.alert(this.state.language.commonFields.alertTitle, this.state.language.fabricScreen.commonError, [{text: this.state.language.commonFields.okButton}]);
    }
  }

  safeAlert(title, message, buttons){
    isIos?setTimeout(()=>Alert.alert(title, message, buttons),500):Alert.alert(title, message, buttons);
  }

  selectionChanged(type){
    this.setState({selectionChanged: true, changedType: type})
    setTimeout(()=>this.temp(), 1000);
  }

  temp(){
    this.setState({selectionChanged: false, changedType: null});
  }

  onChangeTab(activeTabIndex){
    this.getData();
    const Tabs = this.state.tabHead.map(t=>{
      t.active = false;
      return t;
    });
    Tabs[activeTabIndex].active = true
    this.setState({
      tabHead:Tabs, activeTabIndex
    })
  }

  addToCart(product){
    this.setState({cart : [...this.state.cart, product]});
    this.props.navigation.setParams({cartCount: this.state.cart.length+1});
    total = parseInt(this.state.totalCartItems)+1;
    this.setState(prev=>({totalCartItems: total, actualTotalCartItems: prev.actualTotalCartItems+1}));
    Alert.alert(strings.commonFields.alertTitle, strings.fabricScreen.addedToCart, [{text: strings.commonFields.okButton}]);
  }

  render() {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    const { deliveryOption, deliveryOptionPickUpFormStore } = this.state;
    console.log(this.state);
    console.log("discount",this.state.discount);
    var screen = this.state.language.fabricScreen;
    var parentHeight = null;
    const isRTL = this.state.language.isRTL;
    const sizeCtrl = {width: 40, height: 40}
    return (
      <SafeAreaView style={{flex:1}}>
        <CartModal
            onlyProducts={!this.state.fabricsEnabled}
            // discountAmount={parseFloat(this.state.discount)}
            // promoSuccess={this.state.promo_success}
            // showPromo={()=>{this.setState({showPromo: true})}}
            // applyPromo={()=>{this.applyPromo()}}
            // setPromo={(promo)=>this.setState({promo})}
            // shouldShowPromo={this.state.showPromo}
            isCountNeeded={this.state.isCountNeeded}
            fabricsEnabled={this.state.fabricsEnabled}
            measurement={this.state.measurement}
            isRTL={this.state.language.isRTL}
            text={screen}
            checkout={this.doCheckout}
            brands={this.state.brands}
            removeItem={(quantity, index)=>this.removeFromCart(quantity, index)}
            updateQuantity={(index, amount)=>this.updateQuantity(index, amount)}
            close={()=>this.setState({cartVisible: false})}
            visible={this.state.cartVisible}
            cartItems={this.state.cart}/>
        <FabricPreview ok={screen.previewOKButton} title={this.state.previewTitle} source={this.previewPath} close={()=>this.setState({fabricPreview: false})} visible={this.state.fabricPreview}/>
        <TabbedView
            screen={screen}
          style={{marginTop:10,alignSelf:'center',  width:'95%'}}
          tabHead={this.state.tabHead}
          onChangeTab={(activeTabIndex)=>this.onChangeTab(activeTabIndex)}
          activeTabIndex={this.state.activeTabIndex}
          children={[
            <FabricsScreen showCart={()=>this.showCart()} language={this.state.language} screen={screen} main={this} />,
            <ProductsScreen screen={screen} main={this} isRTL={isRTL}/>
          ]}
          checkout={this.doCheckout}
        >
        </TabbedView>
      </SafeAreaView>
    );
  }
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

const TabbedView=({screen, style, children, activeTabIndex, tabHead, onChangeTab, checkout})=>(
    <View style={[{flex:1},style]}>
      <View style={{width:'100%', flexDirection:'row', justifyContent:'space-evenly'}}>
        {
          tabHead.map((tab, i)=><Tab enabled={tab.enabled} onPress={()=>onChangeTab(i)} active={tab.active} tabname={tab.name} tabbgcolor={!tab.enabled?'rgba(95,95,95,0.69)':'#0451A5'} tabcolor={'#fff'}/>)
        }
      </View>
      <View style={{flex:1}}>
        {children[activeTabIndex]}
      </View>
      <View style={{marginVertical:10,flexDirection: 'row', justifyContent: 'center' }}>
        <Button
            style={{ borderRadius: 15, height:30,  borderWidth: 2, backgroundColor: '#0451A5', width: width*0.8, justifyContent: 'center' }}
            onPress={checkout}>
          <Text style={{ fontSize: 18, color: 'white' }}>{screen.checkoutButton}</Text>
        </Button>
      </View>
    </View>
)

const Tab=({tabname, tabbgcolor, tabcolor, active, onPress, enabled})=>(
    <TouchableOpacity onPress={()=>onPress()} disabled={active || !enabled} style={{borderColor:tabbgcolor,
      borderWidth:1,flex:1, borderBottomWidth:0,borderTopLeftRadius:20,
      borderTopRightRadius:20, padding:10, justifyContent:'center',
      backgroundColor: active?tabcolor:tabbgcolor, alignItems:'center'}}>
        <Text style={{color: active?tabbgcolor:tabcolor, fontSize:15, fontWeight:'bold'}}>{tabname}</Text>
    </TouchableOpacity>
)