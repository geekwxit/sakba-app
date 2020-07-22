import React, { Component } from 'react';
import { View, Text, Image, Dimensions, ScrollView, Alert } from 'react-native';
import { Container, Content, Form, Item, Input, Button, Icon, Textarea } from 'native-base';
import DateTimePicker from "react-native-modal-datetime-picker";
import axios from './axios/AxiosInstance';

const { width, height } = Dimensions.get('window');

export default class ExecutiveVisitPage extends Component<Props>{
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 },
      headerTintColor: '#fff',
    };
  };
  constructor(props) {
    super(props)
    this.state = {
      language: this.props.navigation.getParam('language'),
      page: this.props.navigation.getParam('language').requestExecutiveVisit,
      name: '', number: '',
      area: '', block: '', street: '', jada: '', house: '', floor: '', apartment: '', extra_Number: '',
      Button_True: false
    };
  }

  componentDidMount() {
    lang = this.props.navigation.getParam('language');
    this.setState({ language: lang, page: lang.requestExecutiveVisit });
  }

  request() {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    const { name, number, area, block, street, jada, house, floor, apartment, extra_Number } = this.state
    // var time = this.state.selectedTime;
    // var date = this.state.selectedDate;

    var address = area + block + street + jada + house + floor + apartment + extra_Number

    if (name == '') {
      this.setState({ Button_True: false })
      Alert.alert(this.state.language.commonFields.alertTitle, this.state.page.enterUserName, [{ text: this.state.language.commonFields.okButton }]);
      // alert(this.state.page.enterUserName)
    } else if (number == '') {
      this.setState({ Button_True: false })
      Alert.alert(this.state.language.commonFields.alertTitle, this.state.page.enterNum, [{ text: this.state.language.commonFields.okButton }]);
      // alert(this.state.page.enterNum)
    } else if (address == '') {
      this.setState({ Button_True: false })
      Alert.alert(this.state.language.commonFields.alertTitle, this.state.page.addressField, [{ text: this.state.language.commonFields.okButton }]);
      // alert(this.state.page.addressField)
    }
    // else if (time=='Select Time'){
    //   alert('Pls Select the Date')
    // }else if (date=='Pick a Date'){
    //   alert('Pls select time ')
    // }
    else {
      URL = 'add-visit.php'
      axios.post(URL, {
        name: name,
        old_number: number,
        area, street, block, jada, house, floor, apartment,
        extra_number: extra_Number,
      })
        .then((response) => response.data)
        .then((responseData) => {
          //console.warn('tyuhrtyrtytyrtyyryeyrrr', responseData);
          if (responseData.mssg == 'Data Added') {
            Alert.alert(this.state.page.alert_SendExec, this.state.page.sendExec, [{ text: this.state.language.commonFields.okButton }]);
            // alert(this.state.page.sendExec)
            this.props.navigation.navigate('login');
            this.setState({ Button_True: false })
          }
        })
        .catch((error) => {
          console.log("Error");
          console.warn('Error');
        });

    }
  }

  render() {
    var screen = this.state.page;
    const isRTL = this.state.language.isRTL;
    return (
      <Container>
        <Content>
          <ScrollView style={{ paddingBottom: 30 }}>
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 50 }}>
                <Image style={{ width: 80, height: 80 }} source={require('../img/om.png')} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 50 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{screen.title}</Text>
              </View>
              <Form style={{ marginLeft: 40, marginRight: 40 }}>
                <Item regular style={{ marginTop: 20 }}>
                  <Input
                    placeholder={screen.pName}
                    placeholderTextColor='#aaa'
                    style={{ height: 40, textAlign: isRTL ? 'right' : 'left' }}
                    value={this.state.name}
                    onChangeText={(value) => { this.setState({ name: value }) }}
                  />
                </Item>
                <Item regular style={{ marginTop: 15 }}>
                  <Input
                    placeholder={screen.pNumber}
                    keyboardType='numeric'
                    maxLength={10}
                    placeholderTextColor='#aaa'
                    style={{ height: 40, textAlign: isRTL ? 'right' : 'left' }}
                    value={this.state.number}
                    onChangeText={(value) => { this.setState({ number: value }) }}
                  />
                </Item>
                <Text style={{ fontSize: 18, marginTop: 15, textAlign: isRTL ? 'right' : 'left' }}>{screen.addressLabel}</Text>
                <View style={{ flexDirection: 'row', marginTop: 10, width: 40 }}>
                  <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
                    <Input
                      style={{ textAlign: isRTL ? 'right' : 'left' }}
                      placeholder={screen.pArea}
                      onChangeText={(text) => this.setState({ area: text })}
                      value={this.state.area}
                    />
                  </Item>
                  <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                    <Input
                      style={{ textAlign: isRTL ? 'right' : 'left' }}
                      placeholder={screen.pBlock}
                      keyboardType='numeric'
                      onChangeText={(text) => this.setState({ block: text })}
                      value={this.state.block}
                    />
                  </Item>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 5, width: 40 }}>
                  <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
                    <Input
                      style={{ textAlign: isRTL ? 'right' : 'left' }}
                      placeholder={screen.pStreet}
                      onChangeText={(text) => this.setState({ street: text })}
                      value={this.state.street}
                    />
                  </Item>
                  <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                    <Input
                      style={{ textAlign: isRTL ? 'right' : 'left' }}
                      placeholder={screen.pJada}
                      onChangeText={(text) => this.setState({ jada: text })}
                      value={this.state.jada}
                    />
                  </Item>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 5, width: 40 }}>
                  <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
                    <Input
                      style={{ textAlign: isRTL ? 'right' : 'left' }}
                      placeholder={screen.pHouse}
                      onChangeText={(text) => this.setState({ house: text })}
                      value={this.state.house}
                    />
                  </Item>
                  <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                    <Input
                      style={{ textAlign: isRTL ? 'right' : 'left' }}
                      placeholder={screen.pFloor}
                      keyboardType='numeric'
                      onChangeText={(text) => this.setState({ floor: text })}
                      value={this.state.floor}
                    />
                  </Item>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 5, width: 40, marginBottom: 10 }}>
                  <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
                    <Input
                      style={{ textAlign: isRTL ? 'right' : 'left' }}
                      placeholder={screen.pApartment}
                      onChangeText={(text) => this.setState({ apartment: text })}
                      value={this.state.apartment}
                    />
                  </Item>
                  <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                    <Input
                      style={{ textAlign: isRTL ? 'right' : 'left' }}
                      placeholder={screen.pExtra}
                      keyboardType='numeric'
                      onChangeText={(text) => this.setState({ extra_Number: text })}
                      value={this.state.extra_Number}
                    />
                  </Item>
                </View>
                { /* <Item regular style={{marginTop:15,height:40}}>
               <Icon style={{color:'#aaa'}} name='ios-calendar' onPress={this.showDateTimePicker}/>
                   <Text style={{marginLeft:10}}>{selectedDate}</Text>
                  <DateTimePicker
                    isVisible={isDateTimePickerVisible}
                    onConfirm={(value)=>this.handleDatePicked(value)}
                    onCancel={this.hideDateTimePicker}
                    mode='date'
                 />
              </Item>
              <Item regular style={{marginTop:15,height:40}}>
               <Icon style={{color:'#aaa'}} name='ios-time' onPress={this.showDateTimePicker2}/>
                   <Text style={{marginLeft:10}}>{selectedTime}</Text>
                  <DateTimePicker
                    isVisible={isDateTimePickerVisible2}
                    onConfirm={(value)=>this.handleDatePicked2(value)}
                    onCancel={this.hideDateTimePicker}
                    is24Hour={true}
                    mode='time'
                 />
              </Item> */}
              </Form>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                <Button disabled={this.state.Button_True} style={{ backgroundColor: '#0451A5', width: width - 80, height: 40, justifyContent: 'center' }} onPress={() => { this.setState({ Button_True: true }), this.request() }}>
                  <Text style={{ fontSize: 20, color: 'white' }}>{screen.requestButton}</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
