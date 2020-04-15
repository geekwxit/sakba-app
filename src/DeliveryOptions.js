import React, { Component } from 'react';
import { View, Alert, Text, Image, Dimensions, ActivityIndicator, Modal, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Form, Item, Input, Container, Content, Button, Radio, Icon, Textarea } from 'native-base';
import renderIf from 'render-if';
import PayPal from 'react-native-paypal-wrapper';
import CustomRadioButton from 'react-native-vector-icons/MaterialCommunityIcons';
// import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import RadioForm from "./components/RadioForm";
import axios from './axios/AxiosInstance';
import Store from "./CommonStore/Store";

const { width, height } = Dimensions.get('window');
const address = {
    area:'', block:'', street:'', jada: '', house: '',
    floor:'', apartment: '', extra_Number: '', enabled: false
}
const initialState = {
    charcount:0, remarks: '', isLoading: false,
    response: [], msg: '', delivery_date: '',
    noOfPieces: 0, mobileNo: null, inHomeCount : 0, outsideCount: 0,
    cart:  [], fabrics : null,
    sampleAddress: {...address}, pickupAddress: {...address},
    deliveryAddress: {...address},
    measurementDone: true, pickupShop: 0,
}
export default class DeliveryOptions extends Component<Props>{

    static navigationOptions = ({ navigation }) => {
        others = navigation.getParam('language').isRTL?
            {headerRight: <Text style={{color:'white', fontSize: 20%(width*height), padding: 15}}>{navigation.getParam('language').deliveryScreen.screenTitle}</Text>}:
            {title: navigation.getParam('language').deliveryScreen.screenTitle}
        return {
            headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 },
            headerTintColor: '#fff',
            ...others
        };
    };
    constructor(props) {
        super(props)
        this.state = {
            ...initialState,
            noOfPieces: props.navigation.getParam('noOfPieces'),
            mobileNo: this.props.navigation.getParam('mobileNo', null),
            language: props.navigation.getParam('language'),
            inHomeCount : props.navigation.getParam('inHomeCount', 0),
            outsideCount: props.navigation.getParam('outsideCount', 0),
            cart: props.navigation.getParam('cart', []),
            fabrics : props.navigation.getParam('fabrics', null),
            measurementDone: this.props.navigation.getParam('measurementDone'),
            isCountNeeded: this.props.navigation.getParam('isCountNeeded', true),
            name : '', email: '', phone: ''
        };
    }
    componentDidMount() {
        this.setState({language: this.props.navigation.getParam('language')});
    }

    submitForm() {
        console.log(this.state);
       var cartTotal = 0;
        const {shippingCharges: {pickupCharges,deliveryCharges,sampleCharges}} = Store.store;
       let validated = false;
        var screen = this.state.language.deliveryScreen;
        var addresses = {};
        var fabrics = [], products = [];
        const {
            pickupAddress: {
                area:p_area, block:p_block, street:p_street,
                jada:p_jada, house: p_house, floor:p_floor,
                apartment:p_apartment, extra_Number: p_extra_number,
                enabled: pickup
            },
            deliveryAddress: {
                area:d_area, block:d_block, street:d_street,
                jada:d_jada, house: d_house, floor:d_floor,
                apartment:d_apartment, extra_Number: d_extra_number,
                enabled: delivery
            },
            sampleAddress: {
                area:s_area, block:s_block, street:s_street,
                jada:s_jada, house: s_house, floor:s_floor,
                apartment:s_apartment, extra_Number: s_extra_number,
                enabled: sample
            },remarks, fabrics: brands, cart, name, email, phone
        } = this.state;

        const sampleAddress = {s_area, s_block,  s_street, s_jada, s_house, s_floor, s_apartment, s_extra_number,}
        const pickupAddress = {p_area, p_block,  p_street, p_jada, p_house, p_floor, p_apartment, p_extra_number,}
        const deliveryAddress = {d_area, d_block,  d_street, d_jada, d_house, d_floor, d_apartment, d_extra_number,}
        // const deliveryOptions = { pickup_type: pickup?'pickup':'send', o_pickup_charge: pickup?3:0,
        //     delivery_type: delivery?'home':'self', o_delivery_charge: delivery?3:0,
        //     sample_type: sample?'pickup':'send', o_sample_charge: sample?3:0};
        const deliveryOptions = { pickup_type: pickup?'pickup':'send', o_pickup_charge: pickup?parseFloat(pickupCharges):0,
            delivery_type: delivery?'home':'self', o_delivery_charge: delivery?parseFloat(deliveryCharges):0,
            sample_type: sample?'pickup':'send', o_sample_charge: sample?parseFloat(sampleCharges):0};
        addresses = pickup?{...addresses, ...pickupAddress}:addresses;
        addresses = sample?{...addresses, ...sampleAddress}:addresses;
        addresses = delivery?{...addresses, ...deliveryAddress}:addresses;

        subTotal = (12 * this.state.noOfPieces);
        var customerName = this.props.navigation.state.params.customerName;
        var measurementDate = this.props.navigation.state.params.measurementDate;
        var emailAddr = this.props.navigation.state.params.emailID;
        var others = {
            measurement: this.props.navigation.getParam('measurement'),
            cart,brands, language: this.state.language,
            noOfPieces: this.state.noOfPieces,
            fabricPickupCharge:deliveryOptions.o_pickup_charge,
            deliveryCharge:deliveryOptions.o_delivery_charge,
            samplePickupCharge:deliveryOptions.o_sample_charge,
            customerName: customerName,
            measurementDate: measurementDate,
            mobileNo: this.state.mobileNo,
            emailID: emailAddr,
        }
        console.log("ret",others);
        this.state.cart.forEach(item=>{
            if(item.isFabric){
                if(this.state.isCountNeeded){
                    cartTotal += item.quantity*item.price*others.measurement;
                    fabrics.push({
                        brandID: brands[item.brand].id,
                        patternID: brands[item.brand].patterns[item.pattern].id,
                        colorID: brands[item.brand].patterns[item.pattern].colors[item.color].id,
                        quantity: item.quantity,
                        measurement: others.measurement
                    })
                } else {
                    cartTotal += item.quantity*item.price*item.measurement;
                    fabrics.push({
                        brandID: brands[item.brand].id,
                        patternID: brands[item.brand].patterns[item.pattern].id,
                        colorID: brands[item.brand].patterns[item.pattern].colors[item.color].id,
                        quantity: item.quantity,
                        measurement: item.measurement,
                    })
                }
            } else if(item.isProduct){
                cartTotal += item.quantity*item.price;
                products.push(item);
            }
        })
        otherFabrics = {
            inHomeCount: this.state.inHomeCount,
            outsideCount: this.state.outsideCount,
        }

        const data = {
            name, email, phone,
            o_pieces: this.state.noOfPieces,
            o_total: subTotal +
                deliveryOptions.o_pickup_charge +
                deliveryOptions.o_delivery_charge +
                deliveryOptions.o_sample_charge +
                cartTotal,
            o_number: this.state.mobileNo,
            o_subtotal: subTotal,fabrics,
            products,remarks: this.state.remarks,
            d_store_name: !delivery?(!parseInt(this.state.pickupShop)?"Awquaf Complex":"Qurain Shop"):"",
            ...deliveryOptions, ...addresses
        }
        if(pickup || delivery || sample){
            validated = (pickup?!this.validateFields(p_area, p_block, p_house, p_street):true) &&
            (delivery?!this.validateFields(d_area, d_block, d_house, d_street):true) &&
            (sample?!this.validateFields(s_area, s_block, s_house, s_street):true);
            !validated && Alert.alert(this.state.language.commonFields.alertTitle, screen.detailsRequired, [{text: this.state.language.commonFields.okButton}]);
        } else if(!this.state.isCountNeeded && this.validateFields(name, email, phone)) {
            validated = false;
        } else {
            validated = true;
        }
        if(validated) {
            console.log(data);
            axios.post('order_test.php', data)
                .then((response) => response.data)
                .then(responseData=>{
                    if(responseData.error){
                        alert(responseData.msg);
                    } else {
                    this.setState({emailId: responseData.email},()=>this.props.navigation.navigate('order_detail',
                        {
                            isCountNeeded: this.state.isCountNeeded,
                        id: responseData.id,
                        token: responseData.token,
                            delivery_date: responseData.delivery_date,
                        ...others
                        })
                    )
                    }
                })
        } else {
            alert("Please fill details!");
        }
    }

    validateFields(){
        var empty =0;
        var ar = Object.assign([], arguments);
        ar.forEach(a=>a.trim().length==0?empty++:0);
        return empty;
    }

    render() {
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;
        var screen = this.state.language.deliveryScreen;
        const isRTL = this.state.language.isRTL;
        const {shippingCharges: {pickupCharges,deliveryCharges,sampleCharges}} = Store.store;
        const {shippingCharges} = Store.store;
        // let pickupCharge = 0,  = 0, sampleCharge=0;
        console.log(shippingCharges)
        return (
            <SafeAreaView>
                <ScrollView>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 50 }}>
                        <Image style={{ width: 80, height: 80 }} source={require('../img/om.png')} />
                    </View>
                    <View style={{ marginTop:20, flexDirection: 'column', marginHorizontal: 40 }}>
                        {!this.state.measurementDone && this.state.isCountNeeded && <AddressOption
                            label={'Your Sample :'}
                            setValue={(value)=>this.setState(prev=>({sampleAddress: {...prev.sampleAddress, ...value}}))}
                            values={this.state.sampleAddress}
                            showAddress={this.state.sampleAddress.enabled} isRTL={isRTL} screen={screen}
                            radioOptions={[{ label: screen.sendFabric, value: 0 },
                                { label: screen.pickup + (parseFloat(sampleCharges)?` "${sampleCharges} KD Extra`:""), value: 1 }]}
                            toggle={()=>this.setState(prev=>({sampleAddress: {...prev.sampleAddress, enabled: !prev.sampleAddress.enabled}}))}
                        />}
                        {!(this.state.inHomeCount==this.state.noOfPieces) && this.state.isCountNeeded && <AddressOption
                            style={{marginTop:20}}
                            label={screen.fabricLabel}
                            setValue={(value)=>this.setState(prev=>({pickupAddress: {...prev.pickupAddress, ...value}}))}
                            values={this.state.pickupAddress}
                            showAddress={this.state.pickupAddress.enabled} isRTL={isRTL} screen={screen}
                            radioOptions={[{ label: screen.sendFabric, value: 0 },
                                { label: screen.pickup + (parseFloat(pickupCharges)?` "${pickupCharges} KD Extra"`:""), value: 1 }]}
                            toggle={()=>this.setState(prev=>({pickupAddress: {...prev.pickupAddress, enabled: !prev.pickupAddress.enabled}}))}
                        />}
                        {!this.state.isCountNeeded &&
                            <View>
                                <Text style={{
                                    fontSize: 20,
                                    alignSelf: isRTL ? 'flex-end' : 'flex-start',
                                    textAlign: isRTL ? 'right' : 'auto'
                                }}>Your Details: </Text>
                                <CustomInput label={'Name'} isRTL={isRTL}  onChangeText={(name)=>this.setState({name})} />
                                <CustomInput label={'Phone'} isRTL={isRTL} onChangeText={(phone)=>this.setState({phone})} />
                                <CustomInput label={'Email'} isRTL={isRTL} onChangeText={(email)=>this.setState({email})} />
                            </View>
                        }
                        <AddressOption
                            style={{marginTop:20}}
                            label={screen.deliveryLabel}
                            setValue={(value)=>this.setState(prev=>({deliveryAddress: {...prev.deliveryAddress, ...value}}))}
                            values={this.state.deliveryAddress}
                            showAddress={this.state.deliveryAddress.enabled} isRTL={isRTL} screen={screen}
                            radioOptions={[{ label: screen.opPickup, value: 0 },
                                { label: screen.opHomeDel + (parseFloat(deliveryCharges)?` "${deliveryCharges} KD Extra`:""), value: 1 }]}
                            toggle={()=>this.setState(prev=>({deliveryAddress: {...prev.deliveryAddress, enabled: !prev.deliveryAddress.enabled}}))}>
                            <ExtraOptions isRTL={isRTL} radioOptions={[{ label: screen.opAwqaf, value: 0 },
                                { label: screen.opQurain, value: 1 }]} value={false} toggle={(pickupShop)=>this.setState({pickupShop})}/>
                        </AddressOption>
                           <View style={{borderColor:'#abbee9',
                                borderWidth:1,
                                marginTop:10,
                                borderRadius:5,
                                padding:10,
                                backgroundColor:'#d1e2ff',
                                width: (width / 2 - 40)*2,
                                minHeight: 30,}}>
                                <Text style={{marginBottom:2,flex:1, alignSelf:isRTL?'flex-end':'flex-start',textAlign:isRTL?'right':'left'}}>{screen.pRemarks}</Text>
                                <TextInput
                                    selectionColor={'rgba(4,101,227,0.44)'}
                                    multiline={true}
                                    style={{
                                        textAlign:isRTL?'right':'left',
                                        borderBottomWidth:1,
                                        flex:1,
                                        fontSize: 15 }}
                                    onChangeText={(remarks) => {
                                        this.setState({remarks, charcount: remarks.length})
                                    }}
                                />
                            </View>
                        <View style={{ marginTop: 20, marginBottom: 30, flexDirection: 'row', justifyContent: 'center' }}>
                            <Button
                                style={{ borderRadius: 15, borderWidth: 2, backgroundColor: '#0451A5', height: 40, width: width - 80, justifyContent: 'center' }}
                                onPress={() => this.submitForm()}>
                                <Text style={{ fontSize: 18, color: 'white' }}>{screen.orderNowButton}</Text>
                            </Button>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const AddressOption =({children, style, values, radioOptions, isRTL, screen, setValue, showAddress, toggle, extras, label})=>(
    <View style={style}>
        <Text style={{
            fontSize: 20,
            alignSelf: isRTL ? 'flex-end' : 'flex-start',
            textAlign: isRTL ? 'right' : 'auto'
        }}>{label}</Text>
        <View style={{marginTop: 10}}>
            <RadioForm
                isRTL={isRTL}
                buttonSize={10}
                buttonColor={'#0451A5'}
                buttonInnerColor={'#0451A5'}
                buttonOuterColor={'#0451A5'}
                buttonWrapStyle={{marginTop: 10}}
                selectedButtonColor={'#0451A5'}
                labelStyle={{fontSize: 20, marginTop: 0}}
                buttonOuterSize={20}
                buttonStyle={{marginTop: 20}}
                radio_props={radioOptions}
                initial={showAddress}
                value={showAddress?1:0}
                showAtIndex={0}
                onPress={(value) => toggle(value)}>
                {!showAddress?children:null}
            </RadioForm>
        </View>
        {showAddress && <Form style={{flexDirection: 'column', marginTop: 20, marginLeft: 0}}>
            <Text style={{
                fontSize: 18,
                alignSelf: isRTL ? 'flex-end' : 'flex-start',
                textAlign: isRTL ? 'right' : 'auto'
            }}>{screen.addressLabel}</Text>
            <View style={{flexDirection: 'row', marginTop: 5, width: 40}}>
                <AddressItem isRTL={isRTL} value={values.area} placeholder={screen.pArea}
                             setValue={(area) => setValue({area})}/>
                <AddressItem isRTL={isRTL} value={values.block} placeholder={screen.pBlock}
                             setValue={(block) => setValue({block})}/>
            </View>
            <View style={{flexDirection: 'row', marginTop: 5, width: 40}}>
                <AddressItem isRTL={isRTL} value={values.street} placeholder={screen.pStreet}
                             setValue={(street) => setValue({street})}/>
                <AddressItem isRTL={isRTL} value={values.jada} placeholder={screen.pJada}
                             setValue={(jada) => setValue({jada})}/>
            </View>
            <View style={{flexDirection: 'row', marginTop: 5, width: 40}}>
                <AddressItem isRTL={isRTL} value={values.house} placeholder={screen.pHouse}
                             setValue={(house) => setValue({house})}/>
                <AddressItem isRTL={isRTL} value={values.floor} placeholder={screen.pFloor}
                             setValue={(floor) => setValue({floor})}/>
            </View>
            <View style={{flexDirection: 'row', marginTop: 5, width: 40}}>
                <AddressItem isRTL={isRTL} value={values.apartment} placeholder={screen.pApartment}
                             setValue={(apartment) => setValue({apartment})}/>
                <AddressItem isRTL={isRTL} value={values.extra_number} placeholder={screen.pExtra}
                             setValue={(extra_number) => setValue({extra_number})}/>
            </View>
        </Form>}
    </View>
)

