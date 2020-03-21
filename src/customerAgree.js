import  React, { Component } from 'react';
import { View, Text, Image, Dimensions, SafeAreaView,Alert, ScrollView, TouchableOpacity} from 'react-native';
import { Button,Icon} from 'native-base';
import renderIf from 'render-if';
const { width, height } = Dimensions.get('window');

export default class customerAgree extends Component<Props>{

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
      itemSelected: 'itemTwo', noOfPieces: 1, mobileNo: this.props.navigation.getParam('mobileNo', null), address: 2, response: [], msg: '', deliveryOption: 'itemOne',
      deliveryOptionPickUpFormStore: 'one', delivery_date: '',

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

    proceed(){
      const inHomeCount = this.state.inHomeCount;
      const outsideCount= this.state.outsideCount;
      const mobileNo    = this.props.navigation.getParam('mobileNo', null);
      const customerName= this.props.navigation.getParam('customerName', null);
		console.log("customerName: ",customerName);
      this.props.navigation.navigate(inHomeCount>0?'fabric':'delivery',
          {measurement: this.props.navigation.getParam('measurement'),language: this.state.language, inHomeCount, outsideCount, mobileNo, customerName, noOfPieces: this.state.noOfPieces})
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
   var screen = this.state.language.customerAgree;
    Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

    const sizeCtrl = {width: 40, height: 40}
    return (
      <SafeAreaView >
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

            <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'center' }}>
              <Button
                  style={{ borderRadius: 15, borderWidth: 2, backgroundColor: '#0451A5', height: 40, width: width - 80, justifyContent: 'center' }}
                  onPress={() => this.props.navigation.navigate('Shop',
                      {
                        measurement: this.props.navigation.getParam('measurement'),
                        language: this.state.language,
                        inHomeCount:0, outsideCount:0, mobileNo:0,
                        customerName:'d',
                        noOfPieces: this.state.noOfPieces}
                      )}>
                <Text style={{ fontSize: 18, color: 'white' }}>Buy Products</Text>
              </Button>
            </View>
            <View style={{ marginTop: 40, marginBottom: 30, flexDirection: 'row', justifyContent: 'center' }}>
              <Button
                  style={{ borderRadius: 15, borderWidth: 2, backgroundColor: '#0451A5', height: 40, width: width - 80, justifyContent: 'center' }}
                  onPress={() => this.proceed()}>
                <Text style={{ fontSize: 18, color: 'white' }}>{screen.proceedButton}</Text>
              </Button>
            </View>
            {renderIf(this.state.msg)(
              <View style={{}}>
                <Text style={{ color: '#0451A5', fontSize: 20, fontWeight: 'bold' }}>{this.state.msg}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
