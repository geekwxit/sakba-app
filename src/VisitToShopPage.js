import React, {Component} from 'react';
import {View, Text, Image, Dimensions, Linking, SafeAreaView, ScrollView} from 'react-native';
import {Button} from 'native-base';
import {visitToShopPage} from "./Strings";

const {width, height} = Dimensions.get('window');

const url1 = visitToShopPage.awqaf_location_url;
const url2 = visitToShopPage.view_on_map;
// const url1 = 'https://goo.gl/maps/M4YDSRUrgARVrmoQ9';
// const url2 = 'https://goo.gl/maps/QG8Ma8ciQfQJxNnZ9';

export default class VisitToShopPage extends Component<Props> {
    static navigationOptions = ({navigation}) => {
        return {
            headerStyle: {backgroundColor: '#0451A5', marginLeft: 0},
            headerTintColor: '#fff',
        };
    };

    render() {
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;
        const screen = this.props.navigation.getParam('language').visitToShopPage;
        return (
            <SafeAreaView style={{flex: 1, marginLeft: 40, marginRight: 40, alignItems: 'center'}}>
                <ScrollView>
                    <View style={{alignItems: 'center'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 50}}>
                            <Image style={{width: 80, height: 80}} source={require('../img/om.png')}/>
                        </View>
                        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>{screen.first}</Text>
                            </View>
                            {/* <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 18, fontWeight: 'normal' }}>سكبه </Text><Text style={{ fontSize: 18, fontWeight: 'normal' }}>{' '} - SAKBA</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 18, fontWeight: 'normal' }}>شارع 23 </Text><Text style={{ fontSize: 18, fontWeight: 'normal' }}>{' '}West Abu Fatira، 47080</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: 'normal' }}>6633 3116</Text> */}
                            <View style={{marginTop: 30}}>
                                <Button onPress={() => Linking.openURL(url1)} style={{backgroundColor: '#0451A5', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 20}}>
                                    <Text style={{fontSize: 20, color: 'white'}}>{screen.button}</Text>
                                </Button>
                            </View>
                        </View>

                        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 40}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>{screen.second}</Text>
                            </View>
                            {/* <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 18, fontWeight: 'normal' }}>سكبه </Text><Text style={{ fontSize: 18, fontWeight: 'normal' }}>{' '} - SAKBA</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 18, fontWeight: 'normal' }}>Mubarak Alkabeer st Block 3 Branch 111 Mirqab, Al Kuwayt 15000, Kuwait</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: 'normal' }}>+965 6633 3116</Text> */}
                            <View style={{marginTop: 30}}>
                                <Button onPress={() => Linking.openURL(url2)} style={{backgroundColor: '#0451A5', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 20}}>
                                    <Text style={{fontSize: 20, color: 'white'}}>{screen.button}</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}
