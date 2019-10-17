import React, { Component } from 'react';
import { View, Alert, Text, Image, Dimensions,TouchableWithoutFeedback, ActivityIndicator, Modal, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Form, Item, Input, Container, Content, Button, Radio, Textarea } from 'native-base';
import renderIf from 'render-if';
import axios from 'axios';
import RadioGroup from './components/RadioGroupCustom';
// import Brands from "./fabrics/brands/brands";
import Icon from 'react-native-vector-icons/Ionicons';
import {fabricStrings} from "./Strings";

const { width, height } = Dimensions.get('window');
// var fabric = {
//   types     : ['Toyobo', 'Shikibo', 'Fine Gold',],
//   patterns  : [require('../img/patterns/pattern1.jpg'), require('../img/patterns/pattern2.jpg'),
//     require('../img/patterns/pattern3.jpg'), require('../img/patterns/pattern4.jpg'),require('../img/patterns/pattern2.jpg'),],
//   colors    : [
//       {name: 'Red', code: '#ff3d01'},
//     {name: 'White', code: '#ffffff'},
//     {name: 'Green', code: '#148500'},
//     {name: 'Purple', code: '#f99bff'},
//     {name: 'Cream', code: '#fad0a7'}],
//   selected : {pattern : 0, type    : 0, color   : 0},
// }

var selection = {
  pattern : 0, type    : 0, color   : 0
}

// var Brands = [];


export default class FabricTypeSelection extends Component<Props>{

