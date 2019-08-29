/*
 @Authour Satyanarayan Gotherwal
 @Date  19/04/2019
*/
import React, { Component } from 'react';
import { View, Text, Image, Dimensions, SafeAreaView, TextInput, TouchableOpacity, Linking } from 'react-native';
import { Form, Item, Input, Container, Content, Button, Radio, Icon } from 'native-base';
import Axios from 'axios';
const { width, height } = Dimensions.get('window');


export default class Login extends Component {

  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props)
    this.state = {
      itemSelected: 'itemOne',
      flag: false, boardAddModalShow: false,
      itemSelected2: 'itemOne2',
      noOfPieces: 0, mobileNo: null,
      mobileNumberFromDataBase: [],
      customerName: '', measurementDate: '',
      status: '', count: 0, notFound: false
    };
    this.sendApiRequest()
  }

  async sendApiRequest() {
    try {
      //Assign the promise unresolved first then get the data using the json method.
      const mobileNumberApiCall = await Axios.get('http://sakba.net/mobileApi/all-number.php');
      const mobileNumberList = mobileNumberApiCall.data;
      this.setState({ mobileNumberFromDataBase: mobileNumberList.numbers, loading: false });
    } catch (err) {
      alert(err);
      console.log("Error fetching data-----------", err);
    }
  }

  minus() {
    if (this.state.noOfPieces > 0)
      this.setState({ noOfPieces: this.state.noOfPieces - 1 });
    else
      this.setState({ noOfPieces: 0 });
  }
  plus() {
    this.setState({ noOfPieces: this.state.noOfPieces + 1 });
  }
  // onChanged(text) {

  //   let newText = '';
  //   let numbers = '0123456789';

  //   for (var i = 0; i < text.length; i++) {
  //     if (numbers.indexOf(text[i]) > -1) {
  //       newText = newText + text[i];
  //     }
  //     else {
  //       alert("please enter numbers only");
  //     }
  //   }

  //   this.setState({ mobileNo: newText });
  // }
  submitForm() {

    var reg = /^[0-9]+$/
    if (this.state.mobileNo == null) {
      alert('Pls Enter the Mobile No.')
    } else if (this.state.mobileNo.length < 8) {
      alert('Pls Enter the Mobile No. with minimum length of Eight Number')
    } else if (!reg.test(this.state.mobileNo)) {
      alert('Please Enter Only Numbers')
    } else {
      this.checkMobileNo();
    }
    //  this._stateUpdated();

  }
  _stateUpdated() {
    // console.warn('Avaniiiiiiiii',this.state.boardAddModalShow);
  }

  openAddBoardModal() {
    this.setState(
      { boardAddModalShow: true },
      this._stateUpdated.bind(this)
    );
  }
  checkMobileNo() {
    // var selected = this.props.navigation.state.params.selected;
    const { mobileNumberFromDataBase, mobileNo } = this.state;
    const mobile = mobileNo
    for (var i = 0; i < mobileNumberFromDataBase.length; i++) {
      if (mobile == mobileNumberFromDataBase[i].n_phone) {
        // this.setState(
        //   { boardAddModalShow: true },
        //   this._stateUpdated.bind(this)
        // );
        this.setState({ mobileNo: '' })
        this.props.navigation.navigate('welcome_customer', {
          mobileNo: mobile,
          customerName: mobileNumberFromDataBase[i].n_name,
          measurementDate: mobileNumberFromDataBase[i].n_last_mesurement_date,
        });
        break;
      } else {
        this.setState({ mobileNo: '' })
        this.props.navigation.navigate('visit_page');
      }
    }
    // console.log(mobileNumberFromDataBase);
    // mobileNumberFromDataBase.map((data, key) => {
    //   if (mobileNo == data.n_phone) {
    //     console.log(mobileNo, data.n_phone)
    //     this.props.navigation.navigate('welcome_customer', {
    //       mobileNo: mobileNo,
    //       customerName: data.n_name,
    //       measurementDate: data.n_last_mesurement_date,
    //     });
    //     this.setState({ mobileNo: '' });

    //   } else {
    //     this.setState({ mobileNo: '' })
    //     this.props.navigation.navigate('visit_page');
    //   }
    // });


    // this.props.navigation.navigate('welcome_customer');
  }
  requestExecutiveVisit() {
    this.props.navigation.navigate('executive_visitpage');
  }
  visitToShop() {
    this.props.navigation.navigate('visit_to_shoppage');
  }
  render() {

    return (
      <Container>
        <Content keyboardShouldPersistTaps={'always'} >
          <SafeAreaView>
            <View style={{ flex: 1 / 6, flexDirection: 'row', justifyContent: 'center', marginTop: 50 }}>
              <Image style={{ width: 80, height: 80 }} source={require('../../img/om.png')} />
            </View>
            <View style={{ marginTop: 50, justifyContent: 'center', alignItems: 'center', marginLeft: 40, marginRight: 40 }}>
              <View style={{ marginTop: 30 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Enter your mobile number</Text>
              </View>
              <Form>
                <Item style={{ marginLeft: 0, marginTop: 25, height: 40, width: '100%', backgroundColor: '#d1e2ff' }}>
                  <Image style={{ width: 30, height: 25, marginLeft: 5 }} source={require('../../img/basic1-035_mobile_phone-512.png')} />
                  <TextInput
                    style={{ width: width - 110, height: 40, fontSize: 15 }}
                    keyboardType='numeric'
                    value={this.state.mobileNo}
                    onChangeText={(text) => this.setState({ mobileNo: text })}
                    maxLength={9}
                  />
                </Item>
              </Form>
              <View style={{ marginTop: 25 }}>
                <Button
                  style={{ backgroundColor: '#0451A5', width: width - 80, height: 40, justifyContent: 'center' }}
                  onPress={() => this.submitForm()}>
                  <Text style={{ fontSize: 20, color: 'white' }}>Submit</Text>
                </Button>
              </View>
            </View>

            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>OR</Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>

                <View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Please Select Your Choice </Text>
                </View>
                <View style={{ marginTop: 25, flexDirection: 'column' }}>
                  <Button style={{ backgroundColor: '#0451A5', width: width - 80, height: 40, justifyContent: 'center' }}
                    onPress={() => this.requestExecutiveVisit()}>
                    <Text style={{ fontSize: 20, color: 'white' }}>Request Executive Visit </Text>
                  </Button>
                  <Button style={{ backgroundColor: '#0451A5', width: width - 80, height: 40, justifyContent: 'center', marginTop: 20 }}
                    onPress={() => this.visitToShop()}>
                    <Text style={{ fontSize: 20, color: 'white' }}>Visit to Shop</Text>
                  </Button>
                  <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }} onPress={() => {
                    Linking.canOpenURL('https://wa.me/96566333116')
                      .then(supported => {
                        if (!supported) {
                          alert(
                            'Please install whats app to send direct message'
                          );
                        } else {
                          return Linking.openURL('https://wa.me/96566333116');
                        }
                      })
                      .catch(err => console.error('An error occurred', err));
                  }}>
                    <Icon type="MaterialCommunityIcons" name={'whatsapp'} style={{fontSize:50,marginTop:20,   paddingRight: 10, color: 'green' }} />
                    {/* <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Contact us on 96566333116</Text> */}
                  </TouchableOpacity>

                </View>
              </View>
            </View>
          </SafeAreaView>
        </Content>
      </Container>
    );
  }
}
