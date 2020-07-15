import React from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    View,
    Dimensions,
    Modal,
    TouchableWithoutFeedback, TouchableOpacity
} from "react-native";
import RadioGroup from "./components/RadioGroupCustom";
import {Button} from "native-base";
import ProductsScreen from "./ProductsScreen";
import ProductModal from "./components/ProductModal";
import {strings} from "../locales/Language";
import Store from "./CommonStore/Store";
import DishdashaSelectionScreen from "./DishdashaSelectionScreen";

const {width, height} = Dimensions.get('window');

export default class FabricsScreen extends React.Component{

    state = {
        language: strings,
        isLoading: true,
        // noOfPieces: this.props.navigation.getParam('noOfPieces', null),
        // mobileNo: this.props.navigation.getParam('mobileNo', null),
        // inHomeCount: this.props.navigation.getParam('inHomeCount', null),
        // outsideCount: this.props.navigation.getParam('outsideCount', null),
        measurement: 0,
        selectedBrand: 0, selectedPattern: 0, selectedColor: 0,
        cartVisible: false, productBox: false,
        brands: [],
        cart : [],
        totalCartItems: 0,
        actualTotalCartItems: 0,
        selectionChanged: false, changeType: null,
        shouldBrandShow: true, shouldPatternShow: true,shouldColorShow: true,
        colorLoader: false,
        fabricPreview: false, previewTitle: 'Preview', previewPath: null,

        productDetail: null, productDetailVisible: false,
    }

    componentDidMount(){
        this.getFabrics();
    }

    async getFabrics(){
        this.setState({isLoading: true},
            async ()=>this.setState({brands: await Store.getFabrics()},
                ()=>this.setState({isLoading: false})
            )
        );
    }

    addToCart(){
        const {main} = this.props;
        this.setState({productBox:false})
        !(main.state.isCountNeeded) && main.setState({measurement: 0});
        var screen = main.state.language.fabricScreen;
        const {selectedPattern, selectedBrand, selectedColor} = this.state;
        const product = {
            isFabric: true,
            isProduct: false,
            pattern: selectedPattern,
            brand:  selectedBrand,
            color: selectedColor,
            quantity: 1,
            price: parseFloat(this.state.brands[selectedBrand].price),
            measurement: main.state.measurement,
        };
        var product_found = main.state.cart.findIndex(c=>(c.isFabric && c.brand==product.brand && c.pattern==product.pattern && c.color==product.color));
        if(product_found>=0){
            main.updateQuantity(product_found, 1);
        } else {
            main.addToCart(product);
        }
    }

    getPatternData(){
        if(this.state.brands.length){
            return this.state.brands[this.state.selectedBrand].patterns?this.state.brands[this.state.selectedBrand].patterns:null;
        }
        return null;
    }
    getColorData(){
        if(this.state.brands.length){
            patterns = this.state.brands[this.state.selectedBrand].patterns;
            if(patterns && patterns.length){
                return patterns[this.state.selectedPattern].colors?patterns[this.state.selectedPattern].colors:null;
            }
        }
        return null;
    }

