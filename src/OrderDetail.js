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
  TouchableHighlight,
  Alert, TextInput
} from 'react-native';
import {Button, Container, Content, Item} from 'native-base';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import PayPal from 'react-native-paypal-wrapper';
import renderIf from 'render-if';
import axios from './axios/AxiosInstance';

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
      id: id, isLoading: false,
      cart: this.props.navigation.getParam('cart',[]),
      isCountNeeded: this.props.navigation.getParam('isCountNeeded',true),
      products: [],
      fabrics: [],
      brands: this.props.navigation.getParam('brands',[]),
      showPromo: false,promo_success: false, discount: 0,
      promo_enabled: false, total:0,
    };
    this.url = "http://sakba.net/payment.php?Sid=" + id + "&&token=" + token;
  }
  componentDidMount() {
    this.setState(prev=>({
      language: this.props.navigation.getParam('language')
    }));
    var mobileNo = this.props.navigation.state.params.mobileNo;
    console.warn('mobileNo', mobileNo);
    this.getEmailAddress(mobileNo);this.getOrderID(mobileNo);
    this.createTable();
  }

  async getEmailAddress(number){
    let data = {
      no: number,
    }
    axios.post('get-email.php',data)
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
    var data = {o_number:mobileNo};
    await axios.post('order-id.php', data)
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
    var data = {token, fullname, ph_number, email, amount, orderID: this.state.orderId};
    var params = {
      measurement: this.props.navigation.getParam('measurement',null),
      language: this.state.language,
      token: token,
      customerName: fullname,
      emailID: email,
      totalAmount: amount,
      orderID: this.state.orderId,
      deliveryDate: deliveryDate
    };
    this.sendApiRequest(data).then(()=>{
      this.props.navigation.navigate('order_confirm', params)
    })
  }

  async sendApiRequest(data) {
    var screen = this.state.language.orderDetail;
    //this.setState({ isLoading: true })
    //try {
    //Assign the promise unresolved first then get the data using the json method.
    await axios.post('requestPayment.php', data)
        .then(response=>{return response.data})
        .then(response=>{
          console.log("sender", data);
          console.log("receiver", response);
        })
        .catch(e=>{
          this.setState({ isLoading: false });
          Alert.alert(screen.alertTitle, screen.error, [
            {text: screen.alertButton, onPress: ()=>{this.setState({isLoading: false}); this.props.navigation.dispatch(resetAction)}}
          ])
        });
  }

  submitForm(total, noOfPieces) {
    var url = this.url + "&lang=" + this.state.language.getLanguage();
    this.props.navigation.navigate('paypal', { url: url, language: this.state.language})
  }

  filterCart(cart, brands){
    let tempCart = cart.map(item=>{
      let t = {
          brand: item.brand,
          name: (brands[item.brand].name + " ("+brands[item.brand].patterns[item.pattern].colors[item.color].name+")"),
          quantity: item.quantity,
          price: brands[item.brand].price
    }
      if(!this.state.isCountNeeded){
        t.measurement = item.measurement
      }
      return t;
    })
    return tempCart.length?tempCart:null;
  }

  async applyPromo(promo){
    if(promo.trim()){
      await axios.get('apply_promo?promo='+promo+'&order_id='+this.state.orderId)
          .then(response=>response.data)
          .then(response=>{
            if(response.promo_success){
              console.log("dis:", response.discount)
              this.setState({promo_enabled: true,promo_success: true, discount: response.discount})
            } else {
              alert(response.msg);
              this.setState({promo_enabled: false,promo_success: false,discount: 0});
            }
          })
          .catch(e=>{
            Alert.alert(this.state.language.commonFields.alertTitle, this.state.language.fabricScreen.commonError, [{text: this.state.language.commonFields.okButton}])
          })
    } else {
      Alert.alert(this.state.language.commonFields.alertTitle, this.state.language.orderDetail.promoAlert, [{text: this.state.language.commonFields.okButton}])
    }
  }

  togglePromo(){
    this.setState(prev=>({showPromo:!prev.showPromo}));
  }

  async removePromo(){
    await axios.get('apply_promo?removePromo=true&&order_id='+this.state.orderId)
        .then(response=>response.data)
        .then(response=>{
          if(response.promo_success){
            this.setState({promo_success: false, discount: 0, promo_enabled: false})
          }
        })
        .catch(e=>{
          this.setState({promo_success: false, discount: 0,promo_enabled: false})
          // Alert.alert(this.state.language.commonFields.alertTitle, this.state.language.fabricScreen.commonError, [{text: this.state.language.commonFields.okButton}])
        })
  }

  createTable(){
    const isRTL = this.state.language.isRTL;
    const {navigation} = this.props;
    const fabricPickupCharge = parseFloat(navigation.getParam('fabricPickupCharge', 0));
    const deliveryCharge = parseFloat(navigation.getParam('deliveryCharge', 0));
    const samplePickupCharge = parseFloat(navigation.getParam('samplePickupCharge', 0));
    const noOfPieces = parseInt(navigation.getParam('noOfPieces', 0));
    const m = parseFloat(navigation.getParam('measurement', 0));
    const screen = this.state.language.orderDetail;
    var total = 12 * noOfPieces + fabricPickupCharge + deliveryCharge + samplePickupCharge;
    let products = [], fabrics = [];
    this.state.cart.forEach(item=>{
      if(item.isFabric){
        if(this.state.isCountNeeded){
          total += parseFloat(item.quantity*item.price*m);
        } else {
          total += parseFloat(item.quantity*item.price*item.measurement);
        }
        fabrics.push(item);
      } else if (item.isProduct) {
        total += parseFloat(item.quantity*item.price);
        products.push(isRTL?
            [parseFloat(item.quantity*item.price).toFixed(2) + ' KD ', item.name + ' * ' + item.quantity]:
            [item.name + ' * ' + item.quantity,parseFloat(item.quantity*item.price).toFixed(2) + ' KD ']
        )
      }
    })
    fabrics = this.filterCart(fabrics, this.state.brands);
    fabrics = fabrics?fabrics:[];
    if(this.state.isCountNeeded){
      fabrics = fabrics.map(item=>(isRTL?
          [parseFloat(item.quantity*item.price*m).toFixed(2)+ ' KD ', item.name + ' * ' + item.quantity]:
          [item.name + ' * ' + item.quantity, parseFloat(item.quantity*item.price*m).toFixed(2)+ ' KD ']
      ))
    } else {
      fabrics = fabrics.map(item=>(isRTL?
          [parseFloat(item.quantity*item.price*item.measurement).toFixed(2)+ ' KD ', item.name + ' * ' + item.quantity]:
          [item.name + ' * ' + item.quantity, parseFloat(item.quantity*item.price*item.measurement).toFixed(2)+ ' KD ']
      ))
    }

    console.log(fabrics, products, total);
    this.setState({fabrics, products, total});
  }

  render() {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    const {navigation} = this.props;
    var isRTL = this.state.language.isRTL;
    var screen = this.state.language.orderDetail;
    const state = this.state;
    const noOfPieces = parseFloat(navigation.getParam('noOfPieces', 0));
    const fabricPickupCharge = parseFloat(navigation.getParam('fabricPickupCharge', 0));
    const deliveryCharge = parseFloat(navigation.getParam('deliveryCharge', 0));
    const samplePickupCharge = parseFloat(navigation.getParam('samplePickupCharge', 0));
    let {total, products, fabrics, discount} = this.state;
    const delivery_date = this.props.navigation.getParam('delivery_date', null);
    let tableData = [], deliveryOptions = [];

    noOfPieces?tableData.push(!isRTL?([`${screen.tableDishdasha} ${noOfPieces}`, `${noOfPieces*12} KD`]):([`${noOfPieces*12} KD`, `${screen.tableDishdasha} ${noOfPieces}`])):null
    samplePickupCharge?deliveryOptions.push(isRTL?
        [samplePickupCharge, screen.tableSamplePickup]:
        [screen.tableSamplePickup, samplePickupCharge]
    ):null;
    deliveryCharge?deliveryOptions.push(isRTL?
        [deliveryCharge, screen.tableDelivery]:
        [screen.tableDelivery, deliveryCharge]
    ):null;
    fabricPickupCharge?deliveryOptions.push(isRTL?
        [fabricPickupCharge, screen.tablePickup]:
        [screen.tablePickup,  fabricPickupCharge]
    ):null;
    discount?deliveryOptions.push(isRTL?
        [-parseFloat(discount).toFixed(2) +' KD',screen.tableDiscount]:
        [screen.tableDiscount, -parseFloat(discount).toFixed(2) +' KD']
    ):null;
    total -= discount;
    return (
      <Container>
        <Content>
          <SafeAreaView>
          <ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
              <Image style={{ width: 80, height: 80 }} source={require('../img/om.png')} />
            </View>
              <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 50 }}>
                <View>
                  <Text style={{ fontSize: 22 }}>{screen.title}</Text>
                </View>
              </View>
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
                    {
                      products.map((item,index)=>(
                          <Row
                              key={index}
                              data={item}
                              widthArr={state.widthArr}
                              style={[styles.row, index % 2 && { backgroundColor: '#F7F6E7' }]}
                              textStyle={styles.text}
                          />
                      ))
                    }
                  </Table>
                  {fabrics?fabrics.length?<Table borderStyle={{ borderColor: '#C1C0B9' }}>
                    <TableWrapper style={{flexDirection: 'row'}}>
                      <Col data={[`${screen.fabricsText}`]} style={{backgroundColor: '#0451A5',height:fabrics?null:0}} textStyle={{padding:5,color:'white', alignSelf: 'center'}} />
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
                    {deliveryOptions.map(item=>
                        <Row
                            data={item}
                            widthArr={state.widthArr}
                            style={[styles.row, { backgroundColor: '#F7F6E7' }]}
                            textStyle={styles.text}
                        />)
                    }
                  <Row
                        data={!isRTL?([`${screen.tableTotal}`, parseFloat(total).toFixed(2)+' KD']):([parseFloat(total).toFixed(2)+' KD', `${screen.tableTotal}`])}
                        widthArr={state.widthArr}
                        style={[styles.row, { backgroundColor: '#F7F6E7' }]}
                        textStyle={styles.text}
                    />
                  </Table>
                </ScrollView>
              </View>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center', margin:10}}>
              {!this.state.showPromo?
                  <View style={{borderWidth:2, borderColor:'#0451A5'}}>
                    <Item style={{padding:0,transform:[{scaleX: isRTL?-1:1}], height: 40,
                      width: width*0.8, backgroundColor: '#ffffff', justifyContent: 'space-between'}}>
                        <Text style={{fontWeight:'bold',color:'#0451A5',fontSize:18, transform:[{scaleX: isRTL?-1:1}]}}>{screen.havePromo}</Text>
                      <TouchableHighlight activeOpacity={0.6}
                                          underlayColor={'rgba(4,96,195,0.43)'}
                                          onPress={()=>this.togglePromo()} style={{paddingHorizontal:10, backgroundColor: '#0451A5', height:'100%', justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#fff',transform:[{scaleX: isRTL?-1:1}]}}>{screen.enterCode}</Text>
                      </TouchableHighlight>
                    </Item>
                  </View>:
                  <View style={{margin:10,flexDirection:'row', alignSelf:'center', alignItems:'center'}}>
                    {!isRTL && <Input disabled={this.state.promo_enabled} value={this.state.promo} isRTL={isRTL} maxLength={20} label={screen.promoLabel} onChangeText={(promo)=>this.setState({promo})}/>}
                    <TouchableOpacity onPress={()=>this.state.promo_success?this.removePromo():this.applyPromo(this.state.promo)} style={{marginHorizontal:10,justifyContent:'center',alignItems:'center'}}>
                      {!this.state.promo_success?<Image source={require('../img/tick.png')} style={{width:35, height:35, resizeMode:'contain'}} />:
                          <Image source={require('../img/cross.png')} style={{width:35, height:35, resizeMode:'contain'}} />}
                    </TouchableOpacity>
                    {isRTL && <Input disabled={this.state.promo_enabled} value={this.state.promo} isRTL={isRTL} maxLength={20} label={screen.promoLabel} onChangeText={(promo)=>this.setState({promo})}/>}
                  </View>
              }
            </View>
            {delivery_date && <View>
              <Text style={{ fontSize: 20, textAlign: 'center' }}>{screen.expected} {delivery_date}</Text>
            </View>}
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

export const Input = ({value, disabled,keyboardType, onChangeText, label, isRTL, maxLength = 30}) => (
    <Item style={{transform:[{scaleX: isRTL?-1:1}],marginLeft: 0, height: 40, width: width*0.6, backgroundColor: '#d1e2ff'}}>
      <View style={{paddingHorizontal:10, backgroundColor: '#0451A5', height:'100%', justifyContent:'center',alignItems:'center'}}>
        <Text style={{color:'#fff',transform:[{scaleX: isRTL?-1:1}]}}>{label}</Text>
      </View>
      <TextInput editable={!disabled} selectionColor={'rgba(4,101,227,0.44)'}
                 style={{paddingHorizontal:10,flex: 1,
                   textAlign: isRTL ? 'right' : 'left',
                   transform:[{scaleX: isRTL?-1:1}],
                   height: 50, fontSize: 15}}
                 keyboardType={keyboardType} value={value}
                 onChangeText={(text)=>onChangeText(text)} maxLength={maxLength}/>
    </Item>
)
