import React from "react";
import { View, Text, TouchableOpacity, Modal, WebView, ActivityIndicator, BackHandler } from "react-native";
import { Icon } from 'native-base';
import { StackActions, NavigationActions } from 'react-navigation';


const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'login' })],
});

export default class PayPal extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Checkout',
            headerLeft:(<TouchableOpacity onPress={()=>{navigation.dispatch(resetAction)}}>
                <Icon name="md-arrow-back" size={20} style={{paddingLeft:20 , color:'#fff'}}/>
            </TouchableOpacity>),
            headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 },
            headerTintColor: '#fff',
        };
    };

    state = {
        showModal: false,
        status: "Pending",
        isLoading: false
    };
    constructor(props) {
        super(props);
    }


    componentDidMount() {
        this.setState({ isLoading: true })
        this.backhandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.dispatch(resetAction);
            return true;
        });
    }

    componentWillUnmount(){
        this.backhandler.remove();
    }

    handleResponse = data => {
        if (data.title === "success") {
            this.setState({ showModal: false, status: "Complete" });
        } else if (data.title === "cancel") {
            this.setState({ showModal: false, status: "Cancelled" });
        } else {
            return;
        }
    };
    handleBackButtonClick() {
        // alert('you are in back')
        return true;
    }
    render() {

        var url = this.props.navigation.state.params.url;

        return (
            <View style={{ marginTop: 10, flex: 1 }}>
                <WebView
                    source={{ uri: url }}
                    onLoadEnd={() => this.setState({ isLoading: false })}
                // onNavigationStateChange={data =>
                //     this.handleResponse(data)
                // }
                // injectedJavaScript={`document.f1.submit()`}
                />
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


                {/* <TouchableOpacity
                    style={{ width: 300, height: 100 }}
                    onPress={() => this.setState({ showModal: true })}
                >
                    <Text>Pay with Paypal</Text>
                </TouchableOpacity>
                <Text>Payment Status: {this.state.status}</Text> */}
            </View >
        );
    }
}
