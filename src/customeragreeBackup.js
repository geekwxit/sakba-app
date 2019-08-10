import React, { Component } from 'react';
import { View, Text, Image, Dimensions, ActivityIndicator, Modal, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { Form, Item, Input, Container, Content, Button, Radio, Icon, Textarea } from 'native-base';
import renderIf from 'render-if';
import PayPal from 'react-native-paypal-wrapper';
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
      sendFabric: true, homeDelivery: true,
      p_area: '', p_street: '', p_jada: '', p_floor: '', p_block: '', p_apartment: '',
      p_extra_Number: '', p_house: '',
      d_area: '', d_street: '', d_jada: '', d_floor: '', d_block: '', d_apartment: '',
      d_extra_Number: '', d_house: '',
      area: '', street: '', jada: '', floor: '', block: '', apartment: '', extra_Number: '', house: '',
      itemSelected: 'itemTwo', noOfPieces: 1, mobileNo: 0, address: 2, response: [], msg: '', deliveryOption: 'itemTwo',
      deliveryOptionPickUpFormStore: 'itemTwo'
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
    const {
      p_area, p_street, p_jada, p_floor, p_block, p_apartment, p_extra_Number, p_house,
      d_area, d_street, d_jada, d_floor, d_block, d_apartment, d_extra_Number, d_house, itemSelected, deliveryOption,
      area, street, jada, floor, block, apartment, extra_Number, house
    } = this.state;

    var customerName = this.props.navigation.state.params.customerName;
    var measurementDate = this.props.navigation.state.params.measurementDate;
    var mobileNo = this.props.navigation.state.params.mobileNo;
    var pickup_type, delivery_type;
    var fabricOptionValue, deliveryOptionValue;


    if (itemSelected == "itemTwo") {
      pickup_type = 'send';
      fabricOptionValue = 0;
      if (deliveryOption == 'itemTwo') {
        delivery_type = 'home';
        deliveryOptionValue = 3;
        if (d_apartment && d_area && d_block && d_extra_Number && d_floor && d_house && d_jada && d_street) {

          var data = JSON.stringify({
            pickup_type: pickup_type,
            delivery_type: delivery_type,
            d_apartment,
            d_area, d_block, d_extra_Number, d_floor, d_house
            , d_jada, d_street
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
              this.props.navigation.navigate('order_detail', {
                noOfPieces: this.state.noOfPieces,
                fabricOptionValue: fabricOptionValue,
                deliveryOptionValue: deliveryOptionValue,
                customerName: customerName,
                measurementDate: measurementDate,
                mobileNo: mobileNo
              });
              this.setState({ emailId: responseData.email, isLoading: false })
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
        deliveryOptionValue = 0;
        this.props.navigation.navigate('order_detail', {
          noOfPieces: this.state.noOfPieces,
          fabricOptionValue: fabricOptionValue,
          deliveryOptionValue: deliveryOptionValue,
          customerName: customerName,
          measurementDate: measurementDate,
          mobileNo: mobileNo
        });
        alert('All Details Are Required')
      }
    } else {
      pickup_type = 'pickup';
      fabricOptionValue = 3;
      if (p_apartment && p_area && p_block && p_extra_Number && p_floor && p_house && p_jada && p_street) {
        if (deliveryOption == "itemTwo") {
          delivery_type = 'home';
          deliveryOptionValue = 3;
          if (d_apartment && d_area && d_block && d_extra_Number && d_floor && d_house && d_jada && d_street) {
            var data = JSON.stringify({
              pickup_type: pickup_type,
              delivery_type: delivery_type,
              d_apartment,
              d_area, d_block, d_extra_Number, d_floor, d_house
              , d_jada, d_street
              , p_apartment, p_area, p_block, p_extra_Number, p_floor, p_house, p_jada, p_street
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
                this.props.navigation.navigate('order_detail', {
                  noOfPieces: this.state.noOfPieces,
                  fabricOptionValue: fabricOptionValue,
                  deliveryOptionValue: deliveryOptionValue,
                  customerName: customerName,
                  measurementDate: measurementDate,
                  mobileNo: mobileNo
                });
                this.setState({ emailId: responseData.email, isLoading: false })
              })
              .catch((error) => {
                console.log(error);
                this.setState({ isLoading: false })
              });
          } else {
            alert('All Details Are Required');
          }


        } else {
          deliveryOptionValue = 0;
          this.props.navigation.navigate('order_detail', {
            noOfPieces: this.state.noOfPieces,
            fabricOptionValue: fabricOptionValue,
            deliveryOptionValue: deliveryOptionValue,
            customerName: customerName,
            measurementDate: measurementDate,
            mobileNo: mobileNo
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


  render() {
    return (
      <Container>
        <Content>
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
                          {/* <Input
                            placeholder='Area'
                            onChangeText={(text) => this.setState({ area: text })}
                            value={this.state.block}
                          /> */}
                          <TextInput
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
                            placeholder='Ext  ra Number'
                            keyboardType='numeric'
                            onChangeText={(text) => this.setState({ extra_Number: text })}
                            value={this.state.extra_Number}
                          />
                        </Item>
                      </View>
                    </Form>
                  )}

                  <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 20 }}>Choose delivery option </Text>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                      {/* <Radio onPress={() => this.setState({ deliveryOption: 'itemOne' })}
                      selected={this.state.deliveryOption == 'itemOne'}
                    />
                    <Text style={{ marginLeft: 10, fontSize: 18 }}>Pick up from our store</Text> */}
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
                        radio_props={deliveryRadio}
                        initial={1}
                        onPress={(value) => {
                          (value == 0)
                            ? this.setState({ deliveryOption: 'itemOne' })
                            : this.setState({ deliveryOption: 'itemTwo' })
                        }}
                      />
                    </View>
                    {renderIf(this.state.deliveryOption == 'itemOne')(
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
                    )}
                    {/* <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <Radio onPress={() => this.setState({ deliveryOption: 'itemTwo' })}
                      selected={this.state.deliveryOption == 'itemTwo'}
                    />
                    <View style={{ flexDirection: 'column' }}>
                      <Text style={{ marginLeft: 10, fontSize: 18 }}>Home delivery pay " 3 kd"</Text>
                    </View>
                  </View> */}
                    {renderIf(this.state.deliveryOption == 'itemTwo')(
                      <Form style={{ flexDirection: 'column', marginTop: 20, marginLeft: 0 }}>
                        <Text style={{ fontSize: 18 }}>Address :</Text>
                        <View style={{ flexDirection: 'row', marginTop: 10, width: 40 }}>
                          <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
                            {/* <Input
                              placeholder='Area'
                              onChangeText={(text) => this.setState({ area: text })}
                              value={this.state.area}
                            /> */}
                            <TextInput
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
                  <View style={{ marginTop: 40, marginBottom: 30, flexDirection: 'row', justifyContent: 'center' }}>
                    <Button
                      style={{ borderRadius: 15, borderWidth: 2, backgroundColor: '#0451A5', height: 40, width: width - 140, justifyContent: 'center' }}
                      onPress={() => this.submitForm()}>
                      <Text style={{ fontSize: 20, color: 'white' }}>Order Now !</Text>
                    </Button>
                  </View>
                </View>
                {renderIf(this.state.msg)(
                  <View style={{}}>
                    <Text style={{ color: '#0451A5', fontSize: 20, fontWeight: 'bold' }}>{this.state.msg}</Text>
                  </View>
                )}
              </View>
              <View>
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={this.state.isLoading}
                  onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                  }}>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={"large"} color="#00ff00" />
                  </View>
                </Modal>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Content>
      </Container>
    );
  }
}
