import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import { Button } from 'native-base';
import { strings } from '../locales/Language'
import { B } from "./components/TextStyles";


const { width, height } = Dimensions.get('window');

export default class VisitPage extends Component<Props>{
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 },
      headerTintColor: '#fff',
    };
  };
  constructor(props) {
    super(props)
    this.state = { executive_Visit: false, visit_to_Shop: false, language: props.navigation.getParam('language') };
  }
  componentDidMount() {
    this.setState({ language: this.props.navigation.getParam('language') });
  }

  requestExecutiveVisit() {
    this.props.navigation.navigate('executive_visitpage', { language: this.state.language });
  }

  render() {
    var screen = this.state.language.visitPage;
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;

    return (
      <SafeAreaView style={{flex:1,   backgroundColor: '#fff'}}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 50 }}>
          <Image style={{ width: 80, height: 80 }} source={require('../img/om.png')} />
        </View>
        <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 50 }}>
          <View>
            <Text style={{ fontSize: 18 }}>{screen.title}</Text>
          </View>
          <View style={{ marginTop: 25, flexDirection: 'column' }}>
            <Button style={{ backgroundColor: '#0451A5', width: width - 80, height: 40, justifyContent: 'center' }} onPress={() => this.requestExecutiveVisit()}>
              <Text style={{ fontSize: 20, color: 'white' }}>{screen.requestButton}</Text>
            </Button>
            <Button style={{ backgroundColor: '#0451A5', width: width - 80, height: 40, justifyContent: 'center', marginTop: 20 }}
            //onPress={() => this.visitToShop()}
            >
              <Text style={{ fontSize: 20, color: 'white' }}>{screen.visitButton}</Text>
            </Button>
            <View style={{ width: width - 80, flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 15 }}>
              {/* <Icon label={screen.textUs} screen={screen} strings={strings} link={'https://wa.me/96522252585'} path={require('../img/login_icons/blue_whatsapp.jpg')} /> */}
              <Icon label={strings.visitToShopPage.qurain} screen={screen} strings={strings} link={'https://goo.gl/maps/M4YDSRUrgARVrmoQ9'} path={require('../img/login_icons/blue_maps-icon.png')} />
              <Icon label={strings.visitToShopPage.awqaf} screen={screen} strings={strings} link={'https://goo.gl/maps/QG8Ma8ciQfQJxNnZ9'} path={require('../img/login_icons/blue_maps-icon.png')} />
              {/* <Icon label={screen.callUs} screen={screen} strings={strings} link={'tel:+96522252585'} path={require('../img/login_icons/blue_call.jpg')} /> */}
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}


const Icon = ({ link, strings, screen, path, label }) => (
  <View style={{ flex: 1, borderColor: '#fff', borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
    <TouchableOpacity onPress={() => {
      Linking.canOpenURL(link)
        .then(supported => {
          if (!supported) {
            Alert.alert(strings.commonFields.alertTitle, screen.installWhatsApp, [{ text: strings.commonFields.okButton }]);
          } else {
            return Linking.openURL(link);
          }
        })
        .catch(err => console.error('An error occurred', err));
    }}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Image style={{ height: 50, resizeMode: 'contain' }} source={path} />
        <B style={{ color: '#0451A5' }}>{label}</B>
      </View>
    </TouchableOpacity>
  </View>
)
