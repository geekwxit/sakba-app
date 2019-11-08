import React, { Component } from 'react';
import { View, Alert, Text, Image, Dimensions, ActivityIndicator, Modal, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Form, Item, Input, Container, Content, Button, Radio, Icon, Textarea } from 'native-base';
import renderIf from 'render-if';
import PayPal from 'react-native-paypal-wrapper';
import CustomRadioButton from 'react-native-vector-icons/MaterialCommunityIcons';
// import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import RadioForm from "./components/RadioForm";
import axios from 'axios';
import {deliveryStrings} from './Strings';

const { width, height } = Dimensions.get('window');

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
            language: props.navigation.getParam('language'),
            isLoading: false,
            pickupStore: null,
            sendFabric: true, homeDelivery: true,
            p_area: '', p_street: '', p_jada: '', p_floor: '', p_block: '', p_apartment: '',
            p_extra_Number: '', p_house: '',
            d_area: '', d_street: '', d_jada: '', d_floor: '', d_block: '', d_apartment: '',
            d_extra_Number: '', d_house: '',
            area: '', street: '', jada: '', floor: '', block: '', apartment: '', extra_Number: '', house: '',
            itemSelected: 'itemTwo', noOfPieces: props.navigation.getParam('noOfPieces'), mobileNo: this.props.navigation.getParam('mobileNo', null), address: 2, response: [], msg: '', deliveryOption: 'itemOne',
            deliveryOptionPickUpFormStore: 'one', delivery_date: '',

            inHomeCount : props.navigation.getParam('inHomeCount', 0),
            outsideCount: props.navigation.getParam('outsideCount', 0),
            cart: props.navigation.getParam('cart', []),
            fabrics : props.navigation.getParam('fabrics', null)
        };
    }
    componentDidMount() {
        this.setState({language: this.props.navigation.getParam('language')});
        PayPal.initialize(PayPal.NO_NETWORK, "AedWoRTQiHP7ObJm8A065-v8dGa1iyuoZlZqcvZZEtb0jLo3lBPaWA6eXOafT5c9Wv3Md5tVzqpcOgjm");
    }
    submitForm() {
        var screen = this.state.language.deliveryScreen;
        console.log('in submit form');
        products = [];
        const url = deliveryStrings.order_now;
        brands = this.state.fabrics;
        cart = this.state.cart;
        others = {measurement: this.props.navigation.getParam('measurement'), cart: cart, fabrics: brands, language: this.state.language}
        if(this.state.inHomeCount>0){
            products = this.state.cart.map((item,index)=>{
                return (
                    {
                        brandID: brands[item.brand].id,
                        patternID: brands[item.brand].patterns[item.pattern].id,
                        colorID: brands[item.brand].patterns[item.pattern].colors[item.color].id,
                        quantity: item.quantity
                    }
                )
            })
        }

        otherFabrics = {
            inHomeCount: this.state.inHomeCount, outsideCount: this.state.outsideCount,
        }
        const {
            p_area, p_street, p_jada, p_floor, p_block, p_apartment, p_extra_Number, p_house,
            d_area, d_street, d_jada, d_floor, d_block, d_apartment, d_extra_Number, d_house,
            itemSelected, deliveryOption, deliveryOptionPickUpFormStore,
            area, street, jada, floor, block, apartment, extra_Number, house,
        } = this.state;

        var customerName = this.props.navigation.state.params.customerName;
        var measurementDate = this.props.navigation.state.params.measurementDate;
        var emailAddr = this.props.navigation.state.params.emailID;
        var pickup_type, delivery_type, whichStore;
        var fabricOptionValue, deliveryOptionValue, subTotal;


        if (itemSelected == "itemTwo") {
            console.log('one');
            pickup_type = 'send';
            fabricOptionValue = 0;
            if (deliveryOption == 'itemTwo') {
                console.log('2 one');
                delivery_type = 'home';
                deliveryOptionValue = 3;
                subTotal = 12 * this.state.noOfPieces + fabricOptionValue + deliveryOptionValue
                if (area && block && house && street) {

                    var data = JSON.stringify({
                        o_pieces: this.state.noOfPieces,
                        o_total: this.state.noOfPieces * 12,
                        o_number: this.state.mobileNo,
                        o_subtotal: subTotal,
                        o_pickup_charge: fabricOptionValue,
                        o_delivery_charge: deliveryOptionValue,
                        pickup_type: pickup_type,
                        delivery_type: delivery_type,
                        d_apartment: apartment,
                        d_area: area,
                        d_block: block,
                        d_extra_number: extra_Number,
                        d_floor: floor,
                        d_house: house, d_jada: jada, d_street: street,
                        products
                    })

                    // if default condition will occur
                    this.setState({isLoading: true});
                    axios.post(url, data)
                        .then((response) => response.data)
                        .then((responseData) => {

                            console.log(responseData);
                            this.setState({emailId: responseData.email, isLoading: false}, () => {
                                this.props.navigation.navigate('order_detail', {
                                    id: responseData.id,
                                    token: responseData.token,
                                    noOfPieces: this.state.noOfPieces,
                                    fabricOptionValue: fabricOptionValue,
                                    deliveryOptionValue: deliveryOptionValue,
                                    customerName: customerName,
                                    measurementDate: measurementDate,
                                    mobileNo: this.state.mobileNo,
                                    delivery_date: responseData.delivery_date,
                                    emailID: emailAddr,
                                    ...others
                                });
                            })
                        })
                        .catch((error) => {

                            console.log(error);
                            this.setState({isLoading: false})
                            console.warn('error');
                        });
                } else {
                    alert(screen.detailsRequired);
                }
            } else {
                console.log('2 two');
                deliveryOptionValue = 0;
                delivery_type = "self";
                if (deliveryOptionPickUpFormStore == 'one') {
                    whichStore = "Awquaf Complex"
                } else {
                    whichStore = "Qurain Shop"
                }

                subTotal = 12 * this.state.noOfPieces + fabricOptionValue + deliveryOptionValue

                var data = JSON.stringify({
                    o_pieces: this.state.noOfPieces,
                    o_total: this.state.noOfPieces * 12,
                    o_number: this.state.mobileNo,
                    o_subtotal: subTotal,
                    o_pickup_charge: fabricOptionValue,
                    o_delivery_charge: deliveryOptionValue,
                    pickup_type: pickup_type,
                    delivery_type: delivery_type,
                    d_store_name: whichStore,
                    products
                })
                this.setState({isLoading: true});
                axios.post(url, data)
                    .then((response) => response.data)
                    .then((responseData) => {

                        this.setState({isLoading: false});
                        console.log(responseData);

                        this.setState({emailId: responseData.email, isLoading: false});
                        this.props.navigation.navigate('order_detail', {
                            id: responseData.id,
                            token: responseData.token,
                            noOfPieces: this.state.noOfPieces,
                            fabricOptionValue: fabricOptionValue,
                            deliveryOptionValue: deliveryOptionValue,
                            customerName: customerName,
                            measurementDate: measurementDate,
                            mobileNo: this.state.mobileNo,
                            delivery_date: responseData.delivery_date,
                            emailID: emailAddr,
                            ...others
                        });

                    })
                    .catch((error) => {

                        console.log(error);
                        this.setState({isLoading: false})
                        console.warn('error');
                    });
            }
        } else {
            console.log('two');
            pickup_type = 'pickup';
            fabricOptionValue = 3;
            if (area && block && house && street) {
                if (deliveryOption == "itemTwo") {
                    delivery_type = 'home';
                    deliveryOptionValue = 3;
                    subTotal = 12 * this.state.noOfPieces + fabricOptionValue + deliveryOptionValue
                    if (area && block && house && street) {
                        var data = JSON.stringify({

                            o_pieces: this.state.noOfPieces,
                            o_total: this.state.noOfPieces * 12,
                            o_number: this.state.mobileNo,
                            o_subtotal: subTotal,
                            o_pickup_charge: fabricOptionValue,
                            o_delivery_charge: deliveryOptionValue,


                            pickup_type: pickup_type,
                            delivery_type: delivery_type,
                            d_apartment: apartment,
                            d_area: area, d_block: block,
                            d_extra_number: extra_Number,
                            d_floor: floor, d_house: house,
                            d_jada: jada, d_street: street
                            , p_apartment: apartment,
                            p_area: area,
                            p_block: block,
                            p_extra_number: extra_Number,
                            p_floor: floor,
                            p_house: house, p_jada: jada, p_street: street,
                            products
                        })

                        // if default condition will occur
                        this.setState({isLoading: true})
                        axios.post(url, data)
                            .then((response) => response.data)
                            .then((responseData) => {

                                console.log(responseData);

                                this.setState({emailId: responseData.email, isLoading: false}, () => {
                                    this.props.navigation.navigate('order_detail', {
                                        id: responseData.id,
                                        token: responseData.token,
                                        noOfPieces: this.state.noOfPieces,
                                        fabricOptionValue: fabricOptionValue,
                                        deliveryOptionValue: deliveryOptionValue,
                                        customerName: customerName,
                                        measurementDate: measurementDate,
                                        mobileNo: this.state.mobileNo,
                                        delivery_date: responseData.delivery_date,
                                        emailID: emailAddr,
                                        ...others
                                    });
                                })
                            })
                            .catch((error) => {

                                console.log(error);
                                this.setState({isLoading: false})
                            });
                    } else {
                        alert(screen.detailsRequired);
                    }


                } else {
                    if (deliveryOptionPickUpFormStore == 'one') {
                        whichStore = "Awquaf Complex"
                    } else {
                        whichStore = "Qurain Shop"
                    }
                    deliveryOptionValue = 0;
                    subTotal = 12 * this.state.noOfPieces + fabricOptionValue + deliveryOptionValue
                    var data = JSON.stringify({

                        o_pieces: this.state.noOfPieces,
                        o_total: this.state.noOfPieces * 12,
                        o_number: this.state.mobileNo,
                        o_subtotal: subTotal,
                        o_pickup_charge: fabricOptionValue,
                        o_delivery_charge: deliveryOptionValue,


                        pickup_type: pickup_type,
                        delivery_type: delivery_type,
                        p_apartment: apartment, p_area: area,
                        p_block: block, p_extra_number: extra_Number,
                        p_floor: floor, p_house: house,
                        p_jada: jada, p_street: street,
                        d_store_name: whichStore,
                        products
                    })
                    this.setState({isLoading: true});
                    axios.post(url, data)
                        .then((response) => response.data)
                        .then((responseData) => {

                            console.log(responseData);

                            this.setState({emailId: responseData.email, isLoading: false}, () => {
                                this.props.navigation.navigate('order_detail', {
                                    id: responseData.id,
                                    token: responseData.token,
                                    noOfPieces: this.state.noOfPieces,
                                    fabricOptionValue: fabricOptionValue,
                                    deliveryOptionValue: deliveryOptionValue,
                                    customerName: customerName,
                                    measurementDate: measurementDate,
                                    mobileNo: this.state.mobileNo,
                                    delivery_date: responseData.delivery_date,
                                    emailID: emailAddr,
                                    ...others
                                });
                            })

                        })
                        .catch((error) => {

                            console.log(error);
                            this.setState({isLoading: false})
                            console.warn('error');
                        });
                }

            } else {
                alert(screen.detailsRequired);
            }
        }
    }

    getComponent(){
        var screen = this.state.language.deliveryScreen;
        if (this.state.deliveryOption == 'itemTwo') {
            return (<View style={{ flexDirection: 'column', marginTop: 20, marginLeft: 0 }}>
                <Text style={{ fontSize: 18 }}>{screen.addressLabel}</Text>
                <View style={{ flexDirection: 'row', marginTop: 10, width: 40 }}>
                    <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
                        <Input
                            placeholder={screen.pArea}
                            onChangeText={(text) => this.setState({ area: text })}
                            value={this.state.area}
                        />
                    </Item>
                    <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                        <Input
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
                            placeholder={screen.pStreet}
                            onChangeText={(text) => this.setState({ street: text })}
                            value={this.state.street}
                        />
                    </Item>
                    <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                        <Input
                            placeholder={screen.pJada}
                            onChangeText={(text) => this.setState({ jada: text })}
                            value={this.state.jada}
                        />
                    </Item>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 5, width: 40 }}>
                    <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
                        <Input
                            placeholder={screen.pHouse}
                            onChangeText={(text) => this.setState({ house: text })}
                            value={this.state.house}
                        />
                    </Item>
                    <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                        <Input
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
                            placeholder={screen.pApartment}
                            onChangeText={(text) => this.setState({ apartment: text })}
                            value={this.state.apartment}
                        />
                    </Item>
                    <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                        <Input
                            placeholder={screen.pExtra}
                            keyboardType='numeric'
                            onChangeText={(text) => this.setState({ extra_Number: text })}
                            value={this.state.extra_Number}
                        />
                    </Item>
                </View>
            </View>)
        }
    }

    tempsubmitForm(){
        console.log("DELIVERYOPTIONS: ", this.state);
    }

    render() {
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;
        var screen = this.state.language.deliveryScreen;
        const { deliveryOption, deliveryOptionPickUpFormStore } = this.state
        console.log(deliveryOption);
        const sizeCtrl = {width: 40, height: 40}
        return (
            <SafeAreaView >
                <ScrollView>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 50 }}>
                        <Image style={{ width: 80, height: 80 }} source={require('../img/om.png')} />
                    </View>
                    <View style={{ flexDirection: 'column', marginHorizontal: 40 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                            <Text style={{ fontSize: 20 }}>{screen.text1}</Text>
                        </View>
                        <View style={{ marginTop: 40 }}>
                            <Text style={{ fontSize: 20 }}>{screen.fabricLabel}</Text>
                            <View style={{ marginTop: 10 }}>

                                <RadioForm
                                    isRTL={this.state.language.isRTL}
                                    buttonSize={10}
                                    buttonColor={'#0451A5'}
                                    buttonInnerColor={'#0451A5'}
                                    buttonOuterColor={'#0451A5'}
                                    buttonWrapStyle={{ marginTop: 10 }}
                                    selectedButtonColor={'#0451A5'}
                                    labelStyle={{ fontSize: 20, marginTop: 0, }}
                                    buttonOuterSize={20}
                                    buttonStyle={{ marginTop: 20 }}


                                    radio_props={[{ label: screen.sendFabric, value: 0 },
                                        { label: screen.pickup, value: 1 }]}
                                    initial={0}
                                    onPress={(value) => {
                                        (value == 0)
                                            ? this.setState({ itemSelected: 'itemTwo' })
                                            : this.setState({ itemSelected: 'itemOne' })
                                    }}
                                />
                            </View>

                            {renderIf(this.state.itemSelected == 'itemOne')(
                                <Form style={{ flexDirection: 'column', marginTop: 20, marginLeft: 0 }}>
                                    <Text style={{ fontSize: 18 }}>{screen.addressLabel}</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 10, width: 40 }}>
                                        <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
                                            <Input
                                                placeholder={screen.pArea}
                                                onChangeText={(text) => this.setState({ area: text })}
                                                value={this.state.area}
                                            />
                                        </Item>
                                        <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                                            <Input
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
                                                placeholder={screen.pStreet}
                                                onChangeText={(text) => this.setState({ street: text })}
                                                value={this.state.street}
                                            />
                                        </Item>
                                        <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                                            <Input
                                                placeholder={screen.pJada}
                                                onChangeText={(text) => this.setState({ jada: text })}
                                                value={this.state.jada}
                                            />
                                        </Item>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 5, width: 40 }}>
                                        <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
                                            <Input
                                                placeholder={screen.pHouse}
                                                onChangeText={(text) => this.setState({ house: text })}
                                                value={this.state.house}
                                            />
                                        </Item>
                                        <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                                            <Input
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
                                                placeholder={screen.pApartment}
                                                onChangeText={(text) => this.setState({ apartment: text })}
                                                value={this.state.apartment}
                                            />
                                        </Item>
                                        <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                                            <Input
                                                placeholder={screen.pExtra}
                                                keyboardType='numeric'
                                                onChangeText={(text) => this.setState({ extra_Number: text })}
                                                value={this.state.extra_Number}
                                            />
                                        </Item>
                                    </View>
                                </Form>
                            )}
                        </View>

                        <View style={{ marginTop: 20, }}>
                            <Text style={{ fontSize: 20 }}>{screen.deliveryLabel}</Text>

                            <View style={{ flex: 1, marginTop: 10 }}>

                                <View style={{alignItems: this.state.language.isRTL?'flex-end':'flex-start'}}>
                                    <TouchableOpacity
                                        style={{ flex: 1, flexDirection: 'row' }}
                                        onPress={() => this.setState({ deliveryOption: 'itemOne' })} >
                                        {this.state.language.isRTL?<Text style={{ marginLeft: 10, fontSize: 20, color: '#000', fontWeight: '400' }}>{screen.opPickup}</Text>:null}
                                        {deliveryOption == 'itemOne'
                                            ? <CustomRadioButton name="radiobox-marked" size={25} color={'#0451A5'} />
                                            : <CustomRadioButton name="checkbox-blank-circle-outline" size={25} color={'#0451A5'} />
                                        }
                                        {!this.state.language.isRTL?<Text style={{ marginLeft: 10, fontSize: 20, color: '#000', fontWeight: '400' }}>{screen.opPickup}</Text>:null}
                                    </TouchableOpacity>
                                </View>
                                <View style={{alignItems: this.state.language.isRTL?'flex-end':'flex-start'}}>
                                    <TouchableOpacity
                                        style={{ flex: 1, flexDirection: 'row' }}
                                        onPress={() => this.setState({ deliveryOption: 'itemTwo' })} >
                                        {this.state.language.isRTL?<Text style={{ marginLeft: 10, fontSize: 20, color: '#000', fontWeight: '400' }}>{screen.opHomeDel}</Text>:null}
                                        {deliveryOption === 'itemTwo'
                                            ? <CustomRadioButton name="radiobox-marked" size={25} color={'#0451A5'} />
                                            : <CustomRadioButton name="checkbox-blank-circle-outline" size={25} color={'#0451A5'} />
                                        }
                                        {!this.state.language.isRTL?<Text style={{ marginLeft: 10, fontSize: 20, color: '#000', fontWeight: '400' }}>{screen.opHomeDel}</Text>:null}
                                    </TouchableOpacity>
                                </View>
                                {renderIf(deliveryOption == 'itemTwo')(
                                    <Form style={{ flexDirection: 'column', marginTop: 20, marginLeft: 0 }}>
                                        <Text style={{ fontSize: 18 }}>{screen.addressLabel}</Text>
                                        <View style={{ flexDirection: 'row', marginTop: 10, width: 40 }}>
                                            <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
                                                <Input
                                                    placeholder={screen.pArea}
                                                    onChangeText={(text) => this.setState({ area: text })}
                                                    value={this.state.area}
                                                />
                                            </Item>
                                            <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                                                <Input
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
                                                    placeholder={screen.pStreet}
                                                    onChangeText={(text) => this.setState({ street: text })}
                                                    value={this.state.street}
                                                />
                                            </Item>
                                            <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                                                <Input
                                                    placeholder={screen.pJada}
                                                    onChangeText={(text) => this.setState({ jada: text })}
                                                    value={this.state.jada}
                                                />
                                            </Item>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginTop: 5, width: 40 }}>
                                            <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
                                                <Input
                                                    placeholder={screen.pHouse}
                                                    onChangeText={(text) => this.setState({ house: text })}
                                                    value={this.state.house}
                                                />
                                            </Item>
                                            <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                                                <Input
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
                                                    placeholder={screen.pApartment}
                                                    onChangeText={(text) => this.setState({ apartment: text })}
                                                    value={this.state.apartment}
                                                />
                                            </Item>
                                            <Item regular style={{ width: width / 2 - 40, height: 30 }}>
                                                <Input
                                                    placeholder={screen.pExtra}
                                                    keyboardType='numeric'
                                                    onChangeText={(text) => this.setState({ extra_Number: text })}
                                                    value={this.state.extra_Number}
                                                />
                                            </Item>
                                        </View>
                                    </Form>
                                )}
                            </View>
                            <View style={{ flex: 1, marginTop: 10 }}>
                                {renderIf(deliveryOption == 'itemOne')(
                                    <View style={{ marginLeft: 25, flex: 1, alignItems: this.state.language.isRTL?'flex-end':'flex-start' }}>
                                        <TouchableOpacity
                                            style={{ flexDirection: 'row', marginTop: 10 }}
                                            onPress={() => this.setState({ deliveryOptionPickUpFormStore: 'one' })} >
                                            {this.state.language.isRTL?<Text style={{ marginLeft: 10, fontSize: 18, color: '#000' }}>{screen.opAwqaf}</Text>:null}
                                            {(deliveryOptionPickUpFormStore == "one" && deliveryOption == "itemOne")
                                                ? <CustomRadioButton name="radiobox-marked" size={25} color={'#0451A5'} />
                                                : <CustomRadioButton name="checkbox-blank-circle-outline" size={25} color={'#0451A5'} />
                                            }
                                            {!this.state.language.isRTL?<Text style={{ marginLeft: 10, fontSize: 18, color: '#000' }}>{screen.opAwqaf}</Text>:null}
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.setState({ deliveryOptionPickUpFormStore: 'two' })}
                                            style={{ flexDirection: 'row', marginTop: 5 }}>
                                            {this.state.language.isRTL?<Text style={{ marginLeft: 10, fontSize: 18, color: '#000' }}>{screen.opQurain}</Text>:null}
                                            {(deliveryOptionPickUpFormStore === "two" && deliveryOption === "itemOne")
                                                ? <CustomRadioButton name="radiobox-marked" size={25} color={'#0451A5'} />
                                                : <CustomRadioButton name="checkbox-blank-circle-outline" size={25} color={'#0451A5'} />
                                            }
                                            {!this.state.language.isRTL?<Text style={{ marginLeft: 10, fontSize: 18, color: '#000' }}>{screen.opQurain}</Text>:null}
                                        </TouchableOpacity>
                                    </View>
                                )}

                            </View>
                        </View>

                        <View style={{ marginTop: 20, marginBottom: 30, flexDirection: 'row', justifyContent: 'center' }}>
                            <Button
                                style={{ borderRadius: 15, borderWidth: 2, backgroundColor: '#0451A5', height: 40, width: width - 80, justifyContent: 'center' }}
                                onPress={() => this.submitForm()}>
                                <Text style={{ fontSize: 18, color: 'white' }}>{screen.orderNowButton}</Text>
                            </Button>
                        </View>
                        {renderIf(this.state.msg)(
                            <View style={{}}>
                                <Text style={{ color: '#0451A5', fontSize: 20, fontWeight: 'bold' }}>{this.state.msg}</Text>
                            </View>
                        )}
                    </View>

                    {/* <Modal
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                animationType="fade"
                transparent={true}
                visible={this.state.isLoading}
                onRequestClose={() => {
                  Alert.alert('Modal has been closed.');
                }}>
                <ActivityIndicator size={"large"} color="#00ff00" />
              </Modal> */}

                </ScrollView>
            </SafeAreaView>
            //   </Content>
            // </Container>
        );
    }
}
