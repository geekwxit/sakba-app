import React, { Component } from 'react';
import { Platform } from 'react-native';
import SplashScreen from './src/SplashScreen';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import Login from './src/login/Login';
import WelcomeCustomer from './src/WelcomeCustomer';
import DishdashaSelectionScreen from './src/DishdashaSelectionScreen';
import VisitPage from './src/VisitPage';
import VisitToShopPage from './src/VisitToShopPage';
import ExecutiveVisitPage from './src/ExecutiveVisitPage';
import OrderDetail from './src/OrderDetail';
import OrderConfirm from './src/OrderConfirm';
import Paypal from './src/PayPal';
import Review from './src/ReviewOrder';
import DeliveryOptions from "./src/DeliveryOptions";
import ProductsScreen from "./src/ProductsScreen";
import MeasurementScreen from "./src/MeasurementScreen";
import SampleMeasurement from "./src/SampleMeasurementScreen";
import FabricsAndProducts from "./src/FabricsAndProducts";
import SingleProduct from "./src/SingleProduct";
import PaymentSuccess from "./src/PaymentSuccess";
import ProductListing from "./src/GiftWrapping/ProductListing";

const AppNavigator = createStackNavigator(
  {
    login: Login,
    welcome_customer: WelcomeCustomer,
    dishdasha_select: DishdashaSelectionScreen,
    visit_page: VisitPage,
    visit_to_shoppage: VisitToShopPage,
    executive_visitpage: ExecutiveVisitPage,
    order_detail: OrderDetail,
    order_confirm: OrderConfirm,
    paypal: Paypal,
    review: Review,
    delivery: DeliveryOptions,
    Shop: ProductsScreen,
    write_measure: MeasurementScreen,
    sample_measure: SampleMeasurement,
    fabrics_and_products: FabricsAndProducts,
    single_product: SingleProduct,
    payment_success: PaymentSuccess,
    gift_product_listing: {
        screen: ProductListing,
        navigationOptions: {
            title: 'Shop'
        }
    }
  },
  {
      defaultNavigationOptions:{
        headerStyle: {
            backgroundColor: '#0451A5',
        },
          headerTintColor:'#fff',
      },
    initialRouteName: 'login',
    // initialRouteName: 'review',
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
    }, 3000);
  }

  setTimePassed() {
    this.setState({ timePassed: true });
  }

  render() {
    if (!this.state.timePassed) {
      //if(0){
      return <SplashScreen />;
    } else {
      return <AppContainer />;
    }
  }
}

export const isIos = Platform.OS == 'ios';
