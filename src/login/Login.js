/**
 * @Authour Satyanarayan Gotherwal
 * @Date  19/04/2019
*/
import React, { Component, useState } from 'react';
import { ActivityIndicator, Alert, View, Text, Image, Dimensions, SafeAreaView, TextInput, TouchableOpacity, Linking, ScrollView, ImageBackground } from 'react-native';
import { Form, Item, Container, Content, Button, } from 'native-base';
import axios, { baseURL } from "../axios/AxiosInstance";
import ImageProgress from 'react-native-image-progress';
import ProgressPie from 'react-native-progress/Pie';
import ProgressCircle from 'react-native-progress/Circle';
import { strings } from '../../locales/Language'
import { Language } from '../components/ChangeLanguage';
import { B } from "../components/TextStyles";
import Store from "../CommonStore/Store";
import { Reducer } from 'react-native-router-flux';
import {isIos} from "../../App";

const { width, height } = Dimensions.get('window');

export default class Login extends Component {
    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        this.setImage();
        this.setLanguage();
        Store.getShippingCharges();
        // this.props.navigation.navigate('review', {
        //     language: strings,
        //     order_id: 1531,
        // })
        // this.props.navigation.navigate('payment_success', {
        //     measurement: 3.5,
        //     language: strings,
        //     customerName: "Avinash Kumar",
        //     emailID: undefined,
        //     orderID: "1896",
        //     deliveryDate: "2020-07-22"
        // })
        // this.props.navigation.navigate('fabrics_and_products', {
        //         language: strings,
        //         order_id: 1531,
        //     })
    }

    async setImage() {
        let logo = await this.getLogo();
        await this.getImageSize(logo.uri);
        this.setState({ logo, logoLoaded: true });
    }

    async setLanguage() {
        const lang = await Language.get();
        lang != null ? this.setState({ language: lang }) : this.setState({ language: 'ar' });
        lang ? strings.setLanguage(lang) : strings.setLanguage('ar');
        this.setState({ page: strings.login });
    }

    constructor(props) {
        super(props);
        this.state = {
            sizeDone: false,
            imageHeight: 50,
            mobileNo: '',
            page: strings.login,
            language: 'en',
            itemSelected: 'itemOne',
            flag: false, boardAddModalShow: false,
            itemSelected2: 'itemOne2',
            noOfPieces: 0,
            mobileNumberFromDataBase: [],
            customerName: '', measurementDate: '',
            status: '', count: 0, notFound: false,
            logo: {
                uri: "",
                backgroundImage: ""
            },
            logoLoaded: false
        };
        // this.sendApiRequest()
    }

    async getImageSize(uri) {
        await Image.getSize(uri, (t) => {
            this.setState({ sizeDone: true, imageHeight: t > 300 ? 300 : t })
        }, (f) => {
            this.setState({ sizeDone: true, imageHeight: 50 })
        });
    }

    async getLogo() {
        try {
            let response = await axios.get('get_logo.php');
            response = response.data;
            if (!response.error) {
                return { uri: baseURL + response?.logo?.logo, backgroundImage: baseURL + response?.logo?.logo1 };
            }
            return { uri: baseURL + response?.logo?.logo, backgroundImage: baseURL + response?.logo?.logo1 };
        } catch (e) {
            return { uri: baseURL + "", backgroundImage: baseURL + "" };
        }
    }

    async sendApiRequest() {
        try {
            //Assign the promise unresolved first then get the data using the json method.
            const mobileNumberApiCall = await axios.get('login.php');
            const mobileNumberList = mobileNumberApiCall.data;
            this.setState({ mobileNumberFromDataBase: mobileNumberList.numbers, loading: false });
        } catch (err) {
            Alert.alert(strings.commonFields.alertTitle, err, [{ text: strings.commonFields.okButton }]);
        }
    }

    async _onLanguageChange(language) {
        const prevLanguage = await Language.get()
        if (language != prevLanguage) {
            const status = await Language.change(language);
            if (status) {
                this.setState({ language: language });
                strings.setLanguage(language);
                this.setState({ page: strings.login });
                this.setImage();
            }
        }
    }

    submitForm() {
        var reg = /^[0-9]+$/
        if (this.state.mobileNo == null) {
            Alert.alert(strings.commonFields.alertTitle, this.state.page.validation.mobileError, [{ text: strings.commonFields.okButton }]);
        } else if (this.state.mobileNo.length < 8) {
            Alert.alert(strings.commonFields.alertTitle, this.state.page.validation.lengthError, [{ text: strings.commonFields.okButton }]);
        } else if (!reg.test(this.state.mobileNo)) {
            Alert.alert(strings.commonFields.alertTitle, this.state.page.validation.others, [{ text: strings.commonFields.okButton }]);
        } else {
            this.checkMobileNo();
        }
    }

    async checkMobileNo() {
        const { mobileNo: number } = this.state;
        await axios.post('login.php', { number })
            .then(r => r.data)
            .then(response => (response.error == true ? { error: true } :
                { ...response.numbers, error: false }))
            .then(response => {
                console.log(response)
                if (response.error == true) {
                    this.setState({ mobileNo: '' });
                    this.props.navigation.navigate('visit_page', { language: strings });
                } else if (response.error == false) {
                    this.setState({ mobileNo: '' });
                    this.props.navigation.navigate('welcome_customer', {
                        measurement: response.n_metere,
                        language: strings,
                        mobileNo: number,
                        customerName: response.n_name,
                        measurementDate: response.n_last_mesurement_date,
                        emailID: response.n_email,
                        measurementDone: !!parseInt(response.measurement_done),
                        newCustomer: false
                    });
                } else {
                    Alert.alert(strings.commonFields.alertTitle, strings.reviewScreen.error, [{ text: strings.commonFields.okButton }]);
                }
            })
            .catch(e => {
                console.log("Error login: ", e);
                Alert.alert(strings.commonFields.alertTitle, strings.reviewScreen.error, [{ text: strings.commonFields.okButton }]);
            })
    }

    requestExecutiveVisit() {
        this.props.navigation.navigate('executive_visitpage', { language: strings });
    }

    visitToShop() {
        this.props.navigation.navigate('visit_to_shoppage', { language: strings });
    }

    render() {
        let screen = this.state.page;
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;
        console.log(this.state.logo)
        // alert("LOGO: " + this.state.logo.backgroundImage)
        if (!this.state.logoLoaded) {
            return (
                <SafeAreaView style={{ flex: 1 }} >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                        <ActivityIndicator size={isIos?'large':40} color={'#0451A5'} />
                    </View>
                </SafeAreaView>
            )

        }
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View keyboardShouldPersistTaps={'always'} style={{ flex: 1, borderColor: '#0451A5', borderRadius: 8 }}>
                <ScrollView>
                    <AppLogo source={this.state.logo} logoLoaded={this.state.logoLoaded} height={this.state.imageHeight} />

                    <ImageBackground keyboardShouldPersistTaps={'always'} source={{ uri: this.state.logo.backgroundImage }}
                        style={{ flex: 3, borderRadius: 10, resizeMode: 'cover' }} >
                        
                            <Content keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                                <View style={{ marginVertical: 10 }} >
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 40 }}>
                                        <View>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{screen.enterMobile}</Text>
                                        </View>
                                        <Form>
                                            <Item style={{ marginLeft: 0, marginTop: 10, height: 40, width: width - 80, backgroundColor: '#d1e2ff', borderRadius: 5 }}>
                                                {!strings.isRTL ?
                                                    <Image style={{ width: 30, height: 25, marginLeft: 5 }} source={require('../../img/basic1-035_mobile_phone-512.png')} /> : null}
                                                <TextInput selectionColor={'rgba(4,101,227,0.44)'}
                                                    style={{ textAlign: strings.isRTL ? 'right' : 'left', width: '80%', height: 50, fontSize: 15 }}
                                                    keyboardType='numeric'
                                                    value={this.state.mobileNo}
                                                    onChangeText={(text) => this.setState({ mobileNo: text })}
                                                    maxLength={9}
                                                />
                                                {strings.isRTL ?
                                                    <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Image style={{ width: 20, height: 25, marginHorizontal: 5 }} source={require('../../img/basic1-035_mobile_phone-512.png')} />
                                                    </View>
                                                    : null}
                                            </Item>
                                        </Form>
                                        <View style={{ marginTop: 15 }}>
                                            <Button style={{ backgroundColor: '#0451A5', width: width - 80, height: 40, borderRadius: 10, justifyContent: 'center' }}
                                                onPress={() => this.submitForm()}>
                                                <Text style={{ fontSize: 18, color: 'white' }}>{screen.submitButton}</Text>
                                            </Button>
                                        </View>
                                    </View>
                                    <View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{screen.or}</Text>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                                            <Button style={{ backgroundColor: '#0451A5', width: width - 80, height: 40, borderRadius: 10, justifyContent: 'center', }}
                                                onPress={() => this.props.navigation.navigate('sample_measure', { language: strings, })}>
                                                <Text style={{ fontSize: 18, color: 'white' }}>{screen.sendSampleButton}</Text>
                                            </Button>
                                            <Button style={{ backgroundColor: '#0451A5', width: width - 80, height: 40, borderRadius: 10, justifyContent: 'center', marginTop: 15 }}
                                                onPress={() => this.props.navigation.navigate('write_measure', { language: strings })}>
                                                <Text style={{ fontSize: 18, color: 'white' }}>{screen.writeMeasurementButton}</Text>
                                            </Button>
                                            <Button style={{ backgroundColor: '#0451A5', width: width - 80, height: 40, borderRadius: 10, justifyContent: 'center', marginTop: 15 }}
                                                onPress={() => {
                                                    let { shopTitle, fabricsLabel, productsLabel } = strings.fabricScreen;
                                                    this.props.navigation.navigate('fabrics_and_products', {
                                                        language: strings, measurement: 0,
                                                        noOfPieces: 0, mobileNo: 0,
                                                        inHomeCount: 0, outsideCount: 0,
                                                        isCountNeeded: false,
                                                        productsOnly: false, measurementDone: false,
                                                        fabricsEnabled: true, productsEnabled: true, shopTitle,
                                                        fabricsLabel, productsLabel, mustBuyProduct: true,
                                                        withoutLogin: true
                                                    })
                                                }}>
                                                <Text style={{ fontSize: 18, color: 'white' }}>{screen.buyButton}</Text>
                                            </Button>
                                            <View style={{ marginVertical: 10, alignSelf: 'center', flexDirection: 'row', }}>
                                                <Text style={{ fontSize: 15 }}>Change language to : </Text>
                                                <TouchableOpacity onPress={() => this._onLanguageChange('en')}>
                                                    <Text style={{ color: this.state.language == 'en' ? '#0451A5' : '#a2a2a2', fontSize: 15 }}>English  </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => this._onLanguageChange('ar')}>
                                                    {/**Language Arabic - العربية**/}
                                                    <Text style={{ color: this.state.language == 'ar' ? '#0451A5' : '#a2a2a2', fontSize: 15 }}>العربية</Text>
                                                </TouchableOpacity>
                                            </View>

                                        </View>
                                    </View>
                                    <View style={{ width: width - 80, flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 10, alignSelf: 'center' }}>
                                        <Icon label={screen.textUs} screen={screen} strings={strings} link={'https://wa.me/96522252585'} path={require('../../img/whatsapp_blue.png')} />
                                        <Icon label={strings.visitToShopPage.qurain} screen={screen} strings={strings} link={'https://goo.gl/maps/M4YDSRUrgARVrmoQ9'} path={require('../../img/pinwhite.png')} />
                                        <Icon label={strings.visitToShopPage.awqaf} screen={screen} strings={strings} link={'https://goo.gl/maps/QG8Ma8ciQfQJxNnZ9'} path={require('../../img/pinwhite.png')} />
                                        <Icon label={screen.callUs} screen={screen} strings={strings} link={'tel:+96522252585'} path={require('../../img/login_icons/b2t.png')} />
                                    </View>
                                </View>
                            </Content>
                       
                    </ImageBackground>

                    </ScrollView>

                </View>
            </SafeAreaView>
        );
    }
}

const Icon = ({ link, strings, screen, path, label }) => (
    <View style={{ borderWidth: 0.1, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={() => {
            Linking.canOpenURL(link)
                .then(supported => {
                    if (!supported) {
                        Alert.alert(strings.commonFields.alertTitle, screen.installWhatsApp, [{ text: strings.commonFields.okButton }]);
                    } else {
                        return Linking.openURL(link);
                    }
                })
                .catch(err => console.error('An error occurred', err));
        }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Image style={{ height: 50, resizeMode: 'contain' }} source={path} />
                <B style={{ color: '#0451A5' }}>{label}</B>
            </View>
        </TouchableOpacity>
    </View>
)

function AppLogo({ logoLoaded, height, source }) {
    const [marginTop, setMarginTop] = useState(height * .60);
    return (
        <View style={{ flex: 2 }}>
            {logoLoaded ?
                <ImageProgress style={{ height, resizeMode: 'contain', width: width }}
                    source={source}
                    // onLoad={() => setMarginTop(10)}
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

