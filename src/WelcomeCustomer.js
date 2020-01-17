import React, { Component } from 'react';
import { View, Text, Image, Dimensions, Linking, SafeAreaView, ScrollView, Alert } from 'react-native';

// import RadioForm from 'react-native-simple-radio-button';
import  RadioButton from './components/RadioButton'
import RadioForm from './components/RadioForm'
import {Button, Content} from "native-base";

const { width, height } = Dimensions.get('window');
export default class WelcomeCustomer extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 },
      headerTintColor: '#fff',
    };
  };
  state = {
      language: this.props.navigation.getParam('language') ,
      email : this.props.navigation.getParam('emailID')   ,
      customerName: '',
      measurementDate: '' ,
      mobileNo: '',value: 0,
  }

  moveFunction(value, customerName, measurementDate , mobileNo) {
    console.log("sakba data to renew: " , this.state)
    email = this.props.navigation.state.params.emailID;
    this.setState({value, customerName, measurementDate, mobileNo})
    // if (value == 0) {
    //   this.props.navigation.navigate('customer_agree', {
    //       measurement: this.props.navigation.getParam('measurement'),
    //     language: this.state.language,
    //     mobileNo: mobileNo,
    //     customerName: customerName,
    //     measurementDate: measurementDate,
    //     emailID: this.state.email
    //   });
    // }
    // else {
    //   this.props.navigation.navigate('visit_page', {language: this.state.language});
    // }
  }

  _onPressOK(mobileNo, customerName){
      const {value, measurementDate} = this.state;
      if (value == 0) {
          this.props.navigation.navigate('customer_agree', {
              measurement: this.props.navigation.getParam('measurement'),
              language: this.state.language,
              mobileNo: mobileNo,
              customerName: customerName,
              measurementDate: measurementDate,
              emailID: this.state.email
          });
      }
      else {
          this.props.navigation.navigate('visit_page', {language: this.state.language});
      }
  }


  render() {
    var screen = this.state.language.welcomeCustomer;
    Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;


    const { navigation } = this.props;
    var mobileNo = this.props.navigation.state.params.mobileNo;
    const customerName = navigation.getParam('customerName', '');
    const measurementDate = navigation.getParam('measurementDate', '');

    console.log(customerName , measurementDate , mobileNo)
    return (
        <Content>
      <SafeAreaView >
          <ScrollView style={{paddingBottom:30}}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 50 }}>
          <Image style={{ width: 80, height: 80 }} source={require('../img/om.png')} />
        </View>


        <View style={{ flexDirection: 'column', marginHorizontal: 40, paddingHorizontal: 0 }}>
          <View style={{ marginTop: 50, flexDirection: 'column', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, }}>{screen.wText1}<Text style={{ fontWeight: '500' }}>{customerName}</Text></Text>
            <Text style={{ fontSize: 20, marginTop: 10 }}>{screen.wTextMeasure}{measurementDate}</Text>

          </View>
          <View style={{marginTop: 30}}>
            <Text style={{ fontSize: 20, textAlign: 'left', }}>{screen.acceptText}</Text>

            {/* <TouchableOpacity
            onPress={()=>this.radio1(customerName,measurementDate)}
            style={{flexDirection:'row',marginTop:10}}>
              <Radio onPress={() => this.radio1(customerName,measurementDate) }
                  selected={(this.state.itemSelected == 'itemOne')}
                />
              <Text style={{marginLeft: 10}}>I agree</Text>
            </TouchableOpacity>



            <TouchableOpacity
            onPress={()=>this.radio2()}
            style={{flexDirection:'row'}}>
              <Radio onPress={() => this.radio2() }
                    selected={this.state.itemSelected == 'itemTwo' }
                  />
              <Text style={{marginLeft: 10}}>I need new mesurments</Text>
            </TouchableOpacity>
 */}

            <View style={{ marginTop: 15 }}>
              {/*<RadioForm*/}
              {/*    isRTL={this.state.language.isRTL}*/}
              {/*  style={{alignItems: this.state.language.isRTL?'flex-end':'flex-start'}}*/}
              {/*  buttonSize={10}*/}
              {/*  buttonColor={'#0451A5'}*/}
              {/*  buttonInnerColor={'#0451A5'}*/}
              {/*  buttonOuterColor={'#0451A5'}*/}
              {/*  buttonWrapStyle={{ marginTop: 10 }}*/}
              {/*  selectedButtonColor={'#0451A5'}*/}
              {/*  labelStyle={{ fontSize: 20, marginTop: 0, }}*/}
              {/*  buttonOuterSize={20}*/}
              {/*  buttonStyle={{ marginTop: 20 }}*/}
              {/*  radio_props={[*/}
              {/*      { label: screen.agree, value: 0 },*/}
              {/*      { label: screen.needNew, value: 1 }*/}
              {/*  ]}*/}
              {/*  initial={0}*/}
              {/*  onPress={(value) => this.moveFunction(value, customerName, measurementDate , mobileNo)}*/}
              {/*/>*/}
                <RadioForm
                    isRTL={this.state.language.isRTL}
                    radio_props={[
                        { label: screen.agree, value: 0 },
                        { label: screen.needNew, value: 1 }
                    ]}
                    buttonColor='#0451A5'
                    radioSize={22}
                    onPress={(value) => this.moveFunction(value, customerName, measurementDate , mobileNo)}
                />

            </View>
          </View>
        </View>
              <View style={{ paddingTop: 100 }}>
                  <Button
                      style={{ backgroundColor: '#0451A5', alignSelf:'center', width: width - 100, height: 40, justifyContent: 'center' }}
                      onPress={()=>this._onPressOK(mobileNo, customerName)}>
                      <Text style={{ fontSize: 18, color: 'white' }}>{screen.okButton}</Text>
                  </Button>
              </View>
          </ScrollView>
      </SafeAreaView>
        </Content>
    );
  }
}
