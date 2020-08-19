import React, { Component, useState } from 'react';
import { View, Text, Image, Dimensions, SafeAreaView, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button, Icon } from 'native-base';
import axios, { baseURL } from "./axios/AxiosInstance";
import ImageProgress from 'react-native-image-progress';
import ProgressCircle from 'react-native-progress/Circle';
import {isIos} from "./login/Login";

const { width, height } = Dimensions.get('window');

export default class DishdashaSelectionScreen extends Component<Props>{

  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 },
      headerTintColor: '#fff',
    };
  };
  constructor(props) {
    super(props)
    this.state = {
      language: props.navigation.getParam('language'),
      isLoading: false,
      pickupStore: null,
      sendFabric: true, homeDelivery: true,
      itemSelected: 'itemTwo', noOfPieces: 1,
      mobileNo: this.props.navigation.getParam('mobileNo', null),
      address: 2, response: [], msg: '',
      delivery_date: '',

      inHomeCount: 0, outsideCount: 1,

      logo: { uri: "" },
      logoLoaded: false,
      sizeDone: false,
      imageHeight: 50,
    };
  }

  componentDidMount() {
    this.setState({ language: this.props.navigation.getParam('language') });
    this.setImage();
  }

  minus() {
    if (this.state.noOfPieces > 1)
      this.setState({ noOfPieces: this.state.noOfPieces - 1, outsideCount: this.state.noOfPieces - 1, inHomeCount: 0 });
    else
      this.setState({ noOfPieces: 1, inHomeCount: 1, outsideCount: 0 });
  }
  plus() {
    this.setState({ noOfPieces: this.state.noOfPieces + 1, outsideCount: this.state.noOfPieces + 1, inHomeCount: 0 });
  }

  proceed(products_disabled = false) {
    let { shopTitle, fabricsLabel, productsLabel } = this.state.language.fabricScreen;
    const inHomeCount = this.state.inHomeCount;
    const outsideCount = this.state.outsideCount;
    const mobileNo = this.props.navigation.getParam('mobileNo', null);
    const customerName = this.props.navigation.getParam('customerName', null);
    let params = {
      measurement: this.props.navigation.getParam('measurement'),
      language: this.state.language, inHomeCount, outsideCount, mobileNo,
      customerName, noOfPieces: this.state.noOfPieces,
      productsEnabled: !products_disabled,
      shopTitle, fabricsLabel, productsLabel,
      fabricsEnabled: !(outsideCount == this.state.noOfPieces),
      measurementDone: this.props.navigation.getParam('measurementDone'),
      mustBuyProduct: !outsideCount>0
    };
    console.log(
      "fabricsEnabled:", !(outsideCount == this.state.noOfPieces),
      "productsEnabled: ", !products_disabled
    )
    if (!products_disabled || !(outsideCount == this.state.noOfPieces)) {
      this.props.navigation.navigate('fabrics_and_products', params)
    } else {
      this.props.navigation.navigate('delivery', params)
    }
  }

  updateQuantity(type, quantity) {
    total = this.state.noOfPieces;
    home = this.state.inHomeCount;
    out = this.state.outsideCount;
    if (type === 'home') {
      if (home + quantity >= 0) {
        if (home + quantity <= total) {
          i = quantity + home;
          p = total - (quantity + home);
          this.setState({ inHomeCount: quantity + home });
          this.setState({ outsideCount: total - (quantity + home) });
        }
        else {
          Alert.alert(this.state.language.commonFields.alertTitle, this.state.language.customerAgree.maxInHome, [{ text: this.state.language.commonFields.okButton }]);
          // alert(this.state.language.customerAgree.maxInHome);
        }
      }
    }
    else if (type === 'outside') {
      if (out + quantity >= 0) {
        if (out + quantity <= total) {
          i = quantity + out;
          p = total - (quantity + out);
          this.setState({ outsideCount: quantity + out });
          this.setState({ inHomeCount: total - (quantity + out) });
        }
        else {
          Alert.alert(this.state.language.commonFields.alertTitle, this.state.language.customerAgree.maxOutside, [{ text: this.state.language.commonFields.okButton }]);

          // alert(this.state.language.customerAgree.maxOutside);
        }
      }
    }
  }

  async getLogo() {
    try {
      let response = await axios.get('get_logo.php');
      response = response.data;
      if (!response.error) {
        return { uri: baseURL + response?.logo?.logo3 };
      }
      return { uri: baseURL + response?.logo?.logo3 };
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
    var screen = this.props.screen ? this.props.screen : this.state.language.customerAgree;
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;

    const sizeCtrl = { width: 40, height: 40 }

    if (!this.state.logoLoaded) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} >
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
            <ActivityIndicator size={isIos?'large':40} color={'#0451A5'} />
          </View>
        </SafeAreaView>
      )
    }

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} >
        <ScrollView>
          <AppLogo source={this.state.logo} logoLoaded={this.state.logoLoaded} height={this.state.imageHeight} />
          {/* <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 50 }}>
            <Image style={{ width: 80, height: 80 }} source={require('../img/om.png')} />
          </View> */}
          <View style={{ flexDirection: 'column', marginHorizontal: 40, }}>
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 20, textAlign: 'center' }}>{screen.dishdashaCount}</Text>
            </View>
            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button style={{ marginLeft: width / 6, backgroundColor: '#0451A5', width: 50, height: 40, justifyContent: 'center' }} onPress={() => this.minus()}>
                <Icon style={{ textAlign: 'center', color: 'white' }} name='md-remove' />
              </Button>
              <View style={{ height: 40, justifyContent: 'center' }}>
                <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 20, fontWeight: 'bold' }}>{this.state.noOfPieces}</Text>
              </View>
              <Button style={{ marginRight: width / 6, backgroundColor: '#0451A5', width: 50, height: 40, justifyContent: 'center' }} onPress={() => this.plus()}>
                <Icon style={{ textAlign: 'center', color: 'white' }} name='md-add' />
              </Button>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: 20 }}>
              <View style={{ justifyContent: 'center', marginRight: 10 }}>
                <Text style={{ alignSelf: 'center', fontWeight: 'bold', marginBottom: 5 }}>{screen.outside}</Text>
                <View style={{ flexDirection: 'row', borderColor: '#0451A5', borderWidth: 2 }}>
                  <View style={{
                    borderRadius: 0, backgroundColor: '#0451A5', width: sizeCtrl.width,
                    height: sizeCtrl.height, alignItems: 'center', justifyContent: 'center'
                  }}>
                    <TouchableOpacity onPress={() => this.updateQuantity('outside', -1)}>
                      <Icon style={{ textAlign: 'center', color: 'white', fontSize: sizeCtrl.width / 2 }}
                        name='md-remove' />
                    </TouchableOpacity>
                  </View>
                  <View style={{ width: sizeCtrl.width + 10, height: sizeCtrl.height, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>{this.state.outsideCount}</Text>
                  </View>
                  <View style={{
                    borderRadius: 0, backgroundColor: '#0451A5', width: sizeCtrl.width,
                    height: sizeCtrl.height, alignItems: 'center', justifyContent: 'center'
                  }}>
                    <TouchableOpacity onPress={() => this.updateQuantity('outside', 1)}>
                      <Icon size={10} style={{ textAlign: 'center', color: 'white', fontSize: sizeCtrl.width / 2 }}
                        name='md-add' />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={{ justifyContent: 'center', marginRight: 10 }}>
                <Text style={{ alignSelf: 'center', fontWeight: 'bold', marginBottom: 5 }}>{screen.inhome}</Text>
                <View style={{ flexDirection: 'row', borderColor: '#0451A5', borderWidth: 2 }}>
                  <View style={{
                    borderRadius: 0, backgroundColor: '#0451A5', width: sizeCtrl.width,
                    height: sizeCtrl.height, alignItems: 'center', justifyContent: 'center'
                  }}>
                    <TouchableOpacity onPress={() => this.updateQuantity('home', -1)}>
                      <Icon style={{ textAlign: 'center', color: 'white', fontSize: sizeCtrl.width / 2 }} name='md-remove' />
                    </TouchableOpacity>
                  </View>
                  {console.log(this.state.inHomeCount)}
                  <View style={{ width: sizeCtrl.width + 10, height: sizeCtrl.height, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>{this.state.inHomeCount}</Text>
                  </View>
                  <View style={{
                    borderRadius: 0, backgroundColor: '#0451A5', width: sizeCtrl.width,
                    height: sizeCtrl.height, alignItems: 'center', justifyContent: 'center'
                  }}>
                    <TouchableOpacity onPress={() => this.updateQuantity('home', 1)}>
                      <Icon size={10} style={{ textAlign: 'center', color: 'white', fontSize: sizeCtrl.width / 2 }} name='md-add' />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            {/* <View style={{ marginTop: 70 }}>
              <Button style={{ backgroundColor: '#0451A5', width: width - 80, height: 40, borderRadius: 5, justifyContent: 'center' }}
                onPress={() => this.proceed(true)}>
                <Text style={{ fontSize: 18, color: 'white' }}>{screen.buyDishdasha}</Text>
              </Button>
            </View> */}
            <View style={{ marginVertical: 30 }}>
              <Button style={{ backgroundColor: '#0451A5', width: width - 80, height: 40, borderRadius: 5, justifyContent: 'center' }}
                onPress={() => this.proceed()}>
                <Text style={{ fontSize: 18, color: 'white' }}>{screen.buyDishdashaAndProduct}</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}



function AppLogo({ logoLoaded, height, source }) {
  const [marginTop, setMarginTop] = useState(height * .20);
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }} >
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