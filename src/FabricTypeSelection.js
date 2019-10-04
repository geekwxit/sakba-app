import React, { Component } from 'react';
import { View, Alert, Text, Image, Dimensions,TouchableWithoutFeedback, ActivityIndicator, Modal, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Form, Item, Input, Container, Content, Button, Radio, Textarea } from 'native-base';
import renderIf from 'render-if';
import axios from 'axios';
import RadioGroup from './components/RadioGroupCustom';
import Brands from "./fabrics/brands/brands";
import Icon from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');
var fabric = {
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
var cart = [];

var selection = {
  pattern : 0, type    : 0, color   : 0
}


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
      isLoading: false,
      noOfPieces: this.props.navigation.getParam('noOfPieces', null),
      mobileNo: this.props.navigation.getParam('mobileNo', null),
      inHomeCount: this.props.navigation.getParam('inHomeCount', null),
      outsideCount: this.props.navigation.getParam('outsideCount', null),
      selectedFabricType: null,

      selectedBrand: 0,
      selectedPattern: 0,
      selectedColor: 0,
      patternOverlayHeight: 0,
      cartVisible: true,
      productBox: false
    };
    this.showCart = this.showCart.bind(this);
    this.props.navigation.setParams({showCart: this.showCart})
  }
  componentDidMount() {

  }

  showCart(){
    // cart.length>0?
        this.setState({cartVisible: true})
        // :alert("Cart is empty!");
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

  addToCart(){
    const {selectedPattern, selectedBrand, selectedColor} = this.state;
    const product = {pattern: selectedPattern,brand:  selectedBrand,color: selectedColor};
    cart.push(product);
    this.props.navigation.setParams({cartCount: cart.length});
    console.log(cart);
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
        <ScrollView>
          <ProductModal onAdd={()=>this.addToCart()} selected={{brand: Brands[this.state.selectedBrand].name, pattern: Brands[this.state.selectedBrand].patterns[this.state.selectedPattern].path, color: Brands[this.state.selectedBrand].patterns[this.state.selectedPattern].colors[this.state.selectedColor].code}} visible={this.state.productBox} close={()=>this.setState({productBox: false})}/>
          <CartModal close={()=>this.setState({cartVisible: false})} visible={this.state.cartVisible}/>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 50 }}>
            <Image style={{ width: 80, height: 80 }} source={require('../img/om.png')} />
          </View>
          <View style={{ flexDirection: 'column', marginHorizontal: 40 }}>
            <Text style={{marginTop:20, fontSize: 20, textAlign: 'center' }}>Select each product individually</Text>
            <View style={{ marginTop: 20, marginBottom: 10}}>
              <Text style={{ fontSize: 20, textAlign: 'center' }}>Choose fabric Brand: </Text>
            </View>

            <View>
              <RadioGroup
                data={Brands}
                isImage={false}
                selected={this.state.selectedBrand}
                onSelect={(index)=>{this.setState({selectedBrand:index, selectedColor: 0, selectedPattern: 0})}}
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
                  data={Brands[this.state.selectedBrand].patterns}
                  isImage={true}
                  selected={this.state.selectedPattern}
                  onSelect={(index)=>{this.setState({selectedPattern: index, selectedColor: 0})}}
              />
            </View>

            <View style={{ marginTop: 50, marginBottom: 10}}>
              <Text style={{ fontSize: 20, textAlign: 'center' }}>Choose fabric color </Text>
            </View>

            <View>
              <RadioGroup
                  data={(Brands[this.state.selectedBrand]).patterns[this.state.selectedPattern].colors}
                  isImage={false}
                  isColor={true}
                  selected={this.state.selectedColor}
                  onSelect={(index)=>{this.setState({selectedColor: index})}}
              />
            </View>
            <View style={{ marginTop: 20, marginBottom: 30, flexDirection: 'row', justifyContent: 'center' }}>
              <Button
                  style={{ borderRadius: 15, borderWidth: 2, backgroundColor: '#0451A5', height: 40, width: width - 80, justifyContent: 'center' }}
                  onPress={() =>this.setState({productBox: true})}>
                <Text style={{ fontSize: 18, color: 'white' }}>ADD TO CART</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const ProductModal = (props) => {
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
                <Text style={{fontSize: 18}}>Fabric Pattern:</Text>
              </View>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <View style={{ alignItems : 'center', justifyContent: 'center', }}>
                  <Image style={{width: width*0.8, height: 200, resizeMode: 'contain',borderRadius: 10}} source={props.selected.pattern} />
                </View>
              </View>
              <View style={{padding: 10,flexDirection: 'row',marginTop:0, alignItems :'center'}}>
                <Text style={{fontSize: 18}}>Fabric Color:</Text>
                <View style={{marginLeft: 5,backgroundColor: props.selected.color, width: 100, height:20}}/>
              </View>
              <TouchableOpacity onPress={()=>props.onAdd()}>
                <View style={{backgroundColor: '#0451A5', alignItems: 'center', justifyContent: 'center', padding:10, borderBottomLeftRadius:10, borderBottomRightRadius: 10}}>
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
          //onShow={this.resetValues()}
      >
        <TouchableWithoutFeedback onPress={()=>props.close()}>
          <View style={{flex:1 ,alignItems: 'center', justifyContent: 'center', backgroundColor:'#00000069'}}>
            <TouchableWithoutFeedback>
              <View  style={{width: width*0.8, backgroundColor:'#fff', borderRadius: 10}}>
                <View style={{padding: 8,borderTopLeftRadius:10, borderTopRightRadius: 10,backgroundColor: '#0451A5',justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 20, color: 'white'}}>
                    Cart
                  </Text>
                </View>
                <View style={{height: height*0.5}}>
                <ScrollView>
                  <View style={{ borderColor: '#0451A5', borderWidth: 1, padding: 10}}>
                    <View style={{flexDirection: 'row', flex:2}}>
                      <View style={{height: 100, width: 100}}>
                        <Image style={{width: 80,resizeMode: 'contain', flex:1}} source={Brands[0].patterns[0].path} />
                      </View>
                      <View>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Toyoba</Text>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Color: Blue</Text>
                      </View>
                    </View>
                    <View style={{flex:2}}>

                    </View>
                  </View>
                  <View style={{ borderColor: '#0451A5', borderWidth: 1, padding: 10}}>
                    <View style={{flexDirection: 'row', flex:2}}>
                      <View style={{height: 100, width: 100}}>
                        <Image style={{width: 80,resizeMode: 'contain', flex:1}} source={Brands[0].patterns[0].path} />
                      </View>
                      <View>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Toyoba</Text>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Color: Blue</Text>
                      </View>
                    </View>
                    <View style={{flex:2}}>

                    </View>
                  </View>
                  <View style={{ borderColor: '#0451A5', borderWidth: 1, padding: 10}}>
                    <View style={{flexDirection: 'row', flex:2}}>
                      <View style={{height: 100, width: 100}}>
                        <Image style={{width: 80,resizeMode: 'contain', flex:1}} source={Brands[0].patterns[0].path} />
                      </View>
                      <View>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Toyoba</Text>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Color: Blue</Text>
                      </View>
                    </View>
                    <View style={{flex:2}}>

                    </View>
                  </View>
                  <View style={{ borderColor: '#0451A5', borderWidth: 1, padding: 10}}>
                    <View style={{flexDirection: 'row', flex:2}}>
                      <View style={{height: 100, width: 100}}>
                        <Image style={{width: 80,resizeMode: 'contain', flex:1}} source={Brands[0].patterns[0].path} />
                      </View>
                      <View>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Toyoba</Text>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Color: Blue</Text>
                      </View>
                    </View>
                    <View style={{flex:2}}>

                    </View>
                  </View>

                  <View style={{ borderColor: '#0451A5', borderWidth: 1, padding: 10}}>
                    <View style={{flexDirection: 'row', flex:2}}>
                      <View style={{height: 100, width: 100}}>
                        <Image style={{width: 80,resizeMode: 'contain', flex:1}} source={Brands[0].patterns[0].path} />
                      </View>
                      <View>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Toyoba</Text>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Color: Blue</Text>
                      </View>
                    </View>
                    <View style={{flex:2}}>

                    </View>
                  </View><View style={{ borderColor: '#0451A5', borderWidth: 1, padding: 10}}>
                  <View style={{flexDirection: 'row', flex:2}}>
                    <View style={{height: 100, width: 100}}>
                      <Image style={{width: 80,resizeMode: 'contain', flex:1}} source={Brands[0].patterns[0].path} />
                    </View>
                    <View>
                      <Text style={{fontSize: 20, fontWeight: 'bold'}}>Toyoba</Text>
                      <Text style={{fontSize: 20, fontWeight: 'bold'}}>Color: Blue</Text>
                    </View>
                  </View>
                  <View style={{flex:2}}>

                  </View>
                </View><View style={{ borderColor: '#0451A5', borderWidth: 1, padding: 10}}>
                  <View style={{flexDirection: 'row', flex:2}}>
                    <View style={{height: 100, width: 100}}>
                      <Image style={{width: 80,resizeMode: 'contain', flex:1}} source={Brands[0].patterns[0].path} />
                    </View>
                    <View>
                      <Text style={{fontSize: 20, fontWeight: 'bold'}}>Toyoba</Text>
                      <Text style={{fontSize: 20, fontWeight: 'bold'}}>Color: Blue</Text>
                    </View>
                  </View>
                  <View style={{flex:2}}>

                  </View>
                </View><View style={{ borderColor: '#0451A5', borderWidth: 1, padding: 10}}>
                  <View style={{flexDirection: 'row', flex:2}}>
                    <View style={{height: 100, width: 100}}>
                      <Image style={{width: 80,resizeMode: 'contain', flex:1}} source={Brands[0].patterns[0].path} />
                    </View>
                    <View>
                      <Text style={{fontSize: 20, fontWeight: 'bold'}}>Toyoba</Text>
                      <Text style={{fontSize: 20, fontWeight: 'bold'}}>Color: Blue</Text>
                    </View>
                  </View>
                  <View style={{flex:2}}>

                  </View>
                </View><View style={{ borderColor: '#0451A5', borderWidth: 1, padding: 10}}>
                  <View style={{flexDirection: 'row', flex:2}}>
                    <View style={{height: 100, width: 100}}>
                      <Image style={{width: 80,resizeMode: 'contain', flex:1}} source={Brands[0].patterns[0].path} />
                    </View>
                    <View>
                      <Text style={{fontSize: 20, fontWeight: 'bold'}}>Toyoba</Text>
                      <Text style={{fontSize: 20, fontWeight: 'bold'}}>Color: Blue</Text>
                    </View>
                  </View>
                  <View style={{flex:2}}>

                  </View>
                </View><View style={{ borderColor: '#0451A5', borderWidth: 1, padding: 10}}>
                  <View style={{flexDirection: 'row', flex:2}}>
                    <View style={{height: 100, width: 100}}>
                      <Image style={{width: 80,resizeMode: 'contain', flex:1}} source={Brands[0].patterns[0].path} />
                    </View>
                    <View>
                      <Text style={{fontSize: 20, fontWeight: 'bold'}}>Toyoba</Text>
                      <Text style={{fontSize: 20, fontWeight: 'bold'}}>Color: Blue</Text>
                    </View>
                  </View>
                  <View style={{flex:2}}>

                  </View>
                </View>
                  {cart.map((product,index)=>{
                    return(
                        <View key={index}>
                          <Text>{Brands[product.brand].name}</Text>
                        </View>
                    )
                  })}
                </ScrollView>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

  )
}
