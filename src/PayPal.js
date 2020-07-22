import React from "react";
import { View, Text, Dimensions,  ActivityIndicator} from "react-native";
import { StackActions, NavigationActions } from 'react-navigation';
import {WebView} from "react-native-webview";
const {width, height} =  Dimensions.get('window');

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'login' })],
});

export default class PayPal extends React.Component {
    static navigationOptions = ({ navigation }) =>{
        others = navigation.getParam('language').isRTL?
            {headerRight: <Text style={{color:'white', fontSize: 20%(width*height), padding: 15}}>{navigation.getParam('language').paypal.screenTitle}</Text>}:
            {title: navigation.getParam('language').paypal.screenTitle}
        return {
            // headerLeft:(<TouchableOpacity onPress={()=>{navigation.dispatch(resetAction)}}>
            //     <Icon name="md-arrow-back" size={20} style={{paddingLeft:20 , color:'#fff'}}/>
            // </TouchableOpacity>),
            headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 },
            headerTintColor: '#fff',...others
        };
    };


    constructor(props) {
        super(props);
        this.state = {
            language: props.navigation.getParam('language'),
            showModal: false,
            status: "Pending",
            isLoading: false,
            orderID: props.navigation.getParam('orderID', null),
        };
    }


    componentDidMount() {
        this.setState({language: this.props.navigation.getParam('language')})
        this.setState({ isLoading: true });
    }

    paymentStatus(data){
        let params = {
            measurement: this.props.navigation.getParam('measurement',null),
            language: this.state.language,
            customerName: this.props.navigation.getParam('customerName',null),
            emailID: this.props.navigation.getParam('emailID',null),
            orderID: this.state.orderID,
            deliveryDate: this.props.navigation.getParam('deliveryDate',null),
        }
        console.log("data:",data);
        if(data && data.paymentSuccess && data.data && data.data.order_id && data.data.order_id.trim()){
            this.props.navigation.navigate('order_confirm', params)
        } else {
            // this.props.navigation.navigate('PendingScreen');
        }
    }

    render() {
        var url = this.props.navigation.state.params.url;
        console.log(" URIIIII:    ", url);
        return (
            <View style={{ marginTop: 10, flex: 1 }}>
                <WebView
                    onLoadEnd={()=>this.setState({loading: false})}
                    javaScriptEnabledAndroid={true}
                    javaScriptEnabled={true}
                    // injectJavaScript={this.customScript}
                    // source={{uri: url}}
                    onMessage={event =>this.paymentStatus(JSON.parse(event.nativeEvent.data))}
                />
            </View >
        );
    }
}
