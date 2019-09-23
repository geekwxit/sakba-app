import React, { Component } from "react";
import {
    View, Text, StyleSheet, AsycStorage, Button, TouchableOpacity,
    TextInput, Alert, Image, ScrollView, Dimensions, Modal, ActivityIndicator, BackHandler
} from "react-native";

import { StackActions, NavigationActions } from 'react-navigation';

// import Loader from '../components/Loader'



const { width, height } = Dimensions.get('window');

const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'login' }),
    ],
});

class SignUpScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Send Details',
            headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 },
            headerTintColor: '#fff',
            headerLeft: null
        };
    };
    constructor(props){
        super(props);
        console.log("this is data: ", props.navigation.getParam('customerName'));
        console.log("amount " , props.navigation.getParam('totalAmount'));
    }

    state = {
        fullname: this.props.navigation.state.params.customerName, ph_number: this.props.navigation.state.params.mobileNo, email: this.props.navigation.state.params.emailID, pass: null, confirm_pass: null,
        amount: Number(this.props.navigation.state.params.totalAmount).toString(), //service: null,
        address: null, //token: this.props.navigation.state.params.mobileNo,
        token: this.props.navigation.state.params.token,
        error: '', sign_up: false, prevError: false, errorMsg: null, isLoading: false
    }



    componentDidMount() {
        this.backhandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.dispatch(resetAction);
            return true;
        });
    }

    componentWillUnmount() {
        this.backhandler.remove();
    }


    register() {
        const { fullname, pass, ph_number, confirm_pass, email, amount, address, mobileNo, token } = this.state

        // var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        // var email_re_status = re.test(email);

        // var pass_re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        // var pass_re_status = pass_re.test(pass)

        // var name_re = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
        // var name_re_status = name_re.test(fullname.toLowerCase())

        // var phone_re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
        // var phone_re_status = phone_re.test(ph_number)

        // if (!name_re_status) {
        //     alert('Pls Enter your Fullname only with alphabets');
        // } else if (!email_re_status) {
        //     alert('Please enter valid email address');
        // } else if (!phone_re_status) {
        //     alert('Pls Enter your Mobile Number only in 10 numeric');
        // } else if (!pass_re_status) {
        //     alert('Pls enter a strong  password of 6 to 16 chars include at least one char and one number');
        // } else if (pass != confirm_pass) {
        //     alert('Password and Confirm Password should be same');
        // } else {
        var data = JSON.stringify({
            token,
            fullname,
            ph_number,
            email,
            //service,
            amount, address
        })
        console.log("object", data)
            this.setState({isLoading: true});
            this.sendApiRequest(data)
        // this.props.signUp(data)
        // }
    }

    async sendApiRequest(data) {
        //this.setState({ isLoading: true })
        //try {
            //Assign the promise unresolved first then get the data using the json method.
         await axios.post('http://sakba.net/mobileApi/requestPayment.php',data)
                .then(response=>{return response.data})
                .then(response=>{
                    console.log("sender", data);
                    if(!response.error){
                        //debugger;
                        this.setState({ isLoading: false });
                        Alert.alert('Alert', "Thanks we have receieved your request. Complete your order by making payment.", [
                            {text: 'Yes', onPress: ()=>{this.setState({isLoading: false}); this.props.navigation.dispatch(resetAction)}}
                        ])
                    }
                    else {
                        //debugger;
                        this.setState({ isLoading: false });
                        Alert.alert('Alert', "Something wrong in your network.", [
                            {text: 'Yes', onPress: ()=>{this.setState({isLoading: false}); this.props.navigation.dispatch(resetAction)}}
                        ])
                    }
                })
             .catch(e=>{
                this.setState({ isLoading: false });
                Alert.alert('Alert', "Something wrong in your network.", [
                    {text: 'Yes', onPress: ()=>{this.setState({isLoading: false}); this.props.navigation.dispatch(resetAction)}}
                ])
             });

            //const response = await Axios.post('http://sakba.net/mobileApi/requestPayment.php', data);
        //}
        // catch (err) {
        //     alert("Something wrong in your network");
        //     console.log("Error fetching data-----------", err);
        //     this.setState({ isLoading: false });
        //      this.props.navigation.dispatch(resetAction);
        // }
    }

    render() {

        Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

        const { isLoading } = this.state
        console.log(isLoading, "isLoading state")

        return (
            <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ justifyContent: 'center', backgroundColor: '#fff' }}>

                    <View style={{ flex: 1 / 6, flexDirection: 'row', justifyContent: 'center', marginVertical: 20 }}>
                        <Image style={{ width: 80, height: 80 }} source={require('../img/om.png')} />
                    </View>

                    <View>
                        {/* <Text style={{color:'#333',paddingHorizontal:50,marginBottom:10,fontSize:16}}>Full Name</Text> */}
                        <View style={styles.input}>
                            <TextInput
                                value ={this.state.fullname}
                                autoCapitalize='none'
                                placeholder='Enter Fullname'
                                style={styles.TextInput}
                                placeholderTextColor={'grey'}
                                onChangeText={(fullname) => { this.setState({ fullname }) }} />
                        </View>

                        {/* <Text style={{color:'#333',paddingHorizontal:50,marginBottom:10,fontSize:16}}>Contact Number</Text> */}
                        <View style={styles.input}>
                            <TextInput
                                value = {this.state.ph_number}
                                autoCapitalize='none'
                                placeholder='Enter Contact Number'
                                style={styles.TextInput}
                                placeholderTextColor={'grey'}
                                onChangeText={(ph_number) => { this.setState({ ph_number }) }} />
                        </View>

                        {/* <Text style={{color:'#333',paddingHorizontal:50,marginBottom:10,fontSize:16}}>Email ID</Text> */}
                        <View style={styles.input}>
                            <TextInput
                                value = {this.state.email}
                                autoCapitalize='none'
                                placeholder='Enter Email ID'
                                style={styles.TextInput}
                                placeholderTextColor={'grey'}
                                onChangeText={(email) => { this.setState({ email }) }} />
                        </View>

                        {/* <Text style={{color:'#333',paddingHorizontal:50,marginBottom:10,fontSize:16}}>Password</Text> */}
                        <View style={styles.input}>
                            <TextInput
                                autoCapitalize='none'
                                // secureTextEntry={true}
                                placeholder='Enter Adrress'
                                style={styles.TextInput}
                                placeholderTextColor={'grey'}
                                onChangeText={(address) => { this.setState({ address }) }} />
                        </View>

                        {/* <Text style={{color:'#333',paddingHorizontal:50,marginBottom:10,fontSize:16}}>Confirm Password</Text> */}
                        {/*<View style={styles.input}>*/}
                        {/*    <TextInput*/}
                        {/*        autoCapitalize='none'*/}
                        {/*        // secureTextEntry={true}*/}
                        {/*        placeholder='Enter Service'*/}
                        {/*        style={styles.TextInput}*/}
                        {/*        placeholderTextColor={'grey'}*/}
                        {/*        onChangeText={(service) => { this.setState({ service }) }} />*/}
                        {/*</View>*/}
                        <View style={styles.input}>
                            <TextInput
                                value = {this.state.amount + " KD"}
                                autoCapitalize='none'
                                // secureTextEntry={true}
                                placeholder='Enter Amount'
                                editable = {false}
                                style={styles.TextInput}
                                placeholderTextColor={'grey'}
                            //    onChangeText={(amount) => { this.setState({ amount }) }}
                            />
                        </View>

                        <TouchableOpacity style={styles.button} onPress={() => this.register()}>
                            <Text style={styles.buttonText}>Send Details</Text>
                        </TouchableOpacity>

                    </View>
                    {/*
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#333', paddingBottom: 20, paddingTop: 10 }}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('SignIn')} style={{ marginBottom: 30 }}>
                            <Text style={{ fontSize: 18, fontWeight: '700', textAlign: 'center', color: '#FF8200' }}> SIGN IN</Text>
                        </TouchableOpacity>
                    </View> */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.isLoading}
                        onRequestClose={() => {
                            this.setState({ isLoading: false })
                        }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0000004d' }}>
                            <ActivityIndicator size={'large'} color="#0451A5" />
                        </View>
                    </Modal>

                </View>
            </ScrollView>
        );
    }
}

export default SignUpScreen;
const styles = StyleSheet.create({
    logo: { width: 200, resizeMode: 'contain', },

    input: { borderWidth: 1, borderColor: 'grey', marginHorizontal: 50, paddingLeft: 15, borderRadius: 15, marginBottom: 15, height: 45 },
    TextInput: { fontSize: 16, color: '#333' },
    button: { marginTop: 10, marginHorizontal: 50, },
    buttonText: {
        borderWidth: 1,
        fontSize: 16,
        fontWeight: '700',
        padding: 12,
        textAlign: 'center',
        color: '#fff',
        borderColor: 'grey',
        backgroundColor: '#5CAA16',
        borderRadius: 15,
    }
});
