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
    ActivityIndicator,
  Alert
} from 'react-native';
import { Button, Container, Content } from 'native-base';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import PayPal from 'react-native-paypal-wrapper';
import renderIf from 'render-if';
import axios from 'axios';
import {NavigationActions, StackActions} from "react-navigation";

const {  height,width } = Dimensions.get('window');
const WIDTH = width/2-20;
const rate = 12;

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'login' })],
});

export default class ReviewOrder extends Component<props>{
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 },
      headerTintColor: '#fff',
      title: 'Order Review',
      headerLeft: null
    };
  };
  constructor(props) {
    super(props);
    this.state = {
        tableHead: ['Order Details'],
      widthArr: [ WIDTH,WIDTH ],
      ordersAvailable: false,
      idLoading: true,
      page: 'OrderDetail', emailId: '', isLoading: true,
      orderID: props.navigation.getParam('order_id', null),
      tableData: [], deliveryDate: props.navigation.getParam('deliveryDate', null)
    };
    this.backhandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.dispatch(resetAction);
      return true;
    });
  }
  componentDidMount() {
    this.getOrder().then(()=>this.setState({isLoading:false}));
  }

  async getOrder(){
    this.setState({isLoading:true});
    var url = 'https://sakba.net/mobileApi/get_order.php';
    var data = JSON.stringify({order_id : this.state.orderID});
    if(this.state.orderID!=null && this.state.orderID!=undefined){
      await axios.post(url,data)
          .then((response) => response.data)
          .then(response=>{
            if(response.error){
              this.setState({ordersAvailable: false});
            }
            else{
              var o = response.order_detail;
              console.log("ooooo", o);
              var rows = [
                ['Order ID', o.o_id],
                ['Item Name','Classic Dishdasha'],
                ['Quantity', o.o_pieces],
                ['Item Price', o.o_total + " KD"],
                o.o_pickup=='pickup'?['Pick Up Charges', '3 KD']:null,
                o.o_delivery=='home'?['Delivery Charges', '3 KD']:null,
                o.o_delivery=='home'?['Expected Delivery Date ', this.state.deliveryDate]:null,
                ['Total', o.o_subtotal + " KD"]
              ];
              this.setState({tableData: rows})
              this.setState({ordersAvailable: true});
            }
          })
          .catch(e=>
              {console.log(e);this.setState({ordersAvailable: false})})
    }
    else{
      alert("Something went wrong. Please retry again later!");
    }
  }


  render() {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;


    const state = this.state;
    const { navigation } = this.props;
    const delivery_date = navigation.getParam('delivery_date', 'NO-ID')

    return (
        <View style={{flex: 1}}>
          {this.state.isLoading?
              <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator size={'large'} color={'#0451A5'}/>
              </View>:
              this.state.ordersAvailable?
          <SafeAreaView>
            <ScrollView style={[styles.dataWrapper, {height:height}]}>
              <View style={{alignItems: 'center', marginTop: 40}}>
                <View style={[styles.header, {width: WIDTH*2, justifyContent: 'center'}]}>
                  <Text style={[styles.textHeader, {fontSize: 20}]}>Order Details</Text>
                </View>
                  <Table borderStyle={{ borderColor: '#C1C0B9' }}>

                    {
                      this.state.tableData.map((rowData, index) => (
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
              </View>
            </ScrollView>
          </SafeAreaView>:
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 20}}>Unable to load any orders</Text>
            <TouchableOpacity onPress={()=>this.getOrder().then(()=>this.setState({isLoading: false}))}>
              <View style={{padding: 10,paddingLeft: 20,marginTop: 20, paddingRight: 20, alignItem:'center',justifyContent:'center', borderRadius: 10, backgroundColor: '#0451A5'}}>
                <Text style={{color: 'white', fontSize: 20}}>RETRY</Text>
              </View>
            </TouchableOpacity>
          </View>
          }
        </View>
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
