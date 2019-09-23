import React, { Component } from 'react';
import { View, Text, Image, Dimensions, Linking, SafeAreaView } from 'react-native';
import { Radio, Container, Contain } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';


const { width, height } = Dimensions.get('window');

const radio_props = [
  { label: 'I agree', value: 0 },
  { label: 'I need new mesurments', value: 1 }
];
export default class WelcomeCustomer extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 },
      headerTintColor: '#fff',
    };
  };
  state = {
    email : this.props.navigation.getParam('emailID'),
  }

  moveFunction(value, customerName, measurementDate , mobileNo) {
    console.log("sakba data to renew: " , this.state)
    email = this.props.navigation.state.params.emailID;
    if (value == 0) {
      this.props.navigation.navigate('customer_agree', {
        mobileNo: mobileNo,
        customerName: customerName,
        measurementDate: measurementDate,
        emailID: this.state.email
      });
    }
    else {
      this.props.navigation.navigate('visit_page');
    }
  }





  render() {

    Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;


    const { navigation } = this.props;
    var mobileNo = this.props.navigation.state.params.mobileNo;
    const customerName = navigation.getParam('customerName', '');
    const measurementDate = navigation.getParam('measurementDate', '');

    console.log(customerName , measurementDate , mobileNo)
    return (

      <SafeAreaView>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 50 }}>
          <Image style={{ width: 80, height: 80 }} source={require('../img/om.png')} />
        </View>
        <View style={{ flexDirection: 'column', marginHorizontal: 40, paddingHorizontal: 0 }}>
          <View style={{ marginTop: 50, flexDirection: 'column', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, }}>Welcome <Text style={{ fontWeight: '500' }}>{customerName}</Text>,</Text>
            <Text style={{ fontSize: 20, marginTop: 10 }}>Your last mesurment in {measurementDate}</Text>

          </View>
          <View style={{ marginTop: 20, marginTop: 30 }}>
            <Text style={{ fontSize: 20, textAlign: 'left', }}>Do you accept this mesurment</Text>

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

                radio_props={radio_props}
                initial={0}
                onPress={(value) => this.moveFunction(value, customerName, measurementDate , mobileNo)}

              />
            </View>

          </View>
        </View>
      </SafeAreaView>
    );
  }
}
