import React, { Component, useState } from 'react';
import { View, Text, Image, Dimensions, Linking, SafeAreaView, ScrollView, Alert } from 'react-native';
import RadioForm from './components/RadioForm'
import { Button, Content } from "native-base";

import axios, { baseURL } from "./axios/AxiosInstance";
import ImageProgress from 'react-native-image-progress';
import ProgressCircle from 'react-native-progress/Circle';



const { width } = Dimensions.get('window');
export default class WelcomeCustomer extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 },
            headerTintColor: '#fff',
        };
    };
    state = {
        language: this.props.navigation.getParam('language'),
        email: this.props.navigation.getParam('emailID'),
        customerName: '',
        measurementDate: '',
        mobileNo: '', value: 0,

        logo: { uri: "" },
        logoLoaded: false,
        sizeDone: false,
        imageHeight: 50,
    }

    componentDidMount() {
        this.setImage();
        // this.props.navigation.navigate('review', {
        //     language: strings,
        //     order_id: 1531,
        // })
        // this.props.navigation.navigate('fabrics_and_products', {
        //         language: strings,
        //         order_id: 1531,
        //     })
    }

    moveFunction(value, customerName, measurementDate, mobileNo) {
        // console.log("sakba data to renew: " , this.state)
        email = this.props.navigation.state.params.emailID;
        this.setState({ value, customerName, measurementDate, mobileNo })
    }

    _onPressOK(mobileNo, customerName) {
        const { value, measurementDate } = this.state;
        if (value == 0) {
            this.props.navigation.navigate('dishdasha_select', {
                measurement: this.props.navigation.getParam('measurement'),
                language: this.state.language,
                mobileNo: mobileNo,
                customerName: customerName,
                measurementDate: measurementDate,
                emailID: this.state.email,
                measurementDone: this.props.navigation.getParam('measurementDone'),
            });
        } else {
            this.props.navigation.navigate('visit_page', { language: this.state.language });
        }
    }

    async getLogo() {
        try {
            let response = await axios.get('get_logo.php');
            response = response.data;
            if (!response.error) {
                return { uri: baseURL + response?.logo?.logo2 };
            }
            return { uri: baseURL + response?.logo?.logo2 };
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
        var screen = this.state.language.welcomeCustomer;
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;
        const { navigation } = this.props;
        const isRTL = this.state.language.isRTL;
        var mobileNo = this.props.navigation.state.params.mobileNo;
        const customerName = navigation.getParam('customerName', '');
        const measurementDate = navigation.getParam('measurementDate', '');
        const newCustomer = navigation.getParam('newCustomer', false);

        console.log(customerName, measurementDate, mobileNo)
        return (
            <Content>
                <SafeAreaView style={{ backgroundColor: '#fff' }} >
                    <ScrollView style={{ paddingBottom: 30 }}>
                        <AppLogo source={this.state.logo} logoLoaded={this.state.logoLoaded} height={this.state.imageHeight} />
                        {/* <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                            <AppLogo source={this.state.logo} logoLoaded={this.state.logoLoaded} height={this.state.imageHeight} />
                            <Image style={{ width: 80, height: 80 }} source={require('../img/om.png')} />
                        </View> */}
                        <View style={{ flexDirection: 'column', marginHorizontal: 40, paddingHorizontal: 0 }}>
                            <View style={{ marginTop: 20, flexDirection: 'column', alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                                <Text style={{ fontSize: 20, textAlign: isRTL ? 'right' : 'left' }}>{screen.wText1}<Text
                                    style={{ fontWeight: '500' }}>{customerName}</Text></Text>
                                <Text style={{ fontSize: 20, textAlign: isRTL ? 'right' : 'left', marginTop: 10 }}>{screen.wTextMeasure}{measurementDate}</Text>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontSize: 20, textAlign: isRTL ? 'right' : 'left', alignSelf: isRTL ? 'flex-end' : 'flex-start' }}>
                                    {newCustomer ? screen.measureAccept : screen.acceptText}
                                </Text>
                                <View style={{ marginTop: 10 }}>
                                    <RadioForm isRTL={this.state.language.isRTL}
                                        radio_props={[
                                            { label: screen.agree, value: 0 },
                                            { label: screen.needNew, value: 1 }
                                        ]}
                                        buttonColor='#0451A5' radioSize={22}
                                        onPress={(value) => this.moveFunction(value, customerName, measurementDate, mobileNo)}
                                    />
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={{ marginBottom: 10 }}>
                        <Button
                            style={{ backgroundColor: '#0451A5', alignSelf: 'center', width: width - 100, height: 40, justifyContent: 'center' }}
                            onPress={() => this._onPressOK(mobileNo, customerName)}>
                            <Text style={{ fontSize: 18, color: 'white' }}>{screen.okButton}</Text>
                        </Button>
                    </View>
                </SafeAreaView>
            </Content>
        );
    }
}



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