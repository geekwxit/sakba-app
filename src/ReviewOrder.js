import React, { Component } from 'react';
import {
  Animated,
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  BackHandler,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
    others = navigation.getParam('language').isRTL?
        {headerRight: <Text style={{color:'white', fontSize: 20%(width*height), padding: 15}}>{navigation.getParam('language').reviewScreen.screenTitle}</Text>}:
        {title: navigation.getParam('language').reviewScreen.screenTitle}
    return {
      headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 },
      headerTintColor: '#fff',
      headerLeft: null,
      ...others
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      heightController: new Animated.Value(0),
      showMoreIndex: null,
      total: 0,
      measurement: props.navigation.getParam('measurement', null),
      cart:[],
      language: props.navigation.getParam('language'),
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
    this.setState({language: this.props.navigation.getParam('language')})
    this.getOrder().then(()=>this.setState({isLoading:false}));
  }

  async getOrder(){
    var screen = this.state.language.reviewScreen;
    var isRTL = this.state.language.isRTL;
    this.setState({isLoading:true});
    var url = 'https://sakba.net/mobileApi/get_order_copy.php?lang='+this.state.language.getLanguage();
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
              response.more_details.length?this.setState({cart: response.more_details}):0;
              this.setState({total: o.o_subtotal});
              console.log("ooooo", o);
              var rows = [
                !isRTL?[screen.oID, o.o_id]:[o.o_id, screen.oID],
                !isRTL?[screen.item_name,screen.classic]:[screen.classic, screen.item_name],
                !isRTL?[screen.quantity, o.o_pieces]:[ o.o_pieces, screen.quantity],
                !isRTL?[screen.item_price, o.o_total + " KD"]:[o.o_total + " KD", screen.item_price],
                o.o_pickup=='pickup'?!isRTL?[screen.pickup, screen.pickupCharge]:[screen.pickupCharge, screen.pickup]:null,
                o.o_delivery=='home'?!isRTL?[screen.delivery, screen.deliveryCharge]:[screen.deliveryCharge, screen.delivery]:null,
                o.o_delivery=='home'?!isRTL?[screen.expected, this.state.deliveryDate]:[this.state.deliveryDate, screen.expected]:null,
                // !isRTL?[screen.subtotal, o.o_subtotal + " KD"]:[o.o_subtotal + " KD", screen.subtotal]
              ];
              this.setState({tableData: rows})
              this.setState({ordersAvailable: true});
            }
          })
          .catch(e=>
              {console.log(e);this.setState({ordersAvailable: false})})
    }
    else{
      Alert.alert(this.state.language.commonFields.alertTitle, screen.error, [{text: this.state.language.commonFields.okButton}]);
      // alert(screen.error);
    }
  }


  render() {
    var screen = this.state.language.reviewScreen;
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    var isRTL = this.state.language.isRTL;
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
          (<SafeAreaView>
            <ScrollView style={[styles.dataWrapper, {height:height}]}>
              <View style={{alignItems: 'center', marginTop: 40}}>
                <View style={[styles.header, {width: WIDTH*2, justifyContent: 'center'}]}>
                  <Text style={[styles.textHeader, {fontSize: 20}]}>{screen.tableHeadTitle}</Text>
                </View>
                <Table borderStyle={{borderColor:'#C1C0B9'}}>

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
                {
                  this.state.cart.length?
                <Table borderStyle={{borderColor: '#C1C0B9'}}>
                  <TableWrapper style={{flexDirection: 'row'}}>
                    <Col data={[screen.fabricsText]} style={{backgroundColor: '#0451A5'}} textStyle={{padding:5,color:'white', alignSelf: 'center'}}/>
                  </TableWrapper>
                  {this.state.cart.map((item,index)=>{
                    bName = item.brand_name + " * " + this.state.measurement*item.quantity + "m";
                    price = item.brand_price*item.quantity*this.state.measurement;
                     return (
                          <Row
                          key={index}
                          data={isRTL?[price, bName]:[bName, price]}
                          widthArr={state.widthArr}
                          style={[styles.row, 2 % 2 && { backgroundColor: '#F7F6E7' }]}
                          textStyle={styles.text}
                      />
                    )}
                  )}
                  {/*<Row*/}
                  {/*    data = {['Total',this.state.total]}*/}
                  {/*    widthArr = {state.widthArr}*/}
                  {/*    style={[styles.row, {backgroundColor: '#0451A5'}]}*/}
                  {/*    textStyle={[styles.text,{color:'#fff',fontWeight: 'bold', fontSize:15}]}*/}
                  {/*/>*/}
                </Table>:null}
                <Table borderStyle={{borderColor: '#C1C0B9'}}>
                  <Row
                      data = {isRTL?[this.state.total,screen.total]:[screen.total,this.state.total]}
                      widthArr = {state.widthArr}
                      style={[styles.row, {backgroundColor: '#0451A5'}]}
                      textStyle={[styles.text,{color:'#fff',fontWeight: 'bold', fontSize:15}]}
                  />
                </Table>
              </View>
            </ScrollView>
          </SafeAreaView>):
          (<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 20}}>{screen.orderUnable}</Text>
            <TouchableOpacity onPress={()=>this.getOrder().then(()=>this.setState({isLoading: false}))}>
              <View style={{padding: 10,paddingLeft: 20,marginTop: 20, paddingRight: 20, alignItem:'center',justifyContent:'center', borderRadius: 10, backgroundColor: '#0451A5'}}>
                <Text style={{color: 'white', fontSize: 20}}>{screen.retryButton}</Text>
              </View>
            </TouchableOpacity>
          </View>)
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


{/**When click to expand functionality is used, use this component**/
  /*
  showMore(index){
      this.hideOther();
      setTimeout(()=>{
      if(!(index==this.state.showMoreIndex)){
        this.setState({showMoreIndex: index});
        Animated.timing(this.state.heightController,
            {toValue: 20, duration: 500}).start();
      }}, 200);
  }
  hideOther(){
    Animated.timing(this.state.heightController,
        {toValue: 0, duration: 200}).start();
  }

  <TouchableWithoutFeedback onPress={()=>this.showMore(index)}>
          <View>
          <Row
              key={index}
              data={[item.brand_name + ` * ${this.state.measurement*item.quantity} m`,item.brand_price*item.quantity*this.state.measurement]}
              widthArr={state.widthArr}
              style={[styles.row, 2 % 2 && { backgroundColor: '#F7F6E7' }]}
              textStyle={styles.text}
          />
          {
          this.state.showMoreIndex===index && (<Animated.View style={{height:this.state.heightController}}>
            <Text></Text>
          </Animated.View>)
          }
          </View>
        </TouchableWithoutFeedback>*/}
