import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  BackHandler,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Button, Container, Content } from 'native-base';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import PayPal from 'react-native-paypal-wrapper';
import renderIf from 'render-if';
import axios from 'axios';

const {  height,width } = Dimensions.get('window');
const WIDTH = width/2-20;


export default class OrderDetail extends Component<props>{
  cart = [];
  static navigationOptions = ({ navigation }) => {
    others = navigation.getParam('language').isRTL?
        {headerRight: <Text style={{color:'white', fontSize: 20%(width*height), padding: 15}}>{navigation.getParam('language').orderDetail.screenTitle}</Text>}:
        {title: navigation.getParam('language').orderDetail.screenTitle}
    return {
      headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 },
      headerTintColor: '#fff',
      ...others
    };
  };
  constructor(props) {
    super(props)
    var id = this.props.navigation.state.params.id;
    var token = this.props.navigation.state.params.token;

    this.state = {
      measurement: props.navigation.getParam('measurement'),
      language: props.navigation.getParam('language'),
      widthArr: [ WIDTH,WIDTH ],
      page: 'OrderDetail', emailId: '',
      id: id, isLoading: false, cart: this.props.navigation.getParam('cart'),
      fabrics: this.props.navigation.getParam('fabrics')
    };
    this.url = "http://sakba.net/payment.php?Sid=" + id + "&&token=" + token;

  }
  componentDidMount() {
    this.setState({language: this.props.navigation.getParam('language')});
    var mobileNo = this.props.navigation.state.params.mobileNo;
    console.warn('mobileNo', mobileNo);
    this.getEmailAddress(mobileNo);this.getOrderID(mobileNo);
  }

  async getEmailAddress(number){
    const url = 'http://sakba.net/mobileApi/get-email.php';
    data = JSON.stringify({
      no: number,
    })
    axios.post(url,data)
        .then((response) => response.data)
        .then((responseData) => {
          this.setState({ emailId: responseData.email })
        })
        .catch((error) => {
          console.log("Error");
          console.warn('errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');

        });
  }

  async getOrderID(mobileNo){
    const url2 = 'http://sakba.net/mobileApi/order-id.php';
    var data = {o_number:mobileNo};
    await axios.post(url2, data)
        .then((response) => response.data)
        .then((responseData) => {
          this.setState({ orderId: responseData.order_id })
        })
        .catch((error) => {
          console.log("Error");
          console.warn(' order-id errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');

        });
  }

  sendDetails(total, deliveryDate){
    var user = this.props.navigation.state.params;
    console.log(user);
    var token = user.token;
    var fullname = user.customerName;
    var ph_number = user.mobileNo;
    var email = user.emailID;
    var amount = Number.parseInt(total);
    var data = JSON.stringify({token, fullname, ph_number, email, amount});

    this.sendApiRequest(data).then(()=>{
      this.props.navigation.navigate('order_confirm', {
        measurement: this.props.navigation.getParam('measurement',null),
        language: this.state.language,
          token: token,
          customerName: fullname,
          emailID: email,
          totalAmount: amount,
          orderID: this.state.orderId,
          deliveryDate: deliveryDate
      })
    })
    console.log(data);
    // this.sendApiRequest(data);
    // this.props.navigation.navigate('order_confirm',{
    //   mobileNo : this.props.navigation.state.params.mobileNo,
    //   token:this.props.navigation.state.params.token,
    //   customerName: this.props.navigation.state.params.customerName,
    //   emailID: this.props.navigation.state.params.emailID,
    //   totalAmount: total
    // }

  }

  async sendApiRequest(data) {
    var screen = this.state.language.orderDetail;
    //this.setState({ isLoading: true })
    //try {
    //Assign the promise unresolved first then get the data using the json method.
    await axios.post('http://sakba.net/mobileApi/requestPayment.php', data)
        .then(response=>{return response.data})
        .then(response=>{
          console.log("sender", data);
          // if(!response.error){
          //   //debugger;
          //   this.setState({ isLoading: false });
          //   Alert.alert('Alert', "Thanks we have receieved your request. Complete your order by making payment.", [
          //     {text: 'Yes', onPress: ()=>{this.setState({isLoading: false}); this.props.navigation.dispatch(resetAction)}}
          //   ])
          // }
          // else {
          //   //debugger;
          //   this.setState({ isLoading: false });
          //   Alert.alert('Alert', "Something wrong in your network.", [
          //     {text: 'Yes', onPress: ()=>{this.setState({isLoading: false}); this.props.navigation.dispatch(resetAction)}}
          //   ])
          // }
        })
        .catch(e=>{
          this.setState({ isLoading: false });
          Alert.alert(screen.alertTitle, screen.error, [
            {text: screen.alertButton, onPress: ()=>{this.setState({isLoading: false}); this.props.navigation.dispatch(resetAction)}}
          ])
        });

    //const response = await Axios.post('http://sakba.net/mobileApi/requestPayment.php', data);
    //}
    // catch (err) {
    //     alert("Something wrong in your network");
    //     console.log("Error fetching data-----------", err);
    //     this.setState({ isLoading: false });
    //      this.props.navigation.dispatch(resetAction);
    // }
  }
  submitForm(total, noOfPieces) {

    // Linking.openURL(this.url);
    var url = this.url + "&lang=" + this.state.language.getLanguage();
    this.props.navigation.navigate('paypal', { url: url, language: this.state.language})

    //  PayPal.pay({
    //       price: total+'',
    //       currency: 'USD',
    //       description: 'No of Dishdasha :'+noOfPieces,
    //   })
    //   .then(confirm => {
    //     console.log(confirm);
    //     this.secondCallForPayment(confirm)
    //           this.setState({
    //             page:'OrderConfirm'
    //           })
    //   })
    //   .catch(error => console.log(error));
  }

  filterCart(cart, brands){
    let tempCart = [];
    cart.forEach(item=>{
      y = tempCart.find(fItem=>{return fItem.brand==item.brand})
      y?(y.quantity += item.quantity):tempCart.push({brand: item.brand, name: brands[item.brand].name, quantity: item.quantity, price: brands[item.brand].price})
    })
    return tempCart.length?tempCart:null;
  }

  render() {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    var isRTL = this.state.language.isRTL;
    var screen = this.state.language.orderDetail;
    const state = this.state;
    const m = this.state.measurement;
    const { navigation } = this.props;
    const noOfPieces = navigation.getParam('noOfPieces', 'NO-ID');
    const fabricOptionValue = navigation.getParam('fabricOptionValue', 'NO-ID');
    const deliveryOptionValue = navigation.getParam('deliveryOptionValue', 'NO-ID');
    const delivery_date = navigation.getParam('delivery_date', 'NO-ID');
    // const inHomeCount = navigation.getParam('inHomeCount', 0);
    // const inHomeTotal = 0;
    console.log(delivery_date);
    var total = 12 * noOfPieces + fabricOptionValue + deliveryOptionValue;

    const customerName = navigation.getParam('customerName', '');
    const measurementDate = navigation.getParam('measurementDate', '');

    userCart = this.filterCart(state.cart, state.fabrics);
    const tableData = [];
    const fabrics = [];

    userCart?userCart.map(item=>{
      total += item.quantity*item.price*m;
      fabrics.push([!isRTL?(`${item.name} * `+ item.quantity*m + " m " + `(${item.price} KD/m)`):(`${item.quantity*item.price*m} KD`), isRTL?(`${item.name} * `+item.quantity):(`${item.quantity*item.price*m} KD`)]);
    }):null;

    tableData.push(!isRTL?([`${screen.tableDishdasha} ${noOfPieces}`, `${noOfPieces*12} KD`]):([`${noOfPieces*12} KD`, `${screen.tableDishdasha} ${noOfPieces}`]));
    fabricOptionValue?tableData.push(!isRTL?([`${screen.tablePickup}`, `${fabricOptionValue} KD`]):([`${fabricOptionValue} KD`, `${screen.tablePickup}`])):null;
    deliveryOptionValue?tableData.push(!isRTL?([`${screen.tableDelivery}`, `${deliveryOptionValue} KD`]):([`${deliveryOptionValue} KD`, `${screen.tableDelivery}`])):null;
    /*
    if (fabricOptionValue == 0 && deliveryOptionValue == 0) {
      for (let i = 0; i < 2; i += 1) {
        const rowData = [];
        for (let j = 0; j < 2; j += 1) {

          if (i == 0 && j == 0) {
            rowData.push(`Classic Dishdasha * ${noOfPieces}`);
          }
          if (i == 0 && j == 1) {
            rowData.push(`${12 * noOfPieces}`);
          }
          // if (i == 1 && j == 0) {
          //   rowData.push(`Total`);
          // }
          // if (i == 1 && j == 1) {
          //   rowData.push(`${total}`);
          // }
        }
        tableData.push(rowData);
      }
    }
    else if (deliveryOptionValue == 0) {
      for (let i = 0; i < 3; i += 1) {
        const rowData = [];
        for (let j = 0; j < 2; j += 1) {

          if (i == 0 && j == 0) {
            rowData.push(`Classic Dishdasha * ${noOfPieces}`);
          }
          if (i == 0 && j == 1) {
            rowData.push(`${12 * noOfPieces}`);
          }
          if (i == 1 && j == 0) {
            rowData.push(`Pickup`);
          }
          if (i == 1 && j == 1) {
            rowData.push(`${fabricOptionValue}`);
          }
          // if (i == 2 && j == 0) {
          //   rowData.push(`Total`);
          // }
          // if (i == 2 && j == 1) {
          //   rowData.push(`${total}`);
          // }
        }
        tableData.push(rowData);
      }
    }
    else if (fabricOptionValue == 0) {
      for (let i = 0; i < 3; i += 1) {
        const rowData = [];
        for (let j = 0; j < 2; j += 1) {

          if (i == 0 && j == 0) {
            rowData.push(`Classic Dishdasha * ${noOfPieces}`);
          }
          if (i == 0 && j == 1) {
            rowData.push(`${12 * noOfPieces}`);
          }
          if (i == 1 && j == 0) {
            rowData.push(`Delivery`);
          }
          if (i == 1 && j == 1) {
            rowData.push(`${deliveryOptionValue}`);
          }
          // if (i == 2 && j == 0) {
          //   rowData.push(`Total`);
          // }
          // if (i == 2 && j == 1) {
          //   rowData.push(`${total}`);
          // }
        }
        tableData.push(rowData);
      }
    }
    else {
      for (let i = 0; i < 4; i += 1) {
        const rowData = [];
        for (let j = 0; j < 2; j += 1) {

          if (i == 0 && j == 0) {
            rowData.push(`Classic Dishdasha * ${noOfPieces}`);
          }
          if (i == 0 && j == 1) {
            rowData.push(`${12 * noOfPieces}`);
          }
          if (i == 1 && j == 0) {
            rowData.push(`Pickup`);
          }
          if (i == 1 && j == 1) {
            rowData.push(`${fabricOptionValue}`);
          }
          if (i == 2 && j == 0) {
            rowData.push(`Delivery`);
          }
          if (i == 2 && j == 1) {
            rowData.push(`${deliveryOptionValue}`);
          }
          // if (i == 3 && j == 0) {
          //   rowData.push(`Total`);
          // }
          // if (i == 3 && j == 1) {
          //   rowData.push(`${total}`);
          // }
        }
        tableData.push(rowData);
      }
    }
*/

    return (
      <Container>
        <Content>
          <SafeAreaView>
          <ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
              <Image style={{ width: 80, height: 80 }} source={require('../img/om.png')} />
            </View>
            {renderIf(this.state.page == 'OrderDetail')(
              <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 50 }}>
                <View>
                  <Text style={{ fontSize: 22 }}>{screen.title}</Text>
                </View>
              </View>
            )}
            <View style={styles.container}>
              <View style={{width:width-40,}}>
                <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                  <Row data={isRTL?[`${screen.tableTotal}`,`${screen.tableHeadTitle}`]:[`${screen.tableHeadTitle}`,`${screen.tableTotal}`]} widthArr={state.widthArr} style={styles.header} textStyle={styles.textHeader}/>
                </Table>
                <ScrollView style={styles.dataWrapper}>
                  <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                    {
                      tableData.map((rowData, index) => (
                        <Row
                          key={index}
                          data={rowData}
                          widthArr={state.widthArr}
                          style={[styles.row, index % 2 && { backgroundColor: '#F7F6E7' }]}
                          textStyle={styles.text}
                        />
                      ))
                    }
                  </Table>
                  {fabrics?fabrics.length?<Table borderStyle={{ borderColor: '#C1C0B9' }}>
                    <TableWrapper style={{flexDirection: 'row'}}>
                      <Col data={[`${screen.fabricsText}`]} style={{backgroundColor: '#0451A5',height:userCart?null:0}} textStyle={{padding:5,color:'white', alignSelf: 'center'}} />
                    </TableWrapper>
                  </Table>:null:null}
                  <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                    {
                      fabrics.map((item,index)=>(
                          <Row
                              key={index}
                              data={item}
                              widthArr={state.widthArr}
                              style={[styles.row, index % 2 && { backgroundColor: '#F7F6E7' }]}
                              textStyle={styles.text}
                          />
                      ))
                    }
                    <Row
                        data={!isRTL?([`${screen.tableTotal}`, total+' KD']):([total+' KD', `${screen.tableTotal}`])}
                        widthArr={state.widthArr}
                        style={[styles.row, { backgroundColor: '#F7F6E7' }]}
                        textStyle={styles.text}
                    />
                  </Table>
                </ScrollView>
              </View>
            </View>

            <View>
              <Text style={{ fontSize: 20, textAlign: 'center' }}>{screen.expected} {delivery_date}</Text>
            </View>
            {renderIf(this.state.page == 'OrderDetail')(
              <View style={{ marginTop: 30, marginBottom: 30, flexDirection: 'row', justifyContent: 'center' }}>
                <Button style={{ borderRadius: 15, borderWidth: 2, backgroundColor: '#0451A5', minHeight: 40, minWidth: width - 80, justifyContent: 'center', }}
                  onPress={() => this.submitForm(total, noOfPieces)}>
                  <Text style={{ fontSize: 18, color: 'white' }}>{screen.paypal}</Text>
                </Button>
              </View>
            )}
            <View style={{marginBottom: 30, flexDirection: 'row', justifyContent: 'center' }}>
              <Button style={{ borderRadius: 15,  minWidth: width - 80, minHeight: 40, borderWidth: 2, backgroundColor: '#0451A5', paddingRight: 5, paddingLeft: 5, justifyContent: 'center' }}
                      onPress={() => { this.sendDetails(total, delivery_date)}}>
                <Text style={{ fontSize: 18, color: 'white' }}>{screen.knet}</Text>
              </Button>
            </View>

            {renderIf(this.state.page == 'OrderConfirm')(
              <View style={{ marginTop: 30, marginBottom: 30, flexDirection: 'row', justifyContent: 'center' }}>
                <Button style={{ borderRadius: 15, borderWidth: 2, backgroundColor: '#0451A5', height: 40, width: width - 140, justifyContent: 'center' }} onPress={() => this.props.navigation.navigate('login')}>
                  <Text style={{ fontSize: 20, color: 'white' }}>Ok</Text>
                </Button>
              </View>
            )}
            </ScrollView>
          </SafeAreaView>
        </Content>
      </Container>
    );
  }

}
const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 20, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'center',alignItems:'center' },
  header: { height: 50, backgroundColor: '#0451A5' },
  textHeader: { textAlign: 'center', fontWeight: '500', color: 'white' },
  text: { textAlign: 'center', fontWeight: '100' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#E7E6E1' }
});
