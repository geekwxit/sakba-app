import React, { Component, useState } from 'react';
import { View, Alert, Text, Image, Dimensions, SafeAreaView, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Form, Item, Input, Button } from 'native-base';
import RadioForm from "./components/RadioForm";
// import axios from './axios/AxiosInstance';
import Store from "./CommonStore/Store";

import axios, { baseURL } from "./axios/AxiosInstance";
import ImageProgress from 'react-native-image-progress';
import ProgressCircle from 'react-native-progress/Circle';
import {strings} from "../locales/Language";
import {isIos} from "./login/Login";
const emailRegx=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegx=/^[0-9]*$/

const { width, height } = Dimensions.get('window');
const address = {
    area: '', block: '', street: '', jada: '', house: '',
    floor: '', apartment: '', extra_Number: '', enabled: false
}
const initialState = {
    charcount: 0, remarks: '', isLoading: false,
    response: [], msg: '', delivery_date: '',
    noOfPieces: 0, mobileNo: null, inHomeCount: 0, outsideCount: 0,
    cart: [], fabrics: null,
    sampleAddress: { ...address }, pickupAddress: { ...address },
    deliveryAddress: { ...address },
    measurementDone: true, pickupShop: 0,
}
export default class DeliveryOptions extends Component<Props>{

    static navigationOptions = ({ navigation }) => {
        var others = navigation.getParam('language').isRTL ?
            { headerRight: <Text style={{ color: 'white', fontSize: 20 % (width * height), padding: 15 }}>{navigation.getParam('language').deliveryScreen.screenTitle}</Text> } :
            { title: navigation.getParam('language').deliveryScreen.screenTitle }
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
            inHomeCount: props.navigation.getParam('inHomeCount', 0),
            outsideCount: props.navigation.getParam('outsideCount', 0),
            cart: props.navigation.getParam('cart', []),
            fabrics: props.navigation.getParam('fabrics', null),
            measurementDone: this.props.navigation.getParam('measurementDone'),
            isCountNeeded: this.props.navigation.getParam('isCountNeeded', true),
            name: '', email: '', phone: '',

            logo: { uri: "" },
            logoLoaded: false,
            sizeDone: false,
            imageHeight: 50,
            withoutLogin: props.navigation.getParam('withoutLogin', false)
        };
    }
    componentDidMount() {
        this.setState({ language: this.props.navigation.getParam('language') });
        this.setImage();
    }

    submitForm() {
        let pickupCharges = 0, deliveryCharges = 0, sampleCharges = 0;
        var cartTotal = 0;
        if (Store.store.shippingCharges) {
            pickupCharges = Store.store.shippingCharges.pickupCharges ? Store.store.shippingCharges.pickupCharges : 0;
            deliveryCharges = Store.store.shippingCharges.deliveryCharges ? Store.store.shippingCharges.deliveryCharges : 0;
            sampleCharges = Store.store.shippingCharges.sampleCharges ? Store.store.shippingCharges.sampleCharges : 0;
        }
        let validated = false;
        var screen = this.state.language.deliveryScreen;
        var addresses = {};
        var fabrics = [], products = [];
        const {
            pickupAddress: {
                area: p_area, block: p_block, street: p_street,
                jada: p_jada, house: p_house, floor: p_floor,
                apartment: p_apartment, extra_Number: p_extra_number,
                enabled: pickup
            },
            deliveryAddress: {
                area: d_area, block: d_block, street: d_street,
                jada: d_jada, house: d_house, floor: d_floor,
                apartment: d_apartment, extra_Number: d_extra_number,
                enabled: delivery
            },
            sampleAddress: {
                area: s_area, block: s_block, street: s_street,
                jada: s_jada, house: s_house, floor: s_floor,
                apartment: s_apartment, extra_Number: s_extra_number,
                enabled: sample
            }, remarks, fabrics: brands, cart, name, email, phone
        } = this.state;

        const sampleAddress = { s_area, s_block, s_street, s_jada, s_house, s_floor, s_apartment, s_extra_number, }
        const pickupAddress = { p_area, p_block, p_street, p_jada, p_house, p_floor, p_apartment, p_extra_number, }
        const deliveryAddress = { d_area, d_block, d_street, d_jada, d_house, d_floor, d_apartment, d_extra_number, }

        const deliveryOptions = {
            pickup_type: pickup ? 'pickup' : 'send', o_pickup_charge: pickup ? parseFloat(pickupCharges) : 0,
            delivery_type: delivery ? 'home' : 'self', o_delivery_charge: delivery ? parseFloat(deliveryCharges) : 0,
            sample_type: sample ? 'pickup' : 'send', o_sample_charge: sample ? parseFloat(sampleCharges) : 0
        };
        addresses = pickup ? { ...addresses, ...pickupAddress } : addresses;
        addresses = sample ? { ...addresses, ...sampleAddress } : addresses;
        addresses = delivery ? { ...addresses, ...deliveryAddress } : addresses;

        subTotal = (12 * this.state.noOfPieces);
        var customerName = this.props.navigation.state.params.customerName;
        var measurementDate = this.props.navigation.state.params.measurementDate;
        var emailAddr = this.props.navigation.state.params.emailID;
        var others = {
            measurement: this.props.navigation.getParam('measurement'),
            cart, brands, language: this.state.language,
            noOfPieces: this.state.noOfPieces,
            fabricPickupCharge: deliveryOptions.o_pickup_charge,
            deliveryCharge: deliveryOptions.o_delivery_charge,
            samplePickupCharge: deliveryOptions.o_sample_charge,
            customerName: customerName,
            measurementDate: measurementDate,
            mobileNo: this.state.mobileNo || phone,
            emailID: emailAddr,
        }
        console.log("ret", others);
        this.state.cart.forEach(item => {
            if (item.isFabric) {
                if (this.state.isCountNeeded) {
                    cartTotal += item.quantity * item.price * others.measurement;
                    fabrics.push({
                        brandID: brands[item.brand].id,
                        patternID: brands[item.brand].patterns[item.pattern].id,
                        colorID: brands[item.brand].patterns[item.pattern].colors[item.color].id,
                        quantity: item.quantity,
                        measurement: others.measurement
                    })
                } else {
                    cartTotal += item.quantity * item.price * item.measurement;
                    fabrics.push({
                        brandID: brands[item.brand].id,
                        patternID: brands[item.brand].patterns[item.pattern].id,
                        colorID: brands[item.brand].patterns[item.pattern].colors[item.color].id,
                        quantity: item.quantity,
                        measurement: item.measurement,
                    })
                }
            } else if (item.isProduct) {
                cartTotal += item.quantity * item.price;
                products.push(item);
            }
        })
        otherFabrics = {
            inHomeCount: this.state.inHomeCount,
            outsideCount: this.state.outsideCount,
        }

        const data = {
            login_status: this.state.withoutLogin?1:0,
            name, email, phone,
            o_pieces: this.state.noOfPieces,
            o_total: subTotal +
                deliveryOptions.o_pickup_charge +
                deliveryOptions.o_delivery_charge +
                deliveryOptions.o_sample_charge +
                cartTotal,
            o_number: this.state.mobileNo || phone,
            o_subtotal: subTotal, fabrics,
            products, remarks: this.state.remarks,
            d_store_name: !delivery ? (!parseInt(this.state.pickupShop) ? "Awqaf Complex" : "Qurain Shop") : "",
            ...deliveryOptions, ...addresses
        }
        var alertMsg = "";
        if (pickup || delivery || sample) {
            validated = (pickup ? !this.validateFields(p_area, p_block, p_house, p_street) : true) &&
                (delivery ? !this.validateFields(d_area, d_block, d_house, d_street) : true) &&
                (sample ? !this.validateFields(s_area, s_block, s_house, s_street) : true);
            alertMsg = screen.detailsRequired;
            // !validated && Alert.alert(this.state.language.commonFields.alertTitle, screen.detailsRequired, [{ text: this.state.language.commonFields.okButton }]);
        } else if (!this.state.isCountNeeded && this.validateFields(name, email, phone)) {
            alertMsg = screen.detailsRequired;
            validated = false;
        } else if (!this.state.isCountNeeded && !emailRegx.test(email.trim())) {
            alertMsg = strings.confirmScreen.emailError;
            validated = false;
        } else if (!this.state.isCountNeeded && String(phone).trim().length<8) {
            alertMsg = strings.login.validation.lengthError;
            validated = false;
        } else if (!this.state.isCountNeeded && !phoneRegx.test(phone)) {
            alertMsg = strings.login.validation.others + phone;
            validated = false;
        } else {
            alertMsg = ""
            validated = true;
        }
        if (validated) {
            console.log(data);
            axios.post('order_test.php', data)
                .then((response) => response.data)
                .then(responseData => {
                    if (responseData.error) {
                        alert(responseData.msg);
                    } else {
                        this.setState({ emailId: responseData.email }, () => this.props.navigation.navigate('order_detail',
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

            Alert.alert(this.state.language.commonFields.alertTitle, alertMsg, [{ text: this.state.language.commonFields.okButton }]);
        }
    }

    validateFields() {
        var empty = 0;
        var ar = Object.assign([], arguments);
        ar.forEach(a => a.trim().length == 0 ? empty++ : 0);
        return empty;
    }

    async getLogo() {
        try {
            let response = await axios.get('get_logo.php');
            response = response.data;
            if (!response.error) {
                return { uri: baseURL + response?.logo?.logo4 };
            }
            return { uri: baseURL + response?.logo?.logo4 };
        } catch (e) {
            return { uri: baseURL + "" };
        }
    }

    async setImage() {
        let logo = await this.getLogo();
        await this.getImageSize(logo.uri);
        this.setState({ logo, logoLoaded: true });
    }

    async getImageSize(uri) {
        await Image.getSize(uri, (t) => {
            this.setState({ sizeDone: true, imageHeight: t > 300 ? 300 : t })
        }, (f) => {
            this.setState({ sizeDone: true, imageHeight: 50 })
        });
    }

    render() {
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;
        var screen = this.state.language.deliveryScreen;
        const isRTL = this.state.language.isRTL;
        if (!this.state.logoLoaded) {
            return (
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                        <ActivityIndicator size={isIos?'large':40} color={'#0451A5'} />
                    </View>
                </SafeAreaView>
            )
        }
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} >
                <ScrollView>
                    <AppLogo source={this.state.logo} logoLoaded={this.state.logoLoaded} height={this.state.imageHeight} />
                    <View style={{ marginTop: 10, flexDirection: 'column', marginHorizontal: 40 }}>
                        {!this.state.measurementDone && this.state.isCountNeeded && <AddressOption
                            label={screen.sampleLabel}
                            setValue={(value) => this.setState(prev => ({ sampleAddress: { ...prev.sampleAddress, ...value } }))}
                            values={this.state.sampleAddress}
                            showAddress={this.state.sampleAddress.enabled} isRTL={isRTL} screen={screen}
                            radioOptions={[{ label: screen.sendFabric, value: 0 },
                            { label: screen.pickup, value: 1 }]}
                            toggle={() => this.setState(prev => ({ sampleAddress: { ...prev.sampleAddress, enabled: !prev.sampleAddress.enabled } }))}
                        />}
                        {!(this.state.inHomeCount == this.state.noOfPieces) && this.state.isCountNeeded && <AddressOption
                            style={{ marginTop: 20 }}
                            label={screen.fabricLabel}
                            setValue={(value) => this.setState(prev => ({ pickupAddress: { ...prev.pickupAddress, ...value } }))}
                            values={this.state.pickupAddress}
                            showAddress={this.state.pickupAddress.enabled} isRTL={isRTL} screen={screen}
                            radioOptions={[{ label: screen.sendFabric, value: 0 },
                            { label: screen.pickup, value: 1 }]}
                            toggle={() => this.setState(prev => ({ pickupAddress: { ...prev.pickupAddress, enabled: !prev.pickupAddress.enabled } }))}
                        />}
                        {!this.state.isCountNeeded &&
                            <View>
                                <Text style={{
                                    fontSize: 20,
                                    alignSelf: isRTL ? 'flex-end' : 'flex-start',
                                    textAlign: isRTL ? 'right' : 'auto'
                                }}>{screen.customerInputLabel} </Text>
                                <CustomInput label={screen.name} isRTL={isRTL} onChangeText={(name) => this.setState({ name })} />
                                <CustomInput label={screen.phone} keyboardType={'number-pad'} isRTL={isRTL} onChangeText={(phone) => this.setState({ phone })} />
                                <CustomInput label={screen.email} keyboardType={'email-address'} isRTL={isRTL} onChangeText={(email) => this.setState({ email })} />
                            </View>
                        }
                        <AddressOption
                            style={{ marginTop: 10 }}
                            label={screen.deliveryLabel}
                            setValue={(value) => this.setState(prev => ({ deliveryAddress: { ...prev.deliveryAddress, ...value } }))}
                            values={this.state.deliveryAddress}
                            showAddress={this.state.deliveryAddress.enabled} isRTL={isRTL} screen={screen}
                            radioOptions={[{ label: screen.opPickup, value: 0 },
                            { label: screen.opHomeDel, value: 1 }]}
                            toggle={() => this.setState(prev => ({ deliveryAddress: { ...prev.deliveryAddress, enabled: !prev.deliveryAddress.enabled } }))}>
                            <ExtraOptions isRTL={isRTL} radioOptions={[{ label: screen.opAwqaf, value: 0 },
                            { label: screen.opQurain, value: 1 }]}
                                style={{ alignSelf: isRTL ? 'flex-end' : 'flex-start' }}
                                value={false} toggle={(pickupShop) => this.setState({ pickupShop })} />
                        </AddressOption>
                        <View style={{
                            borderColor: '#abbee9',
                            borderWidth: 1,
                            marginTop: 10,
                            borderRadius: 5,
                            padding: 10,
                            backgroundColor: '#d1e2ff',
                            width: (width / 2 - 40) * 2,
                            minHeight: 30,
                        }}>
                            <Text style={{ marginBottom: 2, flex: 1, alignSelf: isRTL ? 'flex-end' : 'flex-start', textAlign: isRTL ? 'right' : 'left' }}>{screen.pRemarks}</Text>
                            <TextInput
                                selectionColor={'rgba(4,101,227,0.44)'}
                                multiline={true}
                                style={{
                                    textAlign: isRTL ? 'right' : 'left',
                                    borderBottomWidth: 1,
                                    flex: 1,
                                    fontSize: 15
                                }}
                                onChangeText={(remarks) => {
                                    this.setState({ remarks, charcount: remarks.length })
                                }}
                            />
                        </View>
                        <View style={{ marginTop: 20, marginBottom: 20 }}>
                            <Button style={{ backgroundColor: '#0451A5', width: width - 80, height: 40, borderRadius: 5, justifyContent: 'center' }}
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

const AddressOption = ({ children, style, values, radioOptions, isRTL, screen, setValue, showAddress, toggle, extras, label }) => (
    <View style={style}>
        <Text style={{
            fontSize: 20,
            alignSelf: isRTL ? 'flex-end' : 'flex-start',
            textAlign: isRTL ? 'right' : 'auto'
        }}>{label}</Text>
        <View style={{ marginTop: 0 }}>
            <RadioForm
                isRTL={isRTL}
                buttonSize={10}
                buttonColor={'#0451A5'}
                buttonInnerColor={'#0451A5'}
                buttonOuterColor={'#0451A5'}
                buttonWrapStyle={{ marginTop: 10 }}
                selectedButtonColor={'#0451A5'}
                labelStyle={{ fontSize: 20, marginTop: 0 }}
                buttonOuterSize={20}
                buttonStyle={{ marginTop: 20 }}
                radio_props={radioOptions}
                initial={showAddress}
                value={showAddress ? 1 : 0}
                showAtIndex={0}
                onPress={(value) => toggle(value)}>
                {!showAddress ? children : null}
            </RadioForm>
        </View>
        {showAddress && <Form style={{ flexDirection: 'column', marginTop: 20, marginLeft: 0 }}>
            <Text style={{
                fontSize: 18,
                alignSelf: isRTL ? 'flex-end' : 'flex-start',
                textAlign: isRTL ? 'right' : 'auto'
            }}>{screen.addressLabel}</Text>
            <View style={{ flexDirection: 'row', marginTop: 5, width: 40 }}>
                <AddressItem isRTL={isRTL} value={values.area} placeholder={screen.pArea}
                    setValue={(area) => setValue({ area })} />
                <AddressItem isRTL={isRTL} value={values.block} placeholder={screen.pBlock}
                    setValue={(block) => setValue({ block })} />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 5, width: 40 }}>
                <AddressItem isRTL={isRTL} value={values.street} placeholder={screen.pStreet}
                    setValue={(street) => setValue({ street })} />
                <AddressItem isRTL={isRTL} value={values.jada} placeholder={screen.pJada}
                    setValue={(jada) => setValue({ jada })} />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 5, width: 40 }}>
                <AddressItem isRTL={isRTL} value={values.house} placeholder={screen.pHouse}
                    setValue={(house) => setValue({ house })} />
                <AddressItem isRTL={isRTL} value={values.floor} placeholder={screen.pFloor}
                    setValue={(floor) => setValue({ floor })} />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 5, width: 40 }}>
                <AddressItem isRTL={isRTL} value={values.apartment} placeholder={screen.pApartment}
                    setValue={(apartment) => setValue({ apartment })} />
                <AddressItem isRTL={isRTL} value={values.extra_number} placeholder={screen.pExtra}
                    setValue={(extra_number) => setValue({ extra_number })} />
            </View>
        </Form>}
    </View>
)

