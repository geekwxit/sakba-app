import React, { Component } from 'react';
import {
    FlatList,
    View,
    Alert,
    Text,
    Image,
    Platform,
    Dimensions,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Modal,
    SafeAreaView,
    ScrollView,
    TouchableOpacity, TouchableHighlight,
    TextInput, Picker
} from 'react-native';
import Store from "./CommonStore/Store";
import ImageCarousel from "./components/ImageCarousel";
import { Dropdown } from "react-native-material-dropdown";
import HTML from "react-native-render-html";
import { strings } from "../locales/Language";

const isIos = Platform.OS == 'ios';
const baseURL = 'https://sakba.net/images/product/';

const { width, height } = Dimensions.get('window');

export default class SingleProduct extends Component {
    state = { productDetail: null, isLoading: false, selectedColor: null, selectedSize: null, gallery: '' };
    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: { backgroundColor: '#0451A5', marginLeft: 0 },
            headerTintColor: '#fff',
            title: navigation.getParam('title'),
        };
    };

    constructor() {
        super();
        this.selectColor = this.selectColor.bind(this);
        this.selectSize = this.selectSize.bind(this);
        this.addToCart = this.addToCart.bind(this);
    }

    componentDidMount() {
        this.getProductDetails(this.props.navigation.getParam('product_id'));

    }
    async getProductDetails(id) {
        await Store.getProductDetail(id);
        let productDetail = await Store.getStore().product;
        let gallery = await Store.getStore().product.product_gallery.split(',');
        this.setState({ productDetail, gallery });
    }

    addToCart() {
        let price = 0;
        let addToCartCallback = this.props.navigation.getParam('addToCartCallback', null);
        let { productDetail, selectedColor, selectedSize } = this.state;
        if (productDetail) {
            price = productDetail.discount_percentage && parseFloat(productDetail.discount_percentage) ?
                productDetail.product_sale_price : productDetail.product_price;
            if (productDetail.product_sizes && !selectedSize) {
                alert("Please pick a size for product!");
            } else if (productDetail.product_colors && !selectedColor) {
                alert("Please pick a color for product!");
            } else {
                addToCartCallback ?
                    addToCartCallback({
                        name: productDetail.product_name, price,
                        color: selectedColor, size: selectedSize, quantity: 1,
                        image: baseURL + productDetail.product_gallery.split(',')[0],
                        product_id: productDetail.product_id
                    }, this) :
                    alert("Something went wroncg!");
            }
        }
    }

    selectColor(selectedColor) {
        if (selectedColor) {
            this.setState({ selectedColor });
        } else {
            alert("Please select a color.")
        }
    }
    selectSize(selectedSize) {
        if (selectedSize) {
            this.setState({ selectedSize });
        } else {
            alert("Please select a size.")
        }
    }

    render() {
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;
        // var screen = this.state.language.fabricScreen;
        const screen = strings.productScreen;
        const isRTL = strings.isRTL;
        const isLoading = !true;
        const { productDetail } = this.state;
        // if(!productDetail){productDetail.product_colors = "https://cdn.shopify.com/s/files/1/0193/6253/products/214453713_2000x.jpg?v=1575932136," +
        //     "http://www.modahuarango.es/images/cate_2/640/B-Zebuakuade-Polygonal-Sunglasses-Vintage-Candy-Colored-Glasses-for-Women-Men-Color-A-t3v9Sjx0IZ1Q-kbg0.jpg," +
        //     "https://img1-image.cdnsbg.com/hashImg/a7e6ac6823.jpg_w600h300q80," +
        //     "https://cdn.shopify.com/s/files/1/0972/3844/products/FAIRFAX_46_1024x1024.jpg";}
        return (
            <SafeAreaView style={{ flex: 1 }}>
                {isLoading || !productDetail ?
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator style={{ top: height * 0.4 }} color={'#0451A5'} size={'large'}
                            animating={true} />
                    </View> :
                    <>
                        <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ width: width - 20, alignSelf: 'center' }}
                        >
                            <ImageCarousel data={productDetail.product_gallery.split(',')}
                                baseURL={'https://sakba.net/images/product/'}
                                style={{
                                    marginTop: 10, alignSelf: 'center', maxHeight: width
                                }}
                            />
                            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', marginTop: 20, }}>
                                <View style={{ width: '65%', alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                                    <Text style={{
                                        textAlign: isRTL ? 'right' : 'left', fontWeight: 'bold',
                                        fontSize: 18, color: '#0451A5'
                                    }}>{productDetail.product_name} </Text>
                                </View>
                                <View style={{ width: '35%', alignItems: !isRTL ? 'flex-end' : 'flex-start' }}>
                                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: isRTL ? 'flex-start' : 'flex-end' }}>
                                        <Text style={{ textDecorationLine: (productDetail.discount_percentage && parseFloat(productDetail.discount_percentage)) ? 'line-through' : '', fontWeight: 'bold', fontSize: 18 }}>{productDetail.product_price} KD</Text>
                                        {(productDetail.discount_percentage && parseFloat(productDetail.discount_percentage)) ?
                                            <Text style={{
                                                color: '#0451A5',
                                                fontWeight: 'bold',
                                                fontSize: 18
                                            }}> {productDetail.product_sale_price} KD </Text> : null}
                                    </View>
                                    {(productDetail.discount_percentage && parseFloat(productDetail.discount_percentage)) ?
                                        <View style={{ alignSelf: isRTL ? 'flex-start' : 'flex-end' }}>
                                            <Text style={{
                                                fontWeight: 'bold',
                                                fontSize: 14
                                            }}>({productDetail.discount_percentage} % off)</Text>
                                        </View> : null}
                                </View>
                            </View>
                            <Text style={{ fontSize: 14, textAlign: isRTL ? 'right' : 'left', marginTop: 5, color: '#0451A5' }}>{productDetail.product_brand}</Text>
                            {/*{productDetail.product_sizes && <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>*/}
                            {/*    <Text style={{fontWeight: 'bold', fontSize: 20, marginTop: 20}}>Size: </Text>*/}
                            {/*    <Picker />*/}
                            {/*</View>}*/}
                            {productDetail.product_sizes &&
                                <View style={{ transform: [{ scaleX: isRTL ? -1 : 1 }], }}>
                                    <Text style={{ transform: [{ scaleX: isRTL ? -1 : 1 }], marginBottom: 10, fontWeight: 'bold', fontSize: 20, marginTop: 20 }}>{screen.pickSizeLabel}</Text>
                                    <FlatList key={2} data={productDetail.product_sizes.split(',')}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        renderItem={({ item }) => (
                                            <TouchableWithoutFeedback onPress={() => this.selectSize(item)}>
                                                <View style={{
                                                    transform: [{ scaleX: isRTL ? -1 : 1 }], marginRight: 10, alignItems: 'center', justifyContent: 'center', padding: 10,
                                                    borderColor: this.state.selectedSize == item ? '#0451A5' : '#bbb',
                                                    borderWidth: this.state.selectedSize == item ? 3 : 0.5
                                                }}>
                                                    <Text style={{ paddingHorizontal: 30 }}>{item}</Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        )}
                                    />
                                </View>}
                            {productDetail.product_colors &&
                                <View style={{ transform: [{ scaleX: isRTL ? -1 : 1 }], }}>
                                    <Text style={{ transform: [{ scaleX: isRTL ? -1 : 1 }], marginBottom: 10, fontWeight: 'bold', fontSize: 20, marginTop: 20 }}>{screen.pickColorLabel}</Text>
                                    <FlatList key={2} data={productDetail.product_colors.split(',')}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        renderItem={({ item }) => (
                                            <TouchableWithoutFeedback onPress={() => this.selectColor(item)}>
                                                <View style={{
                                                    transform: [{ scaleX: isRTL ? -1 : 1 }], marginRight: 10, alignItems: 'center', justifyContent: 'center', padding: 10,
                                                    borderColor: this.state.selectedColor == item ? '#0451A5' : '#bbb',
                                                    borderWidth: this.state.selectedColor == item ? 3 : 0.5
                                                }}>
                                                    {productDetail.isColorAnImage ?
                                                        <Image source={{ uri: item, width: width / 3, height: width / 5, resizeMode: 'resize' }} /> :
                                                        <Text>{item}</Text>
                                                    }
                                                </View>
                                            </TouchableWithoutFeedback>
                                        )}
                                    />
                                </View>}
                            {/*{productDetail.product_colors &&*/}
                            {/*<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', marginTop:10}}>*/}
                            {/*    <Text style={{fontWeight: 'bold', fontSize: 20, marginTop: 20}}>Color: </Text>*/}
                            {/*    <View style={{width:'45%', backgroundColor:'#0451A5', borderRadius:5}}>*/}
                            {/*    <Picker selectedValue={this.state.selectedColor}*/}
                            {/*            onValueChange={this.selectColor} style={{color:'#fff'}} enabled={true}>*/}
                            {/*        <Picker.Item label={'Select Color'} value={null} />*/}
                            {/*        {productDetail.product_colors.split(',').map(item=>*/}
                            {/*            <Picker.Item label={item} value={item} />)}*/}
                            {/*    </Picker>*/}
                            {/*    </View>*/}
                            {/*<Dropdown data={productDetail.product_colors.split(',')}*/}
                            {/*          label={'Choose color'}*/}
                            {/*          containerStyle={{width:'50%', backgroundColor: '#0451A5', height:50}}*/}
                            {/*/>*/}
                            {/*</View>}*/}
                            <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 10 }}>{screen.descLabel}</Text>
                            <HTML html={productDetail.product_disc}
                                textSelectable={false}
                            />
                        </ScrollView>
                        <TouchableOpacity onPress={this.addToCart} style={{ width: width, alignItems: 'center', justifyContent: 'center', height: 50, backgroundColor: '#0451A5' }}>
                            <Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold' }}>{screen.addToCartButton}</Text>
                        </TouchableOpacity>
                    </>
                }
            </SafeAreaView>
        );

    }
}

function SelectedView({ enabled }) {
    return enabled ? <View style={{
        height: '100%', width: '100%', position: 'absolute',
        backgroundColor: 'rgba(4,81,165,0.38)', zIndex: 1
    }}>
    </View> : null
}
