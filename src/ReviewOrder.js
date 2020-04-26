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
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import axios from './axios/AxiosInstance';
import {NavigationActions, StackActions} from "react-navigation";
import Icon from 'react-native-vector-icons/Ionicons';
import {strings} from "../locales/Language";
import Store from "./CommonStore/Store";
const {  height,width } = Dimensions.get('window');
const WIDTH = width/2-20;
const rate = 12;

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'login' })],
});

export default class ReviewOrder extends Component<props>{
  static navigationOptions = ({ navigation }) => {
      var others = navigation.getParam('language').isRTL?
          {headerRight: <Text style={{color:'white', fontSize: 20%(width*height), padding: 15}}>{navigation.getParam('language').reviewScreen.screenTitle}</Text>}:
          {title: navigation.getParam('language').reviewScreen.screenTitle}
      others = {...others, headerLeft: <Icon onPress={()=>navigation.dispatch(resetAction)} color={'white'} size={25} style={{padding: 15}} name={'ios-arrow-back'}/>};
      return {
        headerStyle:{backgroundColor:'#0451A5',marginLeft:0},
        headerTintColor: '#fff',
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
      fabrics:[],products:[],cart:[],
      language: props.navigation.getParam('language'),
      widthArr: [ WIDTH,WIDTH ],
      ordersAvailable: false,
      idLoading: true,
      noOfPieces: 0,
      page: 'OrderDetail', emailId: '', isLoading: true,
      orderID: props.navigation.getParam('order_id', null),
      tableData: [],
      deliveryDate: props.navigation.getParam('deliveryDate', null),
      discount:0,
      fabricPickupCharge:0, deliveryCharge:0, samplePickupCharge:0,
      brands:[], deliveryOptions: {isPickingSample:false,isDelivering:false,isPickingFabric:false}
    };
    this.backhandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.dispatch(resetAction);
      return true;
    });
  }

  async getBrands(){
    return this.setState({brands: await Store.getFabrics()})
  }

  componentDidMount() {
    this.setState({language: this.props.navigation.getParam('language')})
    this.getBrands();
    this.getOrder()
        .then(()=>{
          this.createTable();
          this.setState({isLoading:false})
        });
  }

  async getOrder(){
    var screen = this.state.language.reviewScreen;
    var isRTL = this.state.language.isRTL;
    this.setState({isLoading:true});
    var url = 'get_order_copy.php?lang='+this.state.language.getLanguage();
    var data = {order_id : this.state.orderID};
    if(this.state.orderID!=null && this.state.orderID!=undefined){
      await axios.post(url,data)
          .then((response) => response.data)
          .then(response=>{
            this.setState({isLoading: false});
            if(response.error){
              this.setState({ordersAvailable: false});
            } else {
                var o = response.order_details;
                response.cart.length?this.setState({cart: response.cart}):0;
                this.setState({
                  total: parseFloat(o.o_total),
                  noOfPieces: parseInt(o.o_pieces),
                  discount: parseFloat(o.o_discount),
                  fabricPickupCharge:parseFloat(o.o_pickup_charge),
                  deliveryCharge:parseFloat(o.o_delivery_charge),
                  deliveryOptions: {isPickingSample:false,isDelivering:o.o_delivery=='home',isPickingFabric:o.o_pickup=='pickup'}
                });
                var rows = [
                  !isRTL?[screen.oID, o.o_id]:[o.o_id, screen.oID],
                  // o.o_pickup=='pickup'?!isRTL?[screen.pickup, screen.pickupCharge]:[screen.pickupCharge, screen.pickup]:null,
                  // o.o_delivery=='home'?!isRTL?[screen.delivery, screen.deliveryCharge]:[screen.deliveryCharge, screen.delivery]:null,
                  // o.o_delivery=='home'?!isRTL?[screen.expected, this.state.deliveryDate]:[this.state.deliveryDate, screen.expected]:null,
                  // !isRTL?[screen.subtotal, o.o_subtotal + " KD"]:[o.o_subtotal + " KD", screen.subtotal]
                ];
                if(this.state.noOfPieces){
                  rows.push(!isRTL?[screen.item_name,screen.classic]:[screen.classic, screen.item_name]);
                  rows.push(!isRTL?[screen.quantity, o.o_pieces]:[ o.o_pieces, screen.quantity]);
                  rows.push(!isRTL?[screen.item_price, o.o_subtotal + " KD"]:[o.o_subtotal + " KD", screen.item_price],);
                }
                this.setState({tableData: rows, ordersAvailable: true})
              }
            })
          .catch(e=>
              {console.log(e);this.setState({ordersAvailable: false})})
    }
    else{
      Alert.alert(this.state.language.commonFields.alertTitle, screen.error, [{text: this.state.language.commonFields.okButton}]);
      // alert(screen.error);
    }
    return true;
  }

  createTable(){
    const isRTL = this.state.language.isRTL;
    const {noOfPieces, fabricPickupCharge, deliveryCharge, samplePickupCharge} = this.state;
    const {navigation} = this.props;
    const m = parseFloat(navigation.getParam('measurement', 0));
    var total = 12 * noOfPieces + fabricPickupCharge + deliveryCharge + samplePickupCharge;
    let products = [], fabrics = [];
    this.state.cart.forEach(item=>{
      if(item.isFabric){
        total += parseFloat(item.quantity*item.brand_price*item.measurement);
        fabrics.push(isRTL?
            [parseFloat(item.quantity*item.brand_price*item.measurement).toFixed(2) + ' KD ', item.brand_name + '(' +item.colour_name+') * ' + item.quantity]:
            [item.brand_name + '(' +item.colour_name+') * ' + item.quantity, parseFloat(item.quantity*item.brand_price*item.measurement).toFixed(2) + ' KD ']
        );
      } else if (item.isProduct) {
        total += parseFloat(item.quantity*item.product_price);
        products.push(isRTL?
            [parseFloat(item.quantity*item.product_price).toFixed(2) + ' KD ', item.product_name + ' * ' + item.quantity]:
            [item.product_name + ' * ' + item.quantity,parseFloat(item.quantity*item.product_price).toFixed(2) + ' KD ']
        )
      }
    })
    // fabrics = this.filterCart(fabrics, this.state.brands);
    // fabrics = fabrics?fabrics:[];
    // fabrics = fabrics.map(item=>[item.brand_name + ' * ' + item.quantity,parseFloat(item.quantity*item.brand_price*m).toFixed(2) + ' KD ']);
    console.log(fabrics, products, total);
    this.setState({fabrics, products, total});
  }

  filterCart(cart, brands){
    let tempCart = cart.map(item=>({
      brand: item.brand,
      name: (brands[item.brand].name + " ("+brands[item.brand].patterns[item.pattern].colors[item.color].name+")"),
      quantity: item.quantity,
      price: brands[item.brand].price
    }))
    return tempCart.length?tempCart:null;
  }


  render() {
    var screen = this.state.language.reviewScreen;
    var screen2 = this.state.language.orderDetail;
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    var isRTL = this.state.language.isRTL;
    const state = this.state;
    const { navigation } = this.props;
    let deliveryOptions = [];
    let {isLoading,samplePickupCharge,deliveryCharge, fabricPickupCharge,
      ordersAvailable,tableData, total, products, fabrics, discount} = this.state;
    const delivery_date = navigation.getParam('delivery_date', '')
    total -= discount;

    samplePickupCharge?deliveryOptions.push(isRTL?
        [samplePickupCharge, screen2.tableSamplePickup]:
        [screen2.tableSamplePickup, samplePickupCharge]
    ):null;
    deliveryCharge?deliveryOptions.push(isRTL?
        [deliveryCharge, screen2.tableDelivery]:
        [screen2.tableDelivery, deliveryCharge]
    ):null;
    fabricPickupCharge?deliveryOptions.push(isRTL?
        [fabricPickupCharge, screen2.tablePickup]:
        [screen2.tablePickup,  fabricPickupCharge]
    ):null;
    discount?deliveryOptions.push(isRTL?
        [-parseFloat(discount).toFixed(2) +' KD',screen2.tableDiscount]:
        [screen2.tableDiscount, -parseFloat(discount).toFixed(2) +' KD']
    ):null;
    return (
        <View style={{flex: 1}}>
          {isLoading?
              <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator size={'large'} color={'#0451A5'}/>
              </View>:
              ordersAvailable?
          (<SafeAreaView>
            <ScrollView style={[styles.dataWrapper, {height:height}]}>
              <View style={{alignItems: 'center', marginTop: 40}}>
                <View style={[styles.header, {width: WIDTH*2, justifyContent: 'center'}]}>
                  <Text style={[styles.textHeader, {fontSize: 20}]}>{screen.tableHeadTitle}</Text>
                </View>
                <Table borderStyle={{borderColor:'#C1C0B9'}}>

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
                  {products.map((item,index)=>{
                    const name = item.product_name;
                    const price = parseFloat(item.product_price*item.quantity).toFixed(2);
                    return (
                        <Row
                            key={index}
                            data={item}
                            widthArr={state.widthArr}
                            style={[styles.row, 2 % 2 && { backgroundColor: '#F7F6E7' }]}
                            textStyle={styles.text}
                        />
                    )}
                  )}
                </Table>
                {
                  fabrics.length?
                <Table borderStyle={{borderColor: '#C1C0B9'}}>
                  <TableWrapper style={{flexDirection: 'row'}}>
                    <Col data={[screen.fabricsText]} style={{backgroundColor: '#0451A5'}} textStyle={{padding:5,color:'white', alignSelf: 'center'}}/>
                  </TableWrapper>
                  {fabrics.map((item,index)=>{
                     return (
                          <Row
                          key={index}
                          data={item}
                          widthArr={state.widthArr}
                          style={[styles.row, 2 % 2 && { backgroundColor: '#F7F6E7' }]}
                          textStyle={styles.text}
                      />
                    )}
                  )}
                </Table>:null}
                {deliveryOptions.map((item,index)=>
                    <Row
                        key={index}
                        data={item}
                        widthArr={state.widthArr}
                        style={[styles.row, 2 % 2 && { backgroundColor: '#F7F6E7' }]}
                        textStyle={styles.text}
                    />
                )}
                <Table borderStyle={{borderColor: '#C1C0B9'}}>
                  <Row
                      data = {isRTL?[`${parseFloat(total).toFixed(2) + ' KD '}`,screen.total]:[screen.total,`${parseFloat(total).toFixed(2) + ' KD '}`]}
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
            <TouchableOpacity onPress={()=>this.getOrder().then(()=>{this.createTable();
              this.setState({isLoading:false})})}>
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
