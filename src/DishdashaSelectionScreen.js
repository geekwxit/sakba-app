import  React, { Component } from 'react';
import { View, Text, Image, Dimensions, SafeAreaView,Alert, ScrollView, TouchableOpacity} from 'react-native';
import { Button,Icon} from 'native-base';
const { width, height } = Dimensions.get('window');

export default class DishdashaSelectionScreen extends Component<Props>{

  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 },
      headerTintColor: '#fff',
    };
  };
  constructor(props) {
    super(props)
    this.state = {
      language: props.navigation.getParam('language'),
      isLoading: false,
      pickupStore: null,
      sendFabric: true, homeDelivery: true,
      itemSelected: 'itemTwo', noOfPieces: 1,
      mobileNo: this.props.navigation.getParam('mobileNo', null),
      address: 2, response: [], msg: '',
      delivery_date: '',

      inHomeCount: 0, outsideCount: 1
    };
  }

  componentDidMount(){
    this.setState({language: this.props.navigation.getParam('language')});
  }

  minus() {
    if (this.state.noOfPieces > 1)
      this.setState({ noOfPieces: this.state.noOfPieces - 1, outsideCount:  this.state.noOfPieces - 1, inHomeCount: 0});
    else
      this.setState({ noOfPieces:1, inHomeCount:1, outsideCount:0});
  }
  plus() {
    this.setState({ noOfPieces: this.state.noOfPieces + 1, outsideCount:  this.state.noOfPieces + 1, inHomeCount: 0});
  }

  proceed(products_disabled = false){
    let {shopTitle, fabricsLabel, productsLabel} = this.state.language.fabricScreen;
      const inHomeCount = this.state.inHomeCount;
      const outsideCount= this.state.outsideCount;
      const mobileNo    = this.props.navigation.getParam('mobileNo', null);
      const customerName= this.props.navigation.getParam('customerName', null);
      let params = {
        measurement: this.props.navigation.getParam('measurement'),
        language: this.state.language, inHomeCount, outsideCount, mobileNo,
        customerName, noOfPieces: this.state.noOfPieces,
        productsEnabled: !products_disabled,
        shopTitle, fabricsLabel, productsLabel,
        fabricsEnabled: !(outsideCount==this.state.noOfPieces),
        measurementDone: this.props.navigation.getParam('measurementDone'),
      };
      console.log(
          "fabricsEnabled:", !(outsideCount==this.state.noOfPieces),
          "productsEnabled: ", !products_disabled
      )
      if(!products_disabled || !(outsideCount==this.state.noOfPieces)){
        this.props.navigation.navigate('fabrics_and_products', params)
      } else {
        this.props.navigation.navigate('delivery', params)
      }
    }

  updateQuantity(type, quantity){
    total = this.state.noOfPieces;
    home = this.state.inHomeCount;
    out  = this.state.outsideCount;
      if(type==='home'){
        if(home+quantity>=0){
        if(home+quantity<=total){
          i = quantity+home;
          p = total-(quantity+home);
          this.setState({inHomeCount: quantity+home});
          this.setState({outsideCount: total-(quantity+home)});
        }
        else{
          Alert.alert(this.state.language.commonFields.alertTitle, this.state.language.customerAgree.maxInHome, [{text: this.state.language.commonFields.okButton}]);
          // alert(this.state.language.customerAgree.maxInHome);
        }
        }
      }
      else if(type==='outside'){
        if(out+quantity>=0){
        if(out+quantity<=total){
          i = quantity+out;
          p = total-(quantity+out);
          this.setState({outsideCount: quantity+out});
          this.setState({inHomeCount: total-(quantity+out)});
        }
        else{
          Alert.alert(this.state.language.commonFields.alertTitle, this.state.language.customerAgree.maxOutside, [{text: this.state.language.commonFields.okButton}]);

          // alert(this.state.language.customerAgree.maxOutside);
        }}
      }
  }

  render() {
   var screen = this.props.screen?this.props.screen:this.state.language.customerAgree;
    Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

    const sizeCtrl = {width: 40, height: 40}
    return (
      <SafeAreaView style={{flex:1}}>
        <ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 50 }}>
            <Image style={{ width: 80, height: 80 }} source={require('../img/om.png')} />
          </View>
          <View style={{ flexDirection: 'column', marginHorizontal: 40 }}>
            <View style={{ marginTop: 50 }}>
              <Text style={{ fontSize: 20, textAlign: 'center' }}>{screen.dishdashaCount}</Text>
            </View>
            <View style={{ marginTop: 25, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button style={{ marginLeft: width / 6, backgroundColor: '#0451A5', width: 50, height: 40, justifyContent: 'center' }} onPress={() => this.minus()}>
                <Icon style={{ textAlign: 'center', color: 'white' }} name='md-remove' />
              </Button>
              <View style={{ height: 40, justifyContent: 'center' }}>
                <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 20, fontWeight: 'bold' }}>{this.state.noOfPieces}</Text>
              </View>
              <Button style={{ marginRight: width / 6, backgroundColor: '#0451A5', width: 50, height: 40, justifyContent: 'center' }} onPress={() => this.plus()}>
                <Icon style={{ textAlign: 'center', color: 'white' }} name='md-add' />
              </Button>
            </View>

            <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: 30}}>
              <View style={{justifyContent: 'center',  marginRight:10}}>
                <Text style={{alignSelf: 'center', fontWeight: 'bold', marginBottom: 5}}>{screen.outside}</Text>
                <View style={{flexDirection: 'row', borderColor: '#0451A5', borderWidth: 2}}>
                  <View style={{
                    borderRadius: 0, backgroundColor: '#0451A5', width: sizeCtrl.width,
                    height: sizeCtrl.height, alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity onPress={()=>this.updateQuantity('outside', -1)}>
                      <Icon style={{textAlign: 'center', color: 'white', fontSize: sizeCtrl.width/2}}
                            name='md-remove'/>
                    </TouchableOpacity>
                  </View>
                  <View style={{width: sizeCtrl.width+10, height: sizeCtrl.height, alignItems: 'center', justifyContent: 'center'}}>
                    <Text>{this.state.outsideCount}</Text>
                  </View>
                  <View style={{
                    borderRadius: 0, backgroundColor: '#0451A5', width: sizeCtrl.width,
                    height: sizeCtrl.height, alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity onPress={()=>this.updateQuantity('outside', 1)}>
                      <Icon size={10} style={{textAlign: 'center', color: 'white', fontSize: sizeCtrl.width/2}}
                            name='md-add'/>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={{justifyContent: 'center',  marginRight:10}}>
                <Text style={{alignSelf: 'center', fontWeight: 'bold', marginBottom: 5}}>{screen.inhome}</Text>
                <View style={{flexDirection: 'row', borderColor: '#0451A5', borderWidth: 2}}>
                  <View style={{
                    borderRadius: 0, backgroundColor: '#0451A5', width: sizeCtrl.width,
                    height: sizeCtrl.height, alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity onPress={()=>this.updateQuantity('home', -1)}>
                      <Icon style={{textAlign: 'center', color: 'white', fontSize: sizeCtrl.width/2}} name='md-remove'/>
                    </TouchableOpacity>
                  </View>
                  {console.log(this.state.inHomeCount)}
                  <View style={{width: sizeCtrl.width+10, height: sizeCtrl.height, alignItems: 'center', justifyContent: 'center'}}>
                    <Text>{this.state.inHomeCount}</Text>
                  </View>
                  <View style={{
                    borderRadius: 0, backgroundColor: '#0451A5', width: sizeCtrl.width,
                    height: sizeCtrl.height, alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity onPress={()=>this.updateQuantity('home', 1)}>
                      <Icon size={10} style={{textAlign: 'center', color: 'white', fontSize: sizeCtrl.width/2}} name='md-add'/>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ marginTop: 40, marginBottom: 10, flexDirection: 'row', justifyContent: 'center' }}>
              <Button
                  style={{ borderRadius: 15, borderWidth: 2, backgroundColor: '#0451A5', height: 40, width: width - 80, justifyContent: 'center' }}
                  onPress={() => this.proceed(true)}>
                <Text style={{ fontSize: 18, color: 'white' }}>{screen.buyDishdasha}</Text>
              </Button>
            </View>
            <View style={{ marginTop: 20, marginBottom: 10, flexDirection: 'row', justifyContent: 'center' }}>
              <Button
                  style={{ borderRadius: 15, borderWidth: 2, backgroundColor: '#0451A5', height: 40, width: width - 80, justifyContent: 'center' }}
                  onPress={() =>this.proceed()}>
                <Text style={{ fontSize: 18, color: 'white' }}>{screen.buyDishdashaAndProduct}</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
