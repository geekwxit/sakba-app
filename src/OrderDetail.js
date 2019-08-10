import React, { Component } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, ScrollView, Linking, BackHandler } from 'react-native';
import { Button, Container, Content } from 'native-base';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import PayPal from 'react-native-paypal-wrapper';
import renderIf from 'render-if';
import AxiosInstance from '../axios_instance';

const { width, height } = Dimensions.get('window');

export default class OrderDetail extends Component<Props>{
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 },
      headerTintColor: '#fff',
    };
  };
  constructor(props) {
    super(props)

    var id = this.props.navigation.state.params.id;
    var token = this.props.navigation.state.params.token;
    this.state = {
      tableHead: ['Product / Service', 'Total'],
      widthArr: [180, 125],
      page: 'OrderDetail', emailId: '',
      id: id,
    };
    this.url = "http://sakba.net/payment.php?Sid=" + id + "&&token=" + token;

  }
  componentDidMount() {
    var mobileNo = this.props.navigation.state.params.mobileNo;
    console.warn('mobileNo', mobileNo);

    const url = 'http://sakba.net/mobileApi/get-email.php';
    data = JSON.stringify({
      no: mobileNo,
    })
    fetch(url, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
      body: data
    })
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({ emailId: responseData.email })
      })
      .catch((error) => {
        console.log("Error");
        console.warn('errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');

      });

    const url2 = 'http://sakba.net/mobileApi/order-id.php';
    fetch(url2, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
    })
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({ orderId: responseData.order_id })
      })
      .catch((error) => {
        console.log("Error");
        console.warn(' order-id errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');

      });

  }
  submitForm(total, noOfPieces) {

    // Linking.openURL(this.url);


    this.props.navigation.navigate('paypal', { url: this.url })

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
  async secondCallForPayment(data) {
    // try{
    //   const response = await AxiosInstance.post(,{
    //     ID , confirm
    //   })
    // }catch(e){
    //   console.log(e)
    // }
  }



  render() {
    const state = this.state;
    const { navigation } = this.props;
    const noOfPieces = navigation.getParam('noOfPieces', 'NO-ID');
    const fabricOptionValue = navigation.getParam('fabricOptionValue', 'NO-ID');
    const deliveryOptionValue = navigation.getParam('deliveryOptionValue', 'NO-ID');
    const delivery_date = navigation.getParam('delivery_date', 'NO-ID')
    console.log(delivery_date);
    const total = 12 * noOfPieces + fabricOptionValue + deliveryOptionValue;

    const customerName = navigation.getParam('customerName', '');
    const measurementDate = navigation.getParam('measurementDate', '');

    const tableData = [];

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
          if (i == 1 && j == 0) {
            rowData.push(`Total`);
          }
          if (i == 1 && j == 1) {
            rowData.push(`${total}`);
          }
        }
        tableData.push(rowData);
      }
    } else
      if (deliveryOptionValue == 0) {
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
            if (i == 2 && j == 0) {
              rowData.push(`Total`);
            }
            if (i == 2 && j == 1) {
              rowData.push(`${total}`);
            }
          }
          tableData.push(rowData);
        }
      } else
        if (fabricOptionValue == 0) {
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
              if (i == 2 && j == 0) {
                rowData.push(`Total`);
              }
              if (i == 2 && j == 1) {
                rowData.push(`${total}`);
              }
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
              if (i == 3 && j == 0) {
                rowData.push(`Total`);
              }
              if (i == 3 && j == 1) {
                rowData.push(`${total}`);
              }
            }
            tableData.push(rowData);
          }
        }


    return (
      <Container>
        <Content>
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
              <Image style={{ width: 80, height: 80 }} source={require('../img/om.png')} />
            </View>
            {renderIf(this.state.page == 'OrderDetail')(
              <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 50 }}>
                <View>
                  <Text style={{ fontSize: 22 }}>Order Details </Text>
                </View>
              </View>
            )}
            {renderIf(this.state.page == 'OrderConfirm')(

              <View>
                <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
                  <View>
                    <Text style={{ fontSize: 18 }}>Thank you for your order {customerName}</Text>
                    <Text style={{ fontSize: 18 }}> you confirmed the measurement </Text>
                    <Text style={{ fontSize: 18 }}> of {measurementDate} </Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
                  <Text style={{ fontSize: 18 }}>Your order number :</Text>
                  <Text style={{ fontSize: 18 }}>{this.state.orderId}</Text>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
                  <Text style={{ fontSize: 18 }}>Your E-mail ID :</Text>
                  <Text style={{ fontSize: 18 }}>{this.state.emailId}</Text>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
                  <View>
                    <Text style={{ fontSize: 20 }}>Order Details </Text>
                  </View>
                </View>
              </View>

            )}
            <View style={styles.container}>
              <View style={{}}>
                <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                  <Row data={state.tableHead} widthArr={state.widthArr} style={styles.header} textStyle={styles.textHeader} />
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
                </ScrollView>
              </View>
            </View>

            <View>
              <Text style={{ fontSize: 20 , textAlign:'center'}}> Expected Delivery on {delivery_date}</Text>
            </View>
            {renderIf(this.state.page == 'OrderDetail')(
              <View style={{ marginTop: 30, marginBottom: 30, flexDirection: 'row', justifyContent: 'center' }}>
                <Button style={{ borderRadius: 15, borderWidth: 2, backgroundColor: '#0451A5', height: 40, width: width - 140, justifyContent: 'center' }}
                  onPress={() => this.submitForm(total, noOfPieces)}>
                  <Text style={{ fontSize: 20, color: 'white' }}>Pay Now !</Text>
                </Button>
              </View>
            )}
            {renderIf(this.state.page == 'OrderConfirm')(
              <View style={{ marginTop: 30, marginBottom: 30, flexDirection: 'row', justifyContent: 'center' }}>
                <Button style={{ borderRadius: 15, borderWidth: 2, backgroundColor: '#0451A5', height: 40, width: width - 140, justifyContent: 'center' }} onPress={() => this.props.navigation.navigate('login')}>
                  <Text style={{ fontSize: 20, color: 'white' }}>Ok</Text>
                </Button>
              </View>
            )}
          </View>
        </Content>
      </Container>
    );
  }

}
const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 20, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'center' },
  header: { height: 50, backgroundColor: '#0451A5' },
  textHeader: { textAlign: 'center', fontWeight: '500', color: 'white' },
  text: { textAlign: 'center', fontWeight: '100' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#E7E6E1' }
});