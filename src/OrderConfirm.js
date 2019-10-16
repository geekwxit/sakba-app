//This is the code to have a screen for 2 second and then navigate to another page

import React,{Component}from 'react';
import {ScrollView, View, Text, Image, Dimensions, TouchableOpacity, BackHandler} from 'react-native';
import {Button} from 'native-base';
import {NavigationActions, StackActions} from "react-navigation";
import { TextInput } from 'react-native-gesture-handler';
import Axios from 'axios';
import {oConfirm} from './Strings';
const { width, height } = Dimensions.get('window');
//const sendIcon = require('../img/send_icon.png');
const sendIconBlue = require('../img/send_icon_blue.png');


const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'login' })],
});


export default class  OrderConfirm extends Component<Props>{
    static navigationOptions = ({ navigation }) => {
        return{
            headerStyle:{ backgroundColor:'#0451A5',marginLeft:0},
            headerTintColor: '#fff',
            title: oConfirm.screenTitle,
            headerLeft: null
        };
    };
    constructor(props){
        super(props)
        this.state = {
            email : '',
            orderID: props.navigation.getParam('orderID', null)
        }
    }
    componentDidMount() {
        //setTimeout( () => {this.load()}, 2000);
        this.backhandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.dispatch(resetAction);
            return true;
        });
        console.log(this.props.navigation.state.params)
    }

    async sendMail(){
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(this.state.email.match(regex)){
            await Axios.post(oConfirm.sendEmailLink, {email: this.state.email, id: this.props.navigation.getParam('requestPaymentID', null), orderID: this.state.orderID})
            .then(response=>response.data)
            .then(response=>{
                if(!response.error){
                    alert(oConfirm.alertOnEmailSent);
                }
                else{alert(oConfirm.regularError);
                }
            })
            .catch(error=>{
                console.log("LOG ERROR: ", error);
                alert(oConfirm.regularError);
            })
        }
        else{
            alert(oConfirm.emailError);
        }
    }

    render(){

        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;

        const { navigation } = this.props;
        const customerName= navigation.getParam('customerName', '');
        //const measurementDate= navigation.getParam('measurementDate', '');

        const textStyle = {fontSize: 25}


        return(
            <ScrollView>
            <View style={{paddingBottom: 20}}>
                <View style={{flexDirection:'row',justifyContent:'center',marginTop:20}}>
                    <Image style={{width:150,height:150}} source={require('../img/success.png')} />
                </View>
                <View style={{flexDirection:'column',alignItems:'center',marginTop:40}}>
                    <View style={{alignItems: 'center'}}>
                        <Text style={{fontSize: 40}}>Order </Text>
                        <Text style={{fontSize: 40}}>Successful</Text>

                        <Text style={{fontSize:28, marginTop: 10}}>{customerName}</Text>
                        <View style={{width: width, marginTop: 10, justifyContent:'center', alignItems:'center'}}>
                                <View style={{width: width*0.65, alignItems:'center', flexDirection: 'row', height: 50,borderRadius:30, borderWidth: 3,borderColor: '#D8D8D8'}}>
                                    <View style={{flex:1}}>
                                        <TextInput placeholder="Enter your email here..." style={{fontSize: 15, paddingLeft:10, paddingRight: 10}} onChangeText={(email)=>this.setState({email})}/>
                                    </View>
                                    <View style={{width: 40, height: 40, paddingRight:10}}>
                                    <TouchableOpacity style={{flex:1}} onPress={()=>this.sendMail()}>
                                         <Image style={{resizeMode: 'contain', flex:1, width: null, height: null}} source={sendIconBlue} />
                                    </TouchableOpacity>
                                    </View>
                                </View>
                        </View>
                        <Text style={[textStyle, {marginTop: 20}]}>Your Order will be confirmed</Text>
                        <Text style={textStyle}>when you complete</Text>
                        <Text style={textStyle}>your payment</Text>


                            {/*<Text style={[textStyle, {marginTop: 10, color: 'grey'}]}>Your Order ID is</Text>*/}
                        <TouchableOpacity onPress={()=>this.reviewOrder()}>
                            <View style={{padding: 10,paddingLeft: 20,marginTop: 20, paddingRight: 20, alignItem:'center',justifyContent:'center', borderRadius: 10, backgroundColor: '#0451A5'}}>
                                <Text style={{color: 'white', fontSize: 15}}>REVIEW ORDER</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            </ScrollView>
        );
    }

    reviewOrder(){
        // this.state.emailSent?
        this.props.navigation.navigate('review', {order_id: this.state.orderID, deliveryDate: this.props.navigation.getParam('deliveryDate', null)})
        // : alert(oConfirm.reviewError);
    }
}