  static navigationOptions = ({ navigation }) => {
    const cartCount = navigation.state.params.cartCount?navigation.state.params.cartCount:null;
    return {
      headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 },
      headerTintColor: '#fff',
      title: 'Select Fabric Options',
      headerRight: (
          <View style={{marginRight: 10}}>
          <TouchableOpacity onPress={()=>navigation.state.params.showCart?navigation.state.params.showCart():alert("Something went wrong")}>
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
    //console.log("SOMEBRANDS: ", JSON.stringify(Brands));
    this.state = {
      isLoading: true,
      noOfPieces: this.props.navigation.getParam('noOfPieces', null),
      mobileNo: this.props.navigation.getParam('mobileNo', null),
      inHomeCount: this.props.navigation.getParam('inHomeCount', null),
      outsideCount: this.props.navigation.getParam('outsideCount', null),
      selectedFabricType: null,

      selectedBrand: 0,
      selectedPattern: 0,
      selectedColor: 0,
      patternOverlayHeight: 0,
      cartVisible: false,
      productBox: false,
      brands: null,
      cart : [
        // {brand : 0, pattern    : 0, color   : 0},
        // {brand : 2, pattern    : 2, color   : 1},
        // {brand : 1, pattern    : 3, color   : 1},
        // {brand : 2, pattern    : 1, color   : 3},
        // {brand : 2, pattern    : 0, color   : 0},
      ],
      totalCartItems: 0,
      selectionChanged: false,
      changeType: null
    };
    this.showCart = this.showCart.bind(this);
    this.props.navigation.setParams({showCart: this.showCart})
  }
  componentDidMount() {
    this.getAllFabrics();
  }

  async getAllFabrics(){
    await axios.get(fabricStrings.getAllFabrics)
        .then(response=>response.data)
        .then(response=>{
          // response.brands[0].patterns.splice(0,1);
          // debugger;
            this.setState({brands: response.brands})
        })
        .then(()=>this.setState({isLoading:false}))
        .catch(error=>alert("Something went wrong!"))
    // console.log(Brands);
  }

  showCart(){
    // cart.length>0?
        this.setState({cartVisible: true})
        // :alert("Cart is empty!");
  }

  updateQuantity(type, quantity){
    var total = this.state.noOfPieces;
    var home = this.state.inHomeCount;
    var out  = this.state.outsideCount;
    // if(!(home+quantity<0  out+quantity<0)){
      if(type==='home'){
        if(home+quantity>=0){
        if(home+quantity<=total){
          var  i = quantity+home;
          var p = total-(quantity+home);
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

  addToCart(){
    this.setState({productBox:false});
    var productFound = false;
    const {selectedPattern, selectedBrand, selectedColor} = this.state;
    const product = {pattern: selectedPattern,brand:  selectedBrand,color: selectedColor, quantity: 1};
    this.state.cart.map((item,index)=>{
      if(item.brand==product.brand && item.pattern==product.pattern && item.color==product.color){
        item.quantity = item.quantity+1;
        productFound = true;
        setTimeout(()=>alert("Product quantity increased!"), 500);
      }
    })
    !productFound?this.setState({cart : [...this.state.cart, product]}):null;
    !productFound?this.props.navigation.setParams({cartCount: this.state.cart.length+1}):null;
    total = parseInt(this.state.totalCartItems)+1;
    this.setState({totalCartItems: total});
    !productFound?setTimeout(()=>alert("Product successfully added to your cart"), 500):null;
  }

  removeFromCart(quantity, index){
    // alert("Item is brand: "+ cart[item]);
    tempCart = this.state.cart;
    tempCart.splice(index,1);
    this.setState({
      cart: tempCart,
      totalCartItems: this.state.totalCartItems - quantity,
    });
    this.props.navigation.setParams({cartCount: this.state.cart.length});
  }

  doCheckout(){
    //alert("Something went wrong!");
    const inHomeCount = this.state.inHomeCount;
    const outsideCount= this.state.outsideCount;
    const mobileNo    = this.props.navigation.getParam('mobileNo', null);
    const customerName= this.props.navigation.getParam('customerName', null);
    const cart = this.state.cart;
    this.state.totalCartItems>inHomeCount?alert('Items on cart are more than selected in-home dishdashas i.e.' + inHomeCount +' . Please remove some items.'):
        this.state.totalCartItems<inHomeCount?alert('Items on cart are less than selected in-home dishdashas i.e.' + inHomeCount +' . Please add some items.'):
            this.state.totalCartItems==inHomeCount?
                this.props.navigation.navigate('delivery',
                    {inHomeCount, outsideCount, mobileNo, customerName, fabrics: this.state.brands, cart}):
                alert("Something went wrong");
  }

  selectionChanged(type){
    this.setState({selectionChanged: true, changedType: type})
    setTimeout(()=>this.temp(), 1000);
  }

  temp(){
    this.setState({selectionChanged: false, changedType: null});
  }
  render() {

    Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;


    const { deliveryOption, deliveryOptionPickUpFormStore } = this.state
    console.log(this.state);

    var parentHeight = null;
    const sizeCtrl = {width: 40, height: 40}
    // debugger
    return (
      <SafeAreaView>
        {this.state.isLoading?<View style={{alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator style={{top: height*0.4}}  color={'#0451A5'} size={'large'} animating={true}/>
        </View>:
        <ScrollView>
          <ProductModal brands={this.state.brands} onAdd={()=>this.addToCart()} selected={{brand: this.state.brands?this.state.brands[this.state.selectedBrand].name:null, pattern: this.state.brands?this.state.brands[this.state.selectedBrand].patterns[this.state.selectedPattern].path:null, color: this.state.brands?this.state.brands[this.state.selectedBrand].patterns[this.state.selectedPattern].colors[this.state.selectedColor].path:null}} visible={this.state.productBox} close={()=>this.setState({productBox: false})}/>
          <CartModal brands={this.state.brands} removeItem={(quantity, index)=>this.removeFromCart(quantity, index)} close={()=>this.setState({cartVisible: false})} visible={this.state.cartVisible} cartItems={this.state.cart}/>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 50}}>
            <Image style={{ width: 80, height: 80 }} source={require('../img/om.png')} />
          </View>
          {this.state.brands?this.state.brands.length?
            <View style={{ flexDirection: 'column', marginHorizontal: 40 }}>
            <Text style={{marginTop:20, fontSize: 20, textAlign: 'center' }}>Select each product individually</Text>
            <View style={{ marginTop: 20, marginBottom: 10}}>
              <Text style={{ fontSize: 20, textAlign: 'center' }}>Choose fabric Brand: </Text>
            </View>

            <View>
              <RadioGroup
                data={this.state.brands}
                type={'brand'}
                isImage={false}
                selected={this.state.selectedBrand}
                onSelect={(index)=>{this.setState({selectedBrand:index, selectedColor: 0, selectedPattern: 0}); this.selectionChanged('brand')}}
              />
            </View>

            <View style={{ marginTop: 50, marginBottom: 10}}>
              <Text style={{ fontSize: 20, textAlign: 'center' }}>Choose fabric pattern </Text>
            </View>

            <View>
              {/*<TouchableWithoutFeedback onPress={()=>alert("Please select a brand first!")}>*/}
              {/*  <View style={{ alignSelf: 'center', zIndex:10,height: this.state.patternOverlayHeight, width:width-50 , position: 'absolute', backgroundColor: 'rgba(255,255,255,0.85)'}}/>*/}
              {/*</TouchableWithoutFeedback>*/}
              <RadioGroup
                  data={this.state.brands[this.state.selectedBrand].patterns}
                  type={'pattern'}
                  isImage={true}
                  selected={this.state.selectedPattern}
                  onSelect={(index)=>{this.setState({selectedPattern: index, selectedColor: 0})}}
                  isSelectionChanged={this.state.selectionChanged}
                  changeType={this.state.changeType}
              />
            </View>

            <View style={{ marginTop: 50, marginBottom: 10}}>
              <Text style={{ fontSize: 20, textAlign: 'center' }}>Choose fabric color </Text>
            </View>

            <View>
              <RadioGroup
                  data={(this.state.brands[this.state.selectedBrand]).patterns[this.state.selectedPattern].colors}
                  type={'color'}
                  isImage={true}
                  isColor={false}
                  selected={this.state.selectedColor}
                  onSelect={(index)=>{this.setState({selectedColor: index})}}
                  changeType={this.state.changedType}
              />
            </View>
            <View style={{ marginTop: 20, marginBottom: 20, flexDirection: 'row', justifyContent: 'center' }}>
              <Button
                  style={{ borderRadius: 15, borderWidth: 2, backgroundColor: '#0451A5', height: 40, width: width - 80, justifyContent: 'center' }}
                  onPress={() =>this.setState({productBox: true})}>
                <Text style={{ fontSize: 18, color: 'white' }}>ADD TO CART</Text>
              </Button>
            </View>
            <View style={{ marginBottom: 30, flexDirection: 'row', justifyContent: 'center' }}>
              <Button
                  style={{ borderRadius: 15, borderWidth: 2, backgroundColor: '#0451A5', height: 40, width: width - 80, justifyContent: 'center' }}
                  onPress={() =>this.doCheckout()}>
                <Text style={{ fontSize: 18, color: 'white' }}>CHECKOUT</Text>
              </Button>
            </View>
          </View>
          :
          <View>
              </View>:null
          }
        </ScrollView>}
      </SafeAreaView>
    );
  }
}

const ProductModal = (props) => {
  isColorAnImage = true;
  return(
      <Modal
          style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%) !important'}}
          animationType='fade'
          transparent={true}
          onRequestClose={()=>props.close()}
          visible={props.visible}
          //onShow={this.resetValues()}
      >
        <TouchableWithoutFeedback onPress={()=>props.close()}>
          <View style={{flex:1 ,alignItems: 'center', justifyContent: 'center', backgroundColor:'#00000069'}}>
            <TouchableWithoutFeedback>
            <View  style={{width: width*0.8, backgroundColor:'#fff', borderRadius: 10}}>
              <View style={{padding: 8,borderTopLeftRadius:10, borderTopRightRadius: 10,backgroundColor: '#0451A5',justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 20, color: 'white'}}>
                  Selected Product
                </Text>
              </View>
              <View style={{padding: 10}}>
              <Text style={{fontSize: 18}}>Fabric Brand: {props.selected.brand}</Text>
                <Text style={{fontSize: 18}}>Fabric Pattern and Color:</Text>
              </View>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <View style={{ alignItems : 'center', justifyContent: 'center', }}>
                  <Image style={{width: width*0.8, height: 200, resizeMode: 'contain',borderRadius: 10}} source={{uri: props.selected.color}} />
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
              <TouchableOpacity onPress={()=>props.onAdd()}>
                <View style={{ backgroundColor: '#0451A5', alignItems: 'center', justifyContent: 'center', padding:10, borderBottomLeftRadius:10, borderBottomRightRadius: 10}}>
                  <Text style={{fontSize: 20, color: 'white'}}>Add to Cart</Text>
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
  return(
      <Modal
          style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%) !important'}}
          animationType='fade'
          transparent={true}
          onRequestClose={()=>props.close()}
          visible={props.visible}
          // onShow={()=>console.log("CAAART", cart)}
      >
        <TouchableWithoutFeedback onPress={()=>props.close()}>
          <View style={{flex:1 ,alignItems: 'center', justifyContent: 'center', backgroundColor:'#00000069'}}>
            <TouchableWithoutFeedback onPress={()=>{}}>
              <View  style={{width: width*0.8, backgroundColor:'#fff', borderRadius: 10}}>
                <View style={{padding: 8,borderTopLeftRadius:10, borderTopRightRadius: 10,backgroundColor: '#0451A5',justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 20, color: 'white'}}>
                    Cart
                  </Text>
                </View>
                <View style={{height: height*0.5}}>
                  {props.cartItems.length>0?
                    <ScrollView showsVerticalScrollIndicator={false}>
                    <View onStartShouldSetResponder={()=>true}>
                      {
                        props.cartItems.map((item, index)=>{
                          return <CartItem quantity={item.quantity} key={index} onRemove={()=>props.removeItem(item.quantity,index)} name={props.brands[item.brand].name} pattern={props.brands[item.brand].patterns[item.pattern].path} color={props.brands[item.brand].patterns[item.pattern].colors[item.color].path}/>
                        })
                      }
                    </View>
                  </ScrollView>:
                  <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: 'grey', fontSize: 20}}>Cart is empty!</Text>
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

const CartItem = (props) =>{
    return (
        <View style={{borderColor: '#0451A5', borderWidth: 1, padding: 0, flexDirection: 'row'}}>
          {/*<View style={{flex: 2}}>*/}
            <View style={{flex:2, flexDirection: 'row', width: 400}}>
              <View style={{ flex: 2, padding : 10}}>
                <Image style={{width: 80, height: 80,resizeMode: 'contain', flex: 1}} source={{uri: props.color}}/>
              </View>
              <View style={{flex: 2}}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>{props.name}</Text>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>Quantity: {props.quantity}</Text>
                {/*<Text style={{fontSize: 20, fontWeight: 'bold'}}>Color: {props.color}</Text>*/}
              </View>
            </View>
          {/*</View>*/}
          <View style={{flex: 1, alignSelf: 'flex-end', padding: 10, marginLeft: 10}}>
            <TouchableOpacity onPress={() => props.onRemove()}>
              <View style={{flex: 1, backgroundColor: '#0451A5', width: 90, height: 30,
                alignItems: 'center', justifyContent: 'center', borderRadius: 10}}>
                <Text style={{fontSize: 20, color: 'white'}}>Remove</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
    )
}
