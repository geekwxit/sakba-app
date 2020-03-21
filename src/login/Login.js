/**
 * @Authour Satyanarayan Gotherwal
 * @Date  19/04/2019
*/
import React, { Component } from 'react';
import {Alert, View, Text, Image, Dimensions, SafeAreaView, TextInput, TouchableOpacity, Linking,ScrollView } from 'react-native';
import { Form, Item, Container, Content, Button,} from 'native-base';
import axios from "../axios/AxiosInstance";
const { width, height } = Dimensions.get('window');
import {strings} from '../../locales/Language'
import {Language} from '../components/ChangeLanguage';

export default class Login extends Component {

  static navigationOptions = {
    header: null,
  };

  componentDidMount(){
    this.setLanguage();
  }
  async setLanguage(){
    const lang = await Language.get();
    lang!=null?this.setState({language: lang}):this.setState({language:'ar'});
    lang?strings.setLanguage(lang):strings.setLanguage('ar');
    this.setState({page: strings.login});
  }

  constructor(props) {
    super(props);
    this.state = {
      mobileNo: '',
      page : strings.login,
      language: 'en',
      itemSelected: 'itemOne',
      flag: false, boardAddModalShow: false,
      itemSelected2: 'itemOne2',
      noOfPieces: 0,
      mobileNumberFromDataBase: [],
      customerName: '', measurementDate: '',
      status: '', count: 0, notFound: false
    };
    this.sendApiRequest()
  }

  async sendApiRequest() {
    try {
      //Assign the promise unresolved first then get the data using the json method.
      const mobileNumberApiCall = await axios.get('all-number.php');
      const mobileNumberList = mobileNumberApiCall.data;
      this.setState({ mobileNumberFromDataBase: mobileNumberList.numbers, loading: false });
    } catch (err) {
      Alert.alert(strings.commonFields.alertTitle, err, [{text: strings.commonFields.okButton}]);
    }
  }