const AddressItem=({isRTL, value, placeholder, setValue})=>(
    <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
        <Input
            style={{textAlign:isRTL?'right':'left'}}
            placeholder={placeholder}
            onChangeText={(v)=>setValue(v)}
            value={value}
        />
    </Item>
)

const ExtraOptions=({isRTL, radioOptions, value, toggle})=>(
    <View style={{paddingHorizontal:25}}>
        <RadioForm
            isRTL={isRTL}
            buttonSize={10}
            buttonColor={'#0451A5'}
            buttonInnerColor={'#0451A5'}
            buttonOuterColor={'#0451A5'}
            buttonWrapStyle={{marginTop: 10}}
            selectedButtonColor={'#0451A5'}
            labelStyle={{fontSize: 20, marginTop: 0}}
            buttonOuterSize={20}
            buttonStyle={{marginTop: 20}}
            radio_props={radioOptions}
            initial={0}
            onPress={(value)=>toggle(value)}
        />
    </View>
)

const CustomInput = ({value, keyboardType, onChangeText, label, isRTL, maxLength = 30}) => (
    <Item style={{transform:[{scaleX: isRTL?-1:1}],marginLeft: 0, marginTop: 25, height: 40, width: width*0.8, backgroundColor: '#d1e2ff'}}>
        <View style={{paddingHorizontal:10, backgroundColor: '#0451A5', height:'100%', justifyContent:'center',alignItems:'center'}}>
            <Text style={{color:'#fff',transform:[{scaleX: isRTL?-1:1}]}}>{label}</Text>
        </View>
        <TextInput selectionColor={'rgba(4,101,227,0.44)'}
                   style={{paddingHorizontal:10,flex: 1,
                       textAlign: isRTL ? 'right' : 'left',
                       transform:[{scaleX: isRTL?-1:1}],
                       height: 50, fontSize: 15}}
                   keyboardType={keyboardType} value={value}
                   onChangeText={(text)=>onChangeText(text)} maxLength={maxLength}/>
    </Item>

)
