import React, { Component } from 'react';
import { Alert, View, Text, Image, Dimensions, SafeAreaView, TextInput, TouchableOpacity, Linking, ScrollView }
    from 'react-native';
import { Form, Item, Container, Content, Button, } from 'native-base';
import axios from "./axios/AxiosInstance";
const { width, height } = Dimensions.get('window');
import { strings } from '../locales/Language'
import { FlatList } from 'react-native-gesture-handler';
// import {strings} from './components/ChangeLanguage';

class SampleMeasurement extends Component {
    static navigationOptions = ({ navigation }) => {
        // const language = strings;
        const language = navigation.getParam('language');
        const others = language.isRTL ?
            { headerRight: <Text style={{ color: 'white', fontSize: 20 % (width * height), padding: 15 }}>{language.measurementScreen.title}</Text> } :
            { title: language.sampleMeasurementScreen.title };

        return { headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 }, headerTintColor: '#fff', ...others };
    };

    constructor(props) {
        super(props);
        this.state = {
            mobile: '', name: '', meter: '',
            language: props.navigation.getParam('language'),
            noOfPieces: 0,
            Button_True: false
        };
    }

    async submitForm() {
        const { mobile, name, meter } = this.state;
        if (mobile.toString().trim() && name.toString().trim() && meter.toString().trim()) {
            await axios.post('addmesurment.php', { mobile, name, meter })
                .then(response => response.data)
                .then(response => {
                    if (response.error) {
                        Alert.alert(this.state.language.commonFields.alertTitle, response.msg, [{ text: this.state.language.commonFields.okButton }]);
                    } else {
                        if (response.data_added) {
                            Alert.alert(this.state.language.commonFields.alertTitle, response.msg, [{ text: this.state.language.commonFields.okButton }]);
                            this.props.navigation.navigate('welcome_customer', {
                                measurement: response.measure,
                                language: this.state.language,
                                mobileNo: response.mobile,
                                customerName: response.name,
                                measurementDate: response.date,
                                emailID: response.email,
                                measurementDone: !!parseInt(response.measurement_done),
                                newCustomer: true
                            });
                            this.setState({ Button_True: false })
                        } else {
                            this.setState({ Button_True: false })
                            Alert.alert(this.state.language.commonFields.alertTitle, response.msg, [{ text: this.state.language.commonFields.okButton }]);
                        }
                    }
                })
                .catch(e => {
                    this.setState({ Button_True: false })
                    Alert.alert(this.state.language.commonFields.alertTitle, this.state.language.commonError, [{ text: this.state.language.commonFields.okButton }]);
                })
        } else {
            this.setState({ Button_True: false })
            Alert.alert(this.state.language.commonFields.alertTitle, this.state.language.sampleMeasurementScreen.detailsRequired, [{ text: this.state.language.commonFields.okButton }]);
        }
    }

    render() {
        const screen = this.state.language.sampleMeasurementScreen;
        const isRTL = this.state.language.isRTL;
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;
        return (
            <Container>
                <Content keyboardShouldPersistTaps={'always'}>
                    <SafeAreaView style={{backgroundColor: '#fff'}}>
                        <ScrollView style={{ paddingBottom: 30 }}>
                            <View style={{ flex: 1 / 6, flexDirection: 'row', justifyContent: 'center', marginTop: 50 }}>
                                <Image style={{ width: 80, height: 80 }} source={require('../img/om.png')} />
                            </View>
                            <View style={{ marginTop: 50, justifyContent: 'center', alignItems: 'center', marginLeft: 40, marginRight: 40 }}>
                                <View>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                        {screen.heading}
                                    </Text>
                                </View>
                                <Form>
                                    <Input isRTL={isRTL} label={screen.nameLabel} onChangeText={(name) => { this.setState({ name }) }} value={this.state.name} />
                                    <Input maxLength={9} isRTL={isRTL} label={screen.mobileLabel} onChangeText={(mobile) => { this.setState({ mobile }) }} value={this.state.mobile} keyboardType={'numeric'} />
                                    <Input isRTL={isRTL} label={screen.metersLabel} onChangeText={(meter) => { this.setState({ meter }) }} value={this.state.meter} keyboardType={'numeric'} />
                                </Form>
                                <View style={{ marginTop: 25 }}>
                                    <Button disabled={this.state.Button_True}
                                        style={{
                                            backgroundColor: '#0451A5', width: width - 80, height: 40,
                                            justifyContent: 'center'
                                        }} onPress={() => { this.setState({ Button_True: true }), this.submitForm() }}>
                                        <Text style={{ fontSize: 18, color: 'white' }}>{screen.submitButton}</Text>
                                    </Button>
                                </View>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </Content>
            </Container>
        );
    }
}

export default SampleMeasurement;

const Input = ({ value, keyboardType, onChangeText, label, isRTL, maxLength = 30 }) => (
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