    render(){
        const {main, screen, language} = this.props;
        return(
            <>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{borderColor:'#0451A5',borderWidth:1,borderTopWidth:0,flex:(this.state.brands && this.state.brands.length>0)?0:1}}>
                {this.state.isLoading?
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <ActivityIndicator style={{top: height*0.4}}  color={'#0451A5'} size={'large'} animating={true}/>
                    </View>:null
                }
                <FabricPreview ok={screen.previewOKButton}
                               title={this.state.previewTitle}
                               source={this.previewPath}
                               close={()=>this.setState({fabricPreview: false})}
                               visible={this.state.fabricPreview}/>
                <ProductModal isRTL={main.state.language.isRTL}
                              measurement={main.state.measurement}
                              isCountNeeded={main.state.isCountNeeded}
                              language={main.state.language}
                              strings={screen}
                              price={(this.state.brands && this.state.brands.length>0)?
                                  parseFloat(this.state.brands[this.state.selectedBrand].price).toFixed(2):0}
                              brands={this.state.brands}
                              onAdd={()=>this.addToCart()}
                              selected={{
                                   brand: (this.state.brands && this.state.brands.length>0)?this.state.brands[this.state.selectedBrand].name:null,
                                   pattern: this.getPatternData()?(this.getPatternData())[this.state.selectedPattern]:null,
                                   color: this.getColorData()?(this.getColorData())[this.state.selectedColor]:null
                               }}
                              patternName = {this.getPatternData()?(this.getPatternData())[this.state.selectedPattern].name:null}
                              colorName={this.getColorData()?(this.getColorData())[this.state.selectedColor].name:null}
                              visible={this.state.productBox}
                              onEnterMeasurement={(m)=>main.setState({measurement: m})}
                              close={()=>this.setState({productBox: false})}/>
                               {/*<DishdashaSelectionScreen screen={language.customerAgree}/>*/}
                {(this.state.brands && this.state.brands.length)?
                    <View style={{flex:1, flexDirection: 'column', marginHorizontal: 40 }}>
                        {this.state.shouldBrandShow ?
                            <View>
                                <View style={{marginTop: 20, marginBottom: 10}}>
                                    <Text style={{fontSize: 20, textAlign: 'center'}}>{screen.chooseBrand}</Text>
                                </View>
                                <View>
                                    <RadioGroup
                                        text={screen}
                                        isRTL={main.state.language.isRTL}
                                        data={this.state.brands}
                                        type={screen.brandLabel}
                                        isImage={false}
                                        selected={this.state.selectedBrand}
                                        onSelect={(index) => {
                                            this.setState({selectedBrand: index, selectedColor: this.state.brands[index].patterns?0:null, selectedPattern: this.state.brands[index].patterns?0:null});
                                        }}
                                    />
                                </View>
                            </View>
                            :null}
                        {this.state.shouldPatternShow ?
                            <View>
                                <View style={{ marginTop: 20, marginBottom: 10}}>
                                    <Text style={{ fontSize: 20, textAlign: 'center' }}>{screen.choosePattern}</Text>
                                </View>
                                <View>
                                    <RadioGroup
                                        text={screen}
                                        isRTL={main.state.language.isRTL}
                                        data={this.getPatternData()}
                                        type={screen.patternLabel}
                                        isImage={true}
                                        selected={this.state.selectedPattern}
                                        onSelect={(index)=>{
                                            this.previewPath = this.state.brands[this.state.selectedBrand].patterns[index].path;
                                            this.setState({
                                                selectedPattern: index,
                                                selectedColor: 0,
                                                fabricPreview: true,
                                                previewTitle: screen.previewTitle.t1,
                                            })}}
                                        isSelectionChanged={this.state.selectionChanged}
                                        changeType={this.state.changeType}
                                    />
                                </View>
                            </View>:null}
                        {this.state.shouldColorShow ?
                            <View>
                                <View style={{marginTop: 20, marginBottom: 10}}>
                                    <Text style={{fontSize: 20, textAlign: 'center'}}>{screen.chooseColor}</Text>
                                </View>
                                <View>
                                    <RadioGroup
                                        text={screen}
                                        isRTL={main.state.language.isRTL}
                                        data={this.getColorData()}
                                        type={screen.colorsLabel}
                                        isImage={true}
                                        selected={this.state.selectedColor}
                                        onSelect={(index) =>{
                                            this.previewPath = this.state.brands[this.state.selectedBrand].patterns[this.state.selectedPattern].colors[index].path;
                                            this.setState({
                                                selectedColor: index,
                                                previewTitle:screen.previewTitle.t2,
                                                // fabricPreview: true,
                                                productBox: true
                                            })}
                                        }
                                        changeType={this.state.changedType}
                                    />
                                </View>
                            </View> :
                            <ActivityIndicator style={{marginTop: 10}} size={'small'} color={'#0451A5'}/>
                        }

                        {/*<View style={{ marginBottom: 30, flexDirection: 'row', justifyContent: 'center' }}>*/}
                        {/*    <Button*/}
                        {/*        style={{ borderRadius: 15, borderWidth: 2, backgroundColor: '#0451A5', height: 40, width: width - 80, justifyContent: 'center' }}*/}
                        {/*        onPress={() =>this.props.showCart()}>*/}
                        {/*        <Text style={{ fontSize: 18, color: 'white' }}>{screen.checkoutButton}</Text>*/}
                        {/*    </Button>*/}
                        {/*</View>*/}
                    </View>:
                    !this.state.isLoading && <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                        <Text style={{fontSize:20}}>No fabrics found</Text>
                    </View>
                }
            </ScrollView>
                {/*{(!this.state.isLoading && this.state.brands && this.state.brands.length) && <View style={{marginTop: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'center'}}>*/}
                {/*    <Button*/}
                {/*        style={{*/}
                {/*            borderRadius: 15,*/}
                {/*            borderWidth: 2,*/}
                {/*            backgroundColor: '#0451A5',*/}
                {/*            height: 40,*/}
                {/*            width: width - 80,*/}
                {/*            justifyContent: 'center'*/}
                {/*        }}*/}
                {/*        onPress={() => this.setState({productBox: true})}>*/}
                {/*        <Text style={{fontSize: 18, color: 'white'}}>{screen.addToCartButton}</Text>*/}
                {/*    </Button>*/}
                {/*</View>}*/}
            </>
        )
    }
}

// export default FabricsScreen;

const FabricPreview = (props) => {
    console.log({src: props.source});
    return(
        <Modal
            style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%) !important'}}
            animationType='fade'
            transparent={true}
            onRequestClose={()=>props.close()}
            visible={props.visible}
            //onShow={()=>console.log("CAAART", cart)}
        >
            <TouchableWithoutFeedback onPress={()=>props.close()}>
                <View style={{flex:1 ,alignItems: 'center', justifyContent: 'center', backgroundColor:'#00000069'}}>
                    <TouchableWithoutFeedback onPress={()=>{}}>
                        <View  style={{width: width*0.8, backgroundColor:'#fff', borderRadius: 10}}>
                            <View style={{padding: 8,borderTopLeftRadius:10, borderTopRightRadius: 10,backgroundColor: '#0451A5',justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 20, color: 'white'}}>{props.title}</Text>
                            </View>
                            <View style={{height: height*0.4}}>
                                {/*<View style={{flex:1, backgroundColor: 'black'}}>*/}
                                <Image source={{uri: props.source}} style={{flex:1, resizeMode: 'stretch', height: null, width: null}}/>
                                {/*</View>*/}
                            </View>
                            <TouchableOpacity onPress={()=>props.close()}>
                                <View style={{ backgroundColor: '#0451A5', alignItems: 'center', justifyContent: 'center', padding:10, borderBottomLeftRadius:10, borderBottomRightRadius: 10}}>
                                    <Text style={{fontSize: 20, color: 'white'}}>{props.ok}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}