  async _onLanguageChange(language){
      const prevLanguage = await Language.get()
      if(language!=prevLanguage){
         const status = await Language.change(language);
         if(status) {
             this.setState({language: language});
             strings.setLanguage(language);
            this.setState({page: strings.login});
         }
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

  submitForm() {
    var reg = /^[0-9]+$/
    if (this.state.mobileNo == null) {
      Alert.alert(strings.commonFields.alertTitle, this.state.page.validation.mobileError, [{text: strings.commonFields.okButton}]);
    } else if (this.state.mobileNo.length < 8) {
      Alert.alert(strings.commonFields.alertTitle, this.state.page.validation.lengthError, [{text: strings.commonFields.okButton}]);
    } else if (!reg.test(this.state.mobileNo)) {
      Alert.alert(strings.commonFields.alertTitle, this.state.page.validation.others, [{text: strings.commonFields.okButton}]);
    } else {
      this.checkMobileNo();
    }
  }

  checkMobileNo() {
    const { mobileNumberFromDataBase, mobileNo } = this.state;
    const mobile = mobileNo
    for (var i = 0; i < mobileNumberFromDataBase.length; i++) {
      if (mobile == mobileNumberFromDataBase[i].n_phone) {
        this.setState({ mobileNo: '' })
        this.props.navigation.navigate('welcome_customer', {
            measurement: mobileNumberFromDataBase[i].n_metere,
            language: strings,
            mobileNo: mobile,
            customerName: mobileNumberFromDataBase[i].n_name,
            measurementDate: mobileNumberFromDataBase[i].n_last_mesurement_date,
            emailID: mobileNumberFromDataBase[i].n_email
        });
        break;
      } else {
        this.setState({ mobileNo: '' })
        this.props.navigation.navigate('visit_page', {language: strings});
      }
    }
  }
  requestExecutiveVisit() {
    this.props.navigation.navigate('executive_visitpage', {language: strings});
  }
  visitToShop() {
    this.props.navigation.navigate('visit_to_shoppage', {language: strings});
  }
  render() {
      screen = this.state.page;
      Text.defaultProps = Text.defaultProps || {};
      Text.defaultProps.allowFontScaling = false;
    return (
      <Container>
        <Content keyboardShouldPersistTaps={'always'} >
          <SafeAreaView>
            <ScrollView style={{paddingBottom:30}}>
            <View style={{ flex: 1 / 6, flexDirection: 'row', justifyContent: 'center', marginTop: 50 }}>
              <Image style={{ width: 80, height: 80 }} source={require('../../img/om.png')} />
            </View>
            <View style={{ marginTop: 50, justifyContent: 'center', alignItems: 'center', marginLeft: 40, marginRight: 40 }}>
              <View>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{screen.enterMobile}</Text>
              </View>
              <Form>
                <Item style={{ marginLeft: 0, marginTop: 25, height: 40, width: '100%', backgroundColor: '#d1e2ff' }}>
                  {!strings.isRTL?
                  <Image style={{ width: 30, height: 25, marginLeft: 5 }} source={require('../../img/basic1-035_mobile_phone-512.png')} />:null}
                  <TextInput
                      selectionColor={'rgba(4,101,227,0.44)'}
                    style={{ textAlign: strings.isRTL?'right':'left',width: width - 110, height: 50, fontSize: 15 }}
                    keyboardType='numeric'
                    value={this.state.mobileNo}
                    onChangeText={(text) => this.setState({ mobileNo: text })}
                    maxLength={9}
                  />
                  {strings.isRTL?
                      <Image style={{ width: 30, height: 25, marginLeft: 5 }} source={require('../../img/basic1-035_mobile_phone-512.png')} />:null}
                </Item>
              </Form>
              <View style={{ marginTop: 25 }}>
                <Button
                  style={{ backgroundColor: '#0451A5', width: width - 80, height: 40, justifyContent: 'center' }}
                  onPress={() => this.submitForm()}>
                  <Text style={{ fontSize: 18, color: 'white' }}>{screen.submitButton}</Text>
                </Button>
              </View>
            </View>

            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{screen.or}</Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>

                <View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{screen.choiceSelect}</Text>
                </View>
                <View style={{ marginTop: 25, flexDirection: 'column' }}>
                  <Button style={{ backgroundColor: '#0451A5', width: width - 80, height: 40, justifyContent: 'center' }}
                    onPress={() => this.requestExecutiveVisit()}>
                    <Text style={{ fontSize: 18, color: 'white' }}>{screen.reqExecVisit}</Text>
                  </Button>
                  <Button style={{ backgroundColor: '#0451A5', width: width - 80, height: 40, justifyContent: 'center', marginTop: 20 }}
                    onPress={() => this.visitToShop()}>
                    <Text style={{ fontSize: 18, color: 'white' }}>{screen.visitToShopPage}</Text>
                  </Button>
                  <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }} onPress={() => {
                    Linking.canOpenURL('https://wa.me/96566333116')
                      .then(supported => {
                        if (!supported) {
                          Alert.alert(strings.commonFields.alertTitle, screen.installWhatsApp, [{text: strings.commonFields.okButton}]);
                        } else {
                          return Linking.openURL('https://wa.me/96566333116');
                        }
                      })
                      .catch(err => console.error('An error occurred', err));
                  }}>
                    <View>
                    <Image style={{width: 90, height: 90}} source={require('../../img/whatsapp.png')}/>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
              <View style={{alignSelf: 'center',flexDirection: 'row'}}>
                <Text style={{fontSize: 15}}>Change lanugage to : </Text>
                <TouchableOpacity onPress={()=>this._onLanguageChange('en')}>
                  <Text style={{color: this.state.language=='en'?'#0451A5':'#a2a2a2',fontSize: 15}}>English  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this._onLanguageChange('ar')}>
                  {/**Language Arabic - العربية**/}
                  <Text style={{color: this.state.language=='ar'?'#0451A5':'#a2a2a2',fontSize: 15}}>العربية</Text>
                </TouchableOpacity>
              </View>
              <View/>
            </ScrollView>
          </SafeAreaView>
        </Content>
      </Container>
    );
  }
}
