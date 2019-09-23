//This is the code to have a screen for 2 second and then navigate to another page

import React,{Component}from 'react';
import {ScrollView, View, Text, Image, Dimensions, TouchableOpacity, BackHandler} from 'react-native';
import {Button} from 'native-base';
import {NavigationActions, StackActions} from "react-navigation";

const { width, height } = Dimensions.get('window');

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'login' })],
});


export default class  OrderConfirm extends Component<Props>{
    static navigationOptions = ({ navigation }) => {
        return{
            headerStyle:{ backgroundColor:'#0451A5',marginLeft:0},
            headerTintColor: '#fff',
            title: 'Checkout',
            headerLeft: null
        };
    };
    constructor(props){
        super(props)
    }
    componentDidMount() {
        //setTimeout( () => {this.load()}, 2000);
        this.backhandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.dispatch(resetAction);
            return true;
        });
    }
    render(){

        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;

        const { navigation } = this.props;
        const customerName= navigation.getParam('customerName', '');
        //const measurementDate= navigation.getParam('measurementDate', '');
        const order_id = navigation.getParam('orderID', 'ORDERID');

        const textStyle = {fontSize: 25}


        return(
            <ScrollView>
            <View>
                <View style={{flexDirection:'row',justifyContent:'center',marginTop:20}}>
                    <Image style={{width:150,height:150}} source={require('../img/success.png')} />
                </View>
                <View style={{flexDirection:'column',alignItems:'center',marginTop:40}}>
                    <View style={{alignItems: 'center'}}>
                        <Text style={{fontSize: 40}}>Order </Text>
                        <Text style={{fontSize: 40}}>Successful</Text>

                        <Text style={{fontSize:28, marginTop: 10}}>{customerName}</Text>
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
        var orderid = this.props.navigation.getParam('orderID', null);

        this.props.navigation.navigate('review', {order_id: orderid, deliveryDate: this.props.navigation.getParam('deliveryDate', null)});
    }
}