const AddressItem = ({ isRTL, value, placeholder, setValue }) => (
    <Item regular style={{ width: width / 2 - 40, height: 30, marginRight: 5 }}>
        <Input
            style={{ textAlign: isRTL ? 'right' : 'left' }}
            placeholder={placeholder}
            onChangeText={(v) => setValue(v)}
            value={value}
        />
    </Item>
)

const ExtraOptions = ({ isRTL, radioOptions, value, style, toggle }) => (
    <View style={[{ paddingHorizontal: 25, }, style]}>
        <RadioForm
            isRTL={isRTL}
            buttonSize={10}
            buttonColor={'#0451A5'}
            buttonInnerColor={'#0451A5'}
            buttonOuterColor={'#0451A5'}
            buttonWrapStyle={{ marginTop: 10 }}
            selectedButtonColor={'#0451A5'}
            labelStyle={{ fontSize: 20, marginTop: 0 }}
            buttonOuterSize={20}
            buttonStyle={{ marginTop: 20 }}
            radio_props={radioOptions}
            initial={0}
            onPress={(value) => toggle(value)}
        />
    </View>
)

const CustomInput = ({ value, keyboardType, onChangeText, label, isRTL, maxLength = 30 }) => (
    <Item style={{ transform: [{ scaleX: isRTL ? -1 : 1 }], marginLeft: 0, marginTop: 25, height: 40, width: width * 0.8, backgroundColor: '#d1e2ff' }}>
        <View style={{ paddingHorizontal: 10, backgroundColor: '#0451A5', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#fff', transform: [{ scaleX: isRTL ? -1 : 1 }] }}>{label}</Text>
        </View>
        <TextInput selectionColor={'rgba(4,101,227,0.44)'}
            style={{
                paddingHorizontal: 10, flex: 1,
                textAlign: isRTL ? 'right' : 'left',
                transform: [{ scaleX: isRTL ? -1 : 1 }],
                height: 50, fontSize: 15
            }}
            keyboardType={keyboardType} value={value}
            onChangeText={(text) => onChangeText(text)} maxLength={maxLength} />
    </Item>

)

function AppLogo({ logoLoaded, height, source }) {
    const [marginTop, setMarginTop] = useState(height * .20);
    return (
        <View style={{ alignItems: 'center' }}>
            {logoLoaded ?
                <ImageProgress style={{ height, resizeMode: 'contain', maxHeight: 300, width: width }}
                    source={source}
                    onLoad={() => setMarginTop(10)}
                    indicator={ProgressCircle}
                    indicatorProps={{
                        size: 50,
                        progress: 0.1,
                        borderWidth: 0,
                        color: '#0451A5',
                        unfilledColor: 'rgba(4,81,165,0.41)'
                    }}
                /> :
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ProgressCircle indeterminate={true} progress={0.1} size={50} />
                </View>
            }
        </View>
    )
}
