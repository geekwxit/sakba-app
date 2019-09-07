import React, { Component } from 'react';
import { View, Text, Image, Dimensions, ActivityIndicator, Modal, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Form, Item, Input, Container, Content, Button, Radio, Icon, Textarea } from 'native-base';
import renderIf from 'render-if';
import PayPal from 'react-native-paypal-wrapper';
import CustomRadioButton from 'react-native-vector-icons/MaterialCommunityIcons';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';


const { width, height } = Dimensions.get('window');

const deliveryRadio = [
  { label: 'Pick up from our store', value: 0 },
  { label: 'Home delivery pay " 3 kd"', value: 1 }
];
const fabricRadio = [
  { label: 'Send your fabric to us', value: 0 },
  { label: 'Pick up Pay "3kd" ', value: 1 }
];


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
      isLoading: false,
      pickupStore: null,
      sendFabric: true, homeDelivery: true,
      p_area: '', p_street: '', p_jada: '', p_floor: '', p_block: '', p_apartment: '',
      p_extra_Number: '', p_house: '',
      d_area: '', d_street: '', d_jada: '', d_floor: '', d_block: '', d_apartment: '',
      d_extra_Number: '', d_house: '',
      area: '', street: '', jada: '', floor: '', block: '', apartment: '', extra_Number: '', house: '',
      itemSelected: 'itemTwo', noOfPieces: 1, mobileNo: 0, address: 2, response: [], msg: '', deliveryOption: 'itemOne',
      deliveryOptionPickUpFormStore: 'one', delivery_date: ''
    };
  }
  componentDidMount() {
    PayPal.initialize(PayPal.NO_NETWORK, "AedWoRTQiHP7ObJm8A065-v8dGa1iyuoZlZqcvZZEtb0jLo3lBPaWA6eXOafT5c9Wv3Md5tVzqpcOgjm");
    var mobileNo = this.props.navigation.state.params.mobileNo;
    this.setState({ mobileNo: mobileNo })
  }
  minus() {
    if (this.state.noOfPieces > 1)
      this.setState({ noOfPieces: this.state.noOfPieces - 1 });
    else
      this.setState({ noOfPieces: 1 });
  }
  plus() {
    this.setState({ noOfPieces: this.state.noOfPieces + 1 });
  }
  submitForm() {
    console.log('in submit form');
    const {
      p_area, p_street, p_jada, p_floor, p_block, p_apartment, p_extra_Number, p_house,
      d_area, d_street, d_jada, d_floor, d_block, d_apartment, d_extra_Number, d_house,
      itemSelected, deliveryOption, deliveryOptionPickUpFormStore,
      area, street, jada, floor, block, apartment, extra_Number, house,
    } = this.state;

    var customerName = this.props.navigation.state.params.customerName;
    var measurementDate = this.props.navigation.state.params.measurementDate;
    var mobileNo = this.props.navigation.state.params.mobileNo;
    var pickup_type, delivery_type, whichStore;
    var fabricOptionValue, deliveryOptionValue, subTotal;


    if (itemSelected == "itemTwo") {
      console.log('one');
      pickup_type = 'send';
      fabricOptionValue = 0;
      if (deliveryOption == 'itemTwo') {
        console.log('2 one');
        delivery_type = 'home';
        deliveryOptionValue = 3;
        subTotal = 12 * this.state.noOfPieces + fabricOptionValue + deliveryOptionValue
        if (area && block && house && street) {

          var data = JSON.stringify({
            o_pieces: this.state.noOfPieces,
            o_total: this.state.noOfPieces * 12,
            o_number: mobileNo,
            o_subtotal: subTotal,
            o_pickup_charge: fabricOptionValue,
            o_delivery_charge: deliveryOptionValue,
            pickup_type: pickup_type,
            delivery_type: delivery_type,
            d_apartment: apartment,
            d_area: area,
            d_block: block,
            d_extra_number: extra_Number,
            d_floor: floor,
            d_house: house
            , d_jada: jada, d_street: street
          })

          // if default condition will occur
          const url = 'http://sakba.net/mobileApi/order.php';
          this.setState({ isLoading: true });
          fetch(url, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
            body: data
          })
            .then((response) => response.json())
            .then((responseData) => {
              console.log(responseData);
              this.setState({ emailId: responseData.email, isLoading: false }, () => {
                this.props.navigation.navigate('order_detail', {
                  id: responseData.id,
                  token: responseData.token,
                  noOfPieces: this.state.noOfPieces,
                  fabricOptionValue: fabricOptionValue,
                  deliveryOptionValue: deliveryOptionValue,
                  customerName: customerName,
                  measurementDate: measurementDate,
                  mobileNo: mobileNo,
                  delivery_date: responseData.delivery_date
                });
              })
            })
            .catch((error) => {
              console.log(error);
              this.setState({ isLoading: false })
              console.warn('error');
            });
        } else {
          alert('All Details Are Required');
        }
      } else {
        console.log('2 two');
        deliveryOptionValue = 0;
        delivery_type = "self";
        if (deliveryOptionPickUpFormStore == 'one') {

          whichStore = "Awquaf Complex"
        } else {
          whichStore = "Qurain Shop"
        }

        subTotal = 12 * this.state.noOfPieces + fabricOptionValue + deliveryOptionValue

        var data = JSON.stringify({
          o_pieces: this.state.noOfPieces,
          o_total: this.state.noOfPieces * 12,
          o_number: mobileNo,
          o_subtotal: subTotal,
          o_pickup_charge: fabricOptionValue,
          o_delivery_charge: deliveryOptionValue,
          pickup_type: pickup_type,
          delivery_type: delivery_type,
          d_store_name: whichStore
        })
        const url = 'http://sakba.net/mobileApi/order.php';
        this.setState({ isLoading: true });
        fetch(url, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
          body: data
        })
          .then((response) => response.json())
          .then((responseData) => {
            this.setState({ isLoading: false });
            console.log(responseData);

            this.setState({ emailId: responseData.email, isLoading: false });
            this.props.navigation.navigate('order_detail', {
              id: responseData.id,
              token: responseData.token,
              noOfPieces: this.state.noOfPieces,
              fabricOptionValue: fabricOptionValue,
              deliveryOptionValue: deliveryOptionValue,
              customerName: customerName,
              measurementDate: measurementDate,
              mobileNo: mobileNo,
              delivery_date: responseData.delivery_date
            });

          })
          .catch((error) => {
            console.log(error);
            this.setState({ isLoading: false })
            console.warn('error');
          });
      }
    } else {
      console.log('two');
      pickup_type = 'pickup';
      fabricOptionValue = 3;
      if (area && block && house && street) {
        if (deliveryOption == "itemTwo") {
          delivery_type = 'home';
          deliveryOptionValue = 3;
          subTotal = 12 * this.state.noOfPieces + fabricOptionValue + deliveryOptionValue
          if (area && block && house && street) {
            var data = JSON.stringify({

              o_pieces: this.state.noOfPieces,
              o_total: this.state.noOfPieces * 12,
              o_number: mobileNo,
              o_subtotal: subTotal,
              o_pickup_charge: fabricOptionValue,
              o_delivery_charge: deliveryOptionValue,


              pickup_type: pickup_type,
              delivery_type: delivery_type,
              d_apartment: apartment,
              d_area: area, d_block: block,
              d_extra_number: extra_Number,
              d_floor: floor, d_house: house,
              d_jada: jada, d_street: street
              , p_apartment: apartment,
              p_area: area,
              p_block: block,
              p_extra_number: extra_Number,
              p_floor: floor,
              p_house: house, p_jada: jada, p_street: street
            })

            // if default condition will occur
            const url = 'http://sakba.net/mobileApi/order.php';
            this.setState({ isLoading: true })
            fetch(url, {
              method: 'POST',
              headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
              body: data
            })
              .then((response) => response.json())
              .then((responseData) => {
                console.log(responseData);

                this.setState({ emailId: responseData.email, isLoading: false }, () => {
                  this.props.navigation.navigate('order_detail', {
                    id: responseData.id,
                    token: responseData.token,
                    noOfPieces: this.state.noOfPieces,
                    fabricOptionValue: fabricOptionValue,
                    deliveryOptionValue: deliveryOptionValue,
                    customerName: customerName,
                    measurementDate: measurementDate,
                    mobileNo: mobileNo,
                    delivery_date: responseData.delivery_date
                  });
                })
              })
              .catch((error) => {
                console.log(error);
                this.setState({ isLoading: false })
              });
          } else {
            alert('All Details Are Required');
          }


        } else {
          if (deliveryOptionPickUpFormStore == 'one') {
            whichStore = "Awquaf Complex"
          } else {
            whichStore = "Qurain Shop"
          }
          deliveryOptionValue = 0;
          subTotal = 12 * this.state.noOfPieces + fabricOptionValue + deliveryOptionValue
          var data = JSON.stringify({

            o_pieces: this.state.noOfPieces,
            o_total: this.state.noOfPieces * 12,
            o_number: mobileNo,
            o_subtotal: subTotal,
            o_pickup_charge: fabricOptionValue,
            o_delivery_charge: deliveryOptionValue,


            pickup_type: pickup_type,
            delivery_type: delivery_type,
            p_apartment: apartment, p_area: area,
            p_block: block, p_extra_number: extra_Number,
            p_floor: floor, p_house: house,
            p_jada: jada, p_street: street,
            d_store_name: whichStore
          })
          const url = 'http://sakba.net/mobileApi/order.php';
          this.setState({ isLoading: true });
          fetch(url, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
            body: data
          })
            .then((response) => response.json())
            .then((responseData) => {
              console.log(responseData);

              this.setState({ emailId: responseData.email, isLoading: false }, () => {
                this.props.navigation.navigate('order_detail', {
                  id: responseData.id,
                  token: responseData.token,
                  noOfPieces: this.state.noOfPieces,
                  fabricOptionValue: fabricOptionValue,
                  deliveryOptionValue: deliveryOptionValue,
                  customerName: customerName,
                  measurementDate: measurementDate,
                  mobileNo: mobileNo,
                  delivery_date: responseData.delivery_date
                });
              })

            })
            .catch((error) => {
              console.log(error);
              this.setState({ isLoading: false })
              console.warn('error');
            });
        }

      } else {
        alert('All Details Are Required');
      }
    }


    // if (area && street && jada && floor && block && apartment && extra_Number && house) {


    //   if (itemSelected == "itemTwo") {
    //     pickup_type = 'send'
    //   } else {
    //     pickup_type = 'pickup'
    //   }

    //   if (deliveryOption == "itemTwo") {
    //     delivery_type = 'home'
    //   } else {
    //     delivery_type = 'self'
    //   }

    //   var data = JSON.stringify({
    //     pickup_type: 'send'
    //   })

    //   const url = 'http://sakba.net/mobileApi/order.php';
    //   fetch(url, {
    //     method: 'POST',
    //     headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
    //     body: data
    //   })
    //     .then((response) => response.json())
    //     .then((responseData) => {
    //       this.setState({ emailId: responseData.email })
    //     })
    //     .catch((error) => {
    //       console.log("Error");
    //       console.warn('errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
    //     });
    //   // this is restricted field

    // if (this.state.itemSelected == 'itemOne') {
    //   fabricOptionValue = 3;
    // } else {
    //   fabricOptionValue = 0;
    // }
    // if (this.state.deliveryOption == 'itemTwo') {
    //   deliveryOptionValue = 3
    // } else {
    //   deliveryOptionValue = 0;
    // }

    // this.props.navigation.navigate('order_detail', {
    //   noOfPieces: this.state.noOfPieces,
    //   fabricOptionValue: fabricOptionValue,
    //   deliveryOptionValue: deliveryOptionValue,
    //   customerName: customerName,
    //   measurementDate: measurementDate,
    //   mobileNo: mobileNo
    // })

    // } else {
    //   alert("Please Enter All the Values Of Address");
    // }
    // var noOfPieces= this.state.noOfPieces;
    // var address=this.state.address;
    // var  area=this.state.area;
    // var  block=this.state.block;
    // var  street=this.state.street;
    // var  house=this.state.house;
    // var  floor=this.state.floor;
    // var  apartment=this.state.apartment;
    // var  extra_Number=this.state.extra_Number;
    // var  jada=this.state.jada;
    // var fabric;

    //   if(this.state.itemSelected=='itemOne'){
    //     fabric='pick up';
    //     address=1;
    //   }else{
    //     fabric='send fabric';
    //     address=0;
    //   }

    // URL='http://sakba.net/mobileApi/add-number.php'
    // fetch(URL, {
    //     method: 'POST',
    //     headers: { 'Accept': 'application/json','Content-Type': 'application/json',},
    //     body: JSON.stringify({
    //       number:this.state.mobileNo,
    //       noOfPieces:noOfPieces,
    //       fabric:fabric,
    //       address:address,
    //       area:area,
    //       block:block,
    //       street:street,
    //       jada:jada,
    //       house:house,
    //       floor:floor,
    //       apartment:apartment,
    //       extra_Number:extra_Number,
    //     })
    // })
    // .then((response) => response.json())
    // .then((responseData) => {
    //     console.warn('tyuhrtyrtytyrtyyryeyrrr',responseData);
    //     if(responseData.mssg=='Data Added'){
    //       alert('Your information is stored at our end')
    //       this.props.navigation.navigate('login',{
    //         selected: true
    //       });
    //       // navigation.state.params.onSelect({ });
    //     }
    // })
    // .catch((error) => {
    //     console.log("Error");
    // });

    //Paypal-------------------------------------------
    // PayPal.pay({
    //   price: (this.state.noOfPieces)*1+'',
    //   currency: 'USD',
    //   description: 'No of Pieces :'+this.state.noOfPieces,
    // }).then(confirm => {
    //   this.setState({
    //     response:confirm,
    //     msg:'payment is successful'
    //   })
    //   setTimeout(()=> {this.fun()},3000)
    // })
    //   .catch(error => console.log(error)); 

  }
  // fun(){
  //   this.setState({msg:''});
  // }

  getComponent() {
    if (this.state.deliveryOption == 'itemTwo') {
      return (<View style={{ flexDirection: 'column', marginTop: 20, marginLeft: 0 }}>
        <Text style={{ fontSize: 18 }}>Address :</Text>
        <View style={{ flexDirection: 'row', marginTop: 10, width: 40 }}>
          <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
            <Input
              placeholder='Area'
              onChangeText={(text) => this.setState({ area: text })}
              value={this.state.area}
            />
          </Item>
          <Item regular style={{ width: width / 2 - 40, height: 30 }}>
            <Input
              placeholder='Block'
              keyboardType='numeric'
              onChangeText={(text) => this.setState({ block: text })}
              value={this.state.block}
            />
          </Item>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 5, width: 40 }}>
          <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
            <Input
              placeholder='Street'
              onChangeText={(text) => this.setState({ street: text })}
              value={this.state.street}
            />
          </Item>
          <Item regular style={{ width: width / 2 - 40, height: 30 }}>
            <Input
              placeholder='Jada'
              onChangeText={(text) => this.setState({ jada: text })}
              value={this.state.jada}
            />
          </Item>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 5, width: 40 }}>
          <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
            <Input
              placeholder='House'
              onChangeText={(text) => this.setState({ house: text })}
              value={this.state.house}
            />
          </Item>
          <Item regular style={{ width: width / 2 - 40, height: 30 }}>
            <Input
              placeholder='Floor'
              keyboardType='numeric'
              onChangeText={(text) => this.setState({ floor: text })}
              value={this.state.floor}
            />
          </Item>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 5, width: 40, marginBottom: 10 }}>
          <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
            <Input
              placeholder='Apartment'
              onChangeText={(text) => this.setState({ apartment: text })}
              value={this.state.apartment}
            />
          </Item>
          <Item regular style={{ width: width / 2 - 40, height: 30 }}>
            <Input
              placeholder='Extra Number'
              keyboardType='numeric'
              onChangeText={(text) => this.setState({ extra_Number: text })}
              value={this.state.extra_Number}
            />
          </Item>
        </View>
      </View>)
    }
  }

  render() {
    const { deliveryOption, deliveryOptionPickUpFormStore } = this.state
    console.log(deliveryOption);
    return (
      // <Container>
      //   <Content>
      <SafeAreaView >
        <ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 50 }}>
            <Image style={{ width: 80, height: 80 }} source={require('../img/om.png')} />
          </View>
          <View style={{ flexDirection: 'column', marginHorizontal: 40 }}>
            <View style={{ marginTop: 50 }}>
              <Text style={{ fontSize: 20, textAlign: 'center' }}>How many dishdasha you want ?</Text>
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


            <View style={{ marginTop: 40 }}>
              <Text style={{ fontSize: 20 }}>Fabrics</Text>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                {/* <Radio onPress={() => this.setState({ itemSelected: 'itemTwo' })}
                    selected={this.state.itemSelected == 'itemTwo'}
                  />
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={{ marginLeft: 10, fontSize: 18 }}>Send your fabric to us</Text>
                    <Text style={{ marginLeft: 10, fontSize: 12 }}>(Note:Please send it within 3 days)</Text>
                  </View> */}
                <RadioForm
                  buttonSize={10}
                  buttonColor={'#0451A5'}
                  buttonInnerColor={'#0451A5'}
                  buttonOuterColor={'#0451A5'}
                  buttonWrapStyle={{ marginTop: 10 }}
                  selectedButtonColor={'#0451A5'}
                  labelStyle={{ fontSize: 20, marginTop: 0, }}
                  buttonOuterSize={20}
                  buttonStyle={{ marginTop: 20 }}


                  radio_props={fabricRadio}
                  initial={0}
                  onPress={(value) => {
                    (value == 0)
                      ? this.setState({ itemSelected: 'itemTwo' })
                      : this.setState({ itemSelected: 'itemOne' })
                  }}
                />
              </View>
              {/* <View style={{ flexDirection: 'row', marginTop: 5 }}>
                  <Radio onPress={() => this.setState({ itemSelected: 'itemOne' })}
                    selected={this.state.itemSelected == 'itemOne'}
                  />
                  <Text style={{ marginLeft: 10, fontSize: 18 }}>Pick up pay "3 kd"</Text>
                </View> */}
              {renderIf(this.state.itemSelected == 'itemOne')(
                <Form style={{ flexDirection: 'column', marginTop: 20, marginLeft: 0 }}>
                  <Text style={{ fontSize: 18 }}>Address :</Text>
                  <View style={{ flexDirection: 'row', marginTop: 10, width: 40 }}>
                    <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
                      <Input
                        placeholder='Area'
                        onChangeText={(text) => this.setState({ area: text })}
                        value={this.state.area}
                      />
                    </Item>
                    <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                      <Input
                        placeholder='Block'
                        keyboardType='numeric'
                        onChangeText={(text) => this.setState({ block: text })}
                        value={this.state.block}
                      />
                    </Item>
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: 5, width: 40 }}>
                    <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
                      <Input
                        placeholder='Street'
                        onChangeText={(text) => this.setState({ street: text })}
                        value={this.state.street}
                      />
                    </Item>
                    <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                      <Input
                        placeholder='Jada'
                        onChangeText={(text) => this.setState({ jada: text })}
                        value={this.state.jada}
                      />
                    </Item>
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: 5, width: 40 }}>
                    <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
                      <Input
                        placeholder='House'
                        onChangeText={(text) => this.setState({ house: text })}
                        value={this.state.house}
                      />
                    </Item>
                    <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                      <Input
                        placeholder='Floor'
                        keyboardType='numeric'
                        onChangeText={(text) => this.setState({ floor: text })}
                        value={this.state.floor}
                      />
                    </Item>
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: 5, width: 40, marginBottom: 10 }}>
                    <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
                      <Input
                        placeholder='Apartment'
                        onChangeText={(text) => this.setState({ apartment: text })}
                        value={this.state.apartment}
                      />
                    </Item>
                    <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                      <Input
                        placeholder='Extra Number'
                        keyboardType='numeric'
                        onChangeText={(text) => this.setState({ extra_Number: text })}
                        value={this.state.extra_Number}
                      />
                    </Item>
                  </View>
                </Form>
              )}
            </View>

            <View style={{ marginTop: 20, }}>
              <Text style={{ fontSize: 20 }}>Choose delivery option </Text>

              <View style={{ flex: 1, marginTop: 10 }}>

                <View>
                  <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row' }}
                    onPress={() => this.setState({ deliveryOption: 'itemOne' })} >
                    {deliveryOption == 'itemOne'
                      ? <CustomRadioButton name="radiobox-marked" size={25} color={'#0451A5'} />
                      : <CustomRadioButton name="checkbox-blank-circle-outline" size={25} color={'#0451A5'} />
                    }
                    <Text style={{ marginLeft: 10, fontSize: 20, color: '#000', fontWeight: '400' }}>Pick up from our store</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row' }}
                    onPress={() => this.setState({ deliveryOption: 'itemTwo' })} >
                    {deliveryOption === 'itemTwo'
                      ? <CustomRadioButton name="radiobox-marked" size={25} color={'#0451A5'} />
                      : <CustomRadioButton name="checkbox-blank-circle-outline" size={25} color={'#0451A5'} />
                    }
                    <Text style={{ marginLeft: 10, fontSize: 20, color: '#000', fontWeight: '400' }}>Home delivery pay " 3 kd "</Text>
                  </TouchableOpacity>
                </View>
                {renderIf(deliveryOption == 'itemTwo')(
                  <Form style={{ flexDirection: 'column', marginTop: 20, marginLeft: 0 }}>
                    <Text style={{ fontSize: 18 }}>Address :</Text>
                    <View style={{ flexDirection: 'row', marginTop: 10, width: 40 }}>
                      <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
                        <Input
                          placeholder='Area'
                          onChangeText={(text) => this.setState({ area: text })}
                          value={this.state.area}
                        />
                      </Item>
                      <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                        <Input
                          placeholder='Block'
                          keyboardType='numeric'
                          onChangeText={(text) => this.setState({ block: text })}
                          value={this.state.block}
                        />
                      </Item>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 5, width: 40 }}>
                      <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
                        <Input
                          placeholder='Street'
                          onChangeText={(text) => this.setState({ street: text })}
                          value={this.state.street}
                        />
                      </Item>
                      <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                        <Input
                          placeholder='Jada'
                          onChangeText={(text) => this.setState({ jada: text })}
                          value={this.state.jada}
                        />
                      </Item>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 5, width: 40 }}>
                      <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
                        <Input
                          placeholder='House'
                          onChangeText={(text) => this.setState({ house: text })}
                          value={this.state.house}
                        />
                      </Item>
                      <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                        <Input
                          placeholder='Floor'
                          keyboardType='numeric'
                          onChangeText={(text) => this.setState({ floor: text })}
                          value={this.state.floor}
                        />
                      </Item>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 5, width: 40, marginBottom: 10 }}>
                      <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
                        <Input
                          placeholder='Apartment'
                          onChangeText={(text) => this.setState({ apartment: text })}
                          value={this.state.apartment}
                        />
                      </Item>
                      <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                        <Input
                          placeholder='Extra Number'
                          keyboardType='numeric'
                          onChangeText={(text) => this.setState({ extra_Number: text })}
                          value={this.state.extra_Number}
                        />
                      </Item>
                    </View>
                  </Form>
                )}
              </View>
              <View style={{ flex: 1, marginTop: 10 }}>
                {renderIf(deliveryOption == 'itemOne')(
                  <View style={{ marginLeft: 25, flex: 1 }}>
                    <TouchableOpacity
                      style={{ flexDirection: 'row', marginTop: 10 }}
                      onPress={() => this.setState({ deliveryOptionPickUpFormStore: 'one' })} >
                      {/* <Radio onPress={() => this.setState({ deliveryOptionPickUpFormStore: 'itemOne' })}
                          selected={this.state.deliveryOptionPickUpFormStore == 'itemOne'}
                        /> */}
                      {(deliveryOptionPickUpFormStore == "one" && deliveryOption == "itemOne")
                        ? <CustomRadioButton name="radiobox-marked" size={25} color={'#0451A5'} />
                        : <CustomRadioButton name="checkbox-blank-circle-outline" size={25} color={'#0451A5'} />
                      }
                      <Text style={{ marginLeft: 10, fontSize: 18, color: '#000' }}>Awqaf Complex</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.setState({ deliveryOptionPickUpFormStore: 'two' })}
                      style={{ flexDirection: 'row', marginTop: 5 }}>
                      {/* <Radio onPress={() => this.setState({ deliveryOptionPickUpFormStore: 'itemTwo' })}
                          selected={this.state.deliveryOptionPickUpFormStore == 'itemTwo'}
                        /> */}
                      {(deliveryOptionPickUpFormStore === "two" && deliveryOption === "itemOne")
                        ? <CustomRadioButton name="radiobox-marked" size={25} color={'#0451A5'} />
                        : <CustomRadioButton name="checkbox-blank-circle-outline" size={25} color={'#0451A5'} />
                      }
                      <Text style={{ marginLeft: 10, fontSize: 18, color: '#000' }}>Qurain Shop</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {/* Original */}
              </View>

            </View>



            {/* <View>
                <View>
                <Text style={{ fontSize: 20,marginBottom:20 }}>Choose delivery option </Text>
                  
                  <TouchableOpacity>
                    <Text style={{fontSize:18,color:'#333',fontWeight:'700'}}>Pick up from our store</Text>
                  </TouchableOpacity>
                  <View style={{ marginLeft: 25 }}>
                      <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Radio onPress={() => this.setState({ deliveryOptionPickUpFormStore: 'itemOne' })}
                          selected={this.state.deliveryOptionPickUpFormStore == 'itemOne'}
                        />
                        <Text style={{ marginLeft: 10, fontSize: 18 }}>Awqaf Complex</Text>
                      </View>
                      <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Radio onPress={() => this.setState({ deliveryOptionPickUpFormStore: 'itemTwo' })}
                          selected={this.state.deliveryOptionPickUpFormStore == 'itemTwo'}
                        />
                        <View style={{ flexDirection: 'column' }}>
                          <Text style={{ marginLeft: 10, fontSize: 18 }}>Qurain Shop</Text>
                        </View>
                      </View>
                    </View>
                </View>
                <View style={{marginTop:30}}>
                  <TouchableOpacity>
                    <Text style={{fontSize:18,color:'#333',fontWeight:'700'}}>Home delivery pay "3kd"</Text>
                  </TouchableOpacity>
                  <Form style={{ flexDirection: 'column', marginTop: 10, marginLeft:0 }}>
                      <Text style={{ fontSize: 18 }}>Address :</Text>
                      <View style={{ flexDirection: 'row', marginTop: 10, width: 40 }}>
                        <Item regular style={{ width: width/2-40, height: 30, marginRight: 5 }}>
                          <Input
                            placeholder='Area'
                            onChangeText={(text) => this.setState({ d_area: text })}
                            value={this.state.d_area}
                          />
                        </Item>
                        <Item regular style={{ width: width/2-40, height: 30 }}>
                          <Input
                            placeholder='Block'
                            keyboardType='numeric'
                            onChangeText={(text) => this.setState({ d_block: text })}
                            value={this.state.d_block}
                          />
                        </Item>
                      </View>
                      <View style={{ flexDirection: 'row', marginTop: 5, width: 40 }}>
                        <Item regular style={{ width: width/2-40, height: 30, marginRight: 5 }}>
                          <Input
                            placeholder='Street'
                            onChangeText={(text) => this.setState({ d_street: text })}
                            value={this.state.d_street}
                          />
                        </Item>
                        <Item regular style={{ width: width/2-40, height: 30 }}>
                          <Input
                            placeholder='Jada'
                            onChangeText={(text) => this.setState({ d_jada: text })}
                            value={this.state.d_jada}
                          />
                        </Item>
                      </View>
                      <View style={{ flexDirection: 'row', marginTop: 5, width: 40 }}>
                        <Item regular style={{ width: width/2-40, height: 30, marginRight: 5 }}>
                          <Input
                            placeholder='House'
                            onChangeText={(text) => this.setState({ d_house: text })}
                            value={this.state.d_house}
                          />
                        </Item>
                        <Item regular style={{ width: width/2-40, height: 30 }}>
                          <Input
                            placeholder='Floor'
                            keyboardType='numeric'
                            onChangeText={(text) => this.setState({ d_floor: text })}
                            value={this.state.d_floor}
                          />
                        </Item>
                      </View>
                      <View style={{ flexDirection: 'row', marginTop: 5, width: 40, marginBottom: 10 }}>
                        <Item regular style={{ width: width/2-40, height: 30, marginRight: 5 }}>
                          <Input
                            placeholder='Apartment'
                            onChangeText={(text) => this.setState({ d_apartment: text })}
                            value={this.state.d_apartment}
                          />
                        </Item>
                        <Item regular style={{ width: width/2-40, height: 30 }}>
                          <Input
                            placeholder='Extra Number'
                            keyboardType='numeric'
                            onChangeText={(text) => this.setState({ d_extra_Number: text })}
                            value={this.state.d_extra_Number}
                          />
                        </Item>
                      </View>
                    </Form>
                </View>
              </View>       */}



            <View style={{ marginTop: 40, marginBottom: 30, flexDirection: 'row', justifyContent: 'center' }}>
              <Button
                style={{ borderRadius: 15, borderWidth: 2, backgroundColor: '#0451A5', height: 40, width: width - 140, justifyContent: 'center' }}
                onPress={() => this.submitForm()}>
                <Text style={{ fontSize: 20, color: 'white' }}>Order Now !</Text>
              </Button>
            </View>
            {renderIf(this.state.msg)(
              <View style={{}}>
                <Text style={{ color: '#0451A5', fontSize: 20, fontWeight: 'bold' }}>{this.state.msg}</Text>
              </View>
            )}
          </View>

          {/* <Modal
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                animationType="fade"
                transparent={true}
                visible={this.state.isLoading}
                onRequestClose={() => {
                  Alert.alert('Modal has been closed.');
                }}>
                <ActivityIndicator size={"large"} color="#00ff00" />
              </Modal> */}

        </ScrollView>
      </SafeAreaView>
      //   </Content>
      // </Container>
    );
  }
}
