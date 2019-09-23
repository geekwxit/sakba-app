import React, { Component } from 'react';
import { View, Text, Image, Dimensions, ScrollView } from 'react-native';
import { Container, Content, Form, Item, Input, Button, Icon, Textarea } from 'native-base';
import DateTimePicker from "react-native-modal-datetime-picker";
import axios from 'axios';

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
      name: '', number: '',
      area: '', block: '', street: '', jada: '', house: '', floor: '', apartment: '', extra_Number: ''
    };
  }
  request() {

    Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

    const { name , number , area , block, street, jada ,house ,floor ,apartment ,extra_Number } = this.state

    // var time = this.state.selectedTime;
    // var date = this.state.selectedDate;

    var address = area+block+street+jada+house+floor+apartment+extra_Number

    if (name == '') {
      alert('Please Enter The User Name')
    } else if (number == '') {
      alert('Please Enter the Number')
    } else if (address == '') {
      alert('Please enter atleast one address field')
    }
    // else if (time=='Select Time'){
    //   alert('Pls Select the Date')
    // }else if (date=='Pick a Date'){
    //   alert('Pls select time ')
    // }
    else {
      URL = 'http://sakba.net/mobileApi/add-visit.php'
      axios.post(URL, {
          name: name,
          old_number: number,
          area , street, block , jada , house , floor , apartment ,
          extra_number: extra_Number,
        })
        .then((response) => response.data)
        .then((responseData) => {
          console.warn('tyuhrtyrtytyrtyyryeyrrr', responseData);
          if (responseData.mssg == 'Data Added') {
            alert('We Will Send Executive soon')
            this.props.navigation.navigate('login');
          }
        })
        .catch((error) => {
          console.log("Error");
          console.warn('Error');
        });
    }
  }

  render() {
    return (
      <Container>
        <Content>
          <ScrollView>
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 50 }}>
                <Image style={{ width: 80, height: 80 }} source={require('../img/om.png')} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 50 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Details for Executive Visit </Text>
              </View>
              <Form style={{ marginLeft: 40, marginRight: 40 }}>
                <Item regular style={{ marginTop: 20 }}>
                  <Input
                    placeholder='Name'
                    placeholderTextColor='#aaa'
                    style={{ height: 40 }}
                    value={this.state.name}
                    onChangeText={(value) => { this.setState({ name: value }) }}
                  />
                </Item>
                <Item regular style={{ marginTop: 15 }}>
                  <Input
                    placeholder='Number'
                    keyboardType='numeric'
                    maxLength={10}
                    placeholderTextColor='#aaa'
                    style={{ height: 40 }}
                    value={this.state.number}
                    onChangeText={(value) => { this.setState({ number: value }) }}
                  />
                </Item>
                <Text style={{ fontSize: 18, marginTop: 15 }}>Address :</Text>
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
                <Button style={{ backgroundColor: '#0451A5', width: width - 80, height: 40, justifyContent: 'center' }} onPress={() => this.request()}>
                  <Text style={{ fontSize: 20, color: 'white' }}>Request</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
