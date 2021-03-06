import React, { Component } from 'react';
import { ScrollView, View, Text, Image, Dimensions, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { NavigationActions, StackActions } from "react-navigation";
import { TextInput } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window');
const sendIconBlue = require('../img/send_icon_blue.png');
import Icon from 'react-native-vector-icons/Ionicons';
import axios from "./axios/AxiosInstance";
import {strings} from "../locales/Language";

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'login' })],
});


export default class PaymentSuccesss extends Component<Props>{
    static navigationOptions = ({ navigation }) => {
        var others = navigation.getParam('language').isRTL ?
            { headerRight: <Text style={{ color: 'white', fontSize: 20 % (width * height), padding: 15 }}>{navigation.getParam('language').confirmScreen.screenTitle}</Text> } :
            { title: navigation.getParam('language').confirmScreen.screenTitle }
        others = { ...others, headerLeft: <Icon onPress={() => navigation.dispatch(resetAction)} color={'white'} size={25} style={{ padding: 15 }} name={'ios-arrow-back'} /> };
        return {
            headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 },
            headerTintColor: '#fff',
            headerLeft: null,
            ...others
        };
    };
    constructor(props) {
        super(props)
        this.state = {
            language: props.navigation.getParam('language'),
            email: '',
            orderID: props.navigation.getParam('orderID', null),

            mail_Button: false,
        };
        this.sendMail = this.sendMail.bind(this);
    }
    componentDidMount() {
        this.setState({ language: this.props.navigation.getParam('language') })
        this.backhandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.dispatch(resetAction);
            return true;
        });
    }

    componentWillUnmount() {
        this.backhandler.remove();
    }

    async sendMail() {
        var screen = this.state.language.confirmScreen;
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const lang = strings.getLanguage();
        if (this.state.email.match(regex)) {
            this.setState({ mail_Button: true });
            await axios.post('../mailtouser.php', { email: this.state.email, lang, Orderid: this.state.orderID })
                .then(response => response.data)
                .then(response => {
                    if (!response.error) {
                        Alert.alert(this.state.language.commonFields.alertTitle, screen.paymentEmailSuccess, [{ text: this.state.language.commonFields.okButton }]);
                    }
                    else {
                        Alert.alert(this.state.language.commonFields.alertTitle, screen.regularError, [{ text: this.state.language.commonFields.okButton }]);
                        console.log("response has error", response);
                    }
                })
                .catch(error => {
                    console.log("LOG ERROR: ", error);
                    Alert.alert(this.state.language.commonFields.alertTitle, screen.regularError, [{ text: this.state.language.commonFields.okButton }]);
                })
                .finally(()=>this.setState({ mail_Button: false }));
        }
        else {
            Alert.alert(this.state.language.commonFields.alertTitle, screen.emailError, [{ text: this.state.language.commonFields.okButton }]);
        }
    }

    render() {
        var screen = this.state.language.confirmScreen;
        var isRTL = this.state.language.isRTL;
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;
        const { navigation } = this.props;
        const customerName = navigation.getParam('customerName', '');
        const textStyle = { fontSize: 25 };
        return (
            <ScrollView keyboardShouldPersistTaps={'handled'} >
                <View style={{ paddingBottom: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                        <Image style={{ width: 150, height: 150 }} source={require('../img/success.png')} />
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 40 }}>{screen.paymentSuccess1}</Text>
                            <Text style={{ fontSize: 40 }}>{screen.paymentSuccess2}</Text>

                            <Text style={{ fontSize: 28, marginTop: 10 }}>{customerName}</Text>
                            <View style={{ width: width, marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ width: width * 0.65, alignItems: 'center', flexDirection: 'row', height: 50, borderRadius: 30, borderWidth: 3, borderColor: '#D8D8D8' }}>
                                    {!isRTL ? <View style={{ flex: 1 }}>
                                        <TextInput selectionColor={'rgba(4,101,227,0.44)'} placeholder={screen.pEmail} style={{ fontSize: 15, paddingLeft: 10, paddingRight: 10 }} onChangeText={(email) => this.setState({ email })} />
                                    </View> : null}
                                    <View style={{ width: 40, height: 40, paddingHorizontal: 5 }}>
                                        <TouchableOpacity disabled={this.state.mail_Button} style={{ flex: 1 }} onPress={this.sendMail}>
                                            <Image style={{ transform: [{ rotate: isRTL ? '180deg' : '0deg' }], resizeMode: 'contain', flex: 1, width: null, height: null }} source={sendIconBlue} />
                                        </TouchableOpacity>
                                    </View>
                                    {isRTL ? <View style={{ flex: 1 }}>
                                        <TextInput selectionColor={'rgba(4,101,227,0.44)'} placeholder={screen.pEmail} style={{ textAlign: 'right', fontSize: 15, paddingLeft: 10, paddingRight: 10 }} onChangeText={(email) => this.setState({ email })} />
                                    </View> : null}
                                </View>
                            </View>
                            <Text style={[textStyle, { marginTop: 20 }]}>{screen.paymentConfirmMsg1}</Text>
                            <Text style={textStyle}>{screen.paymentConfirmMsg2}</Text>
                            <Text style={[textStyle, {marginTop:5, borderWidth: 2, fontSize:18, borderColor: '#0451A5',color: '#0451A5', padding:5, borderRadius: 10}]}>{this.state.orderID}</Text>
                            <TouchableOpacity onPress={() => this.reviewOrder()}>
                                <View style={{ padding: 10, paddingLeft: 20, marginTop: 20, paddingRight: 20, alignItem: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: '#0451A5' }}>
                                    <Text style={{ color: 'white', fontSize: 15 }}>{screen.reviewButton}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }

    reviewOrder() {
        this.props.navigation.navigate('review', {
            measurement: this.props.navigation.getParam('measurement', null),
            language: this.state.language,
            order_id: this.state.orderID,
            deliveryDate: this.props.navigation.getParam('deliveryDate', null)
        })
    }
}
