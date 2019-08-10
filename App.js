import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import SplashScreen from './src/SplashScreen';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import Login from './src/login/Login';
import WelcomeCustomer from './src/WelcomeCustomer';
import customerAgree from './src/customerAgree';
import VisitPage from './src/VisitPage';
import VisitToShopPage from './src/VisitToShopPage';
import ExecutiveVisitPage from './src/ExecutiveVisitPage';
import OrderDetail from './src/OrderDetail';
import OrderConfirm from './src/OrderConfirm';
import Paypal from './src/PayPal'

const AppNavigator = createStackNavigator(
  {
    login: Login,
    welcome_customer: WelcomeCustomer,
    customer_agree: customerAgree,
    visit_page: VisitPage,
    visit_to_shoppage: VisitToShopPage,
    executive_visitpage: ExecutiveVisitPage,
    order_detail: OrderDetail,
    order_confirm: OrderConfirm,
    paypal: Paypal
  },
  {
    initialRouteName: "login",
    initialRouteParams: { selected: false }
  }
);

const AppContainer = createAppContainer(AppNavigator);


export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      timePassed: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setTimePassed();
    }, 2000);
  }

  setTimePassed() {
    this.setState({ timePassed: true });
  }

  render() {
    if (!this.state.timePassed) {
      return <SplashScreen />;
    } else {
      return <AppContainer />;
    }
  }
}
