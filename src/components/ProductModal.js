import React from 'react';
import {Alert, Dimensions, Image, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {B} from "./TextStyles";
import {Input} from "../OrderDetail";

const {width, height} = Dimensions.get('window');

const ProductModal = ({language, onEnterMeasurement, strings, patternName, colorName, close, visible, isRTL, onAdd, selected, price, measurement, isCountNeeded}) => {
    let finalPrice = (!isNaN(price*measurement) && price*measurement!=0)?
        (price*measurement).toFixed(2) +" " +strings.kd:"";
    return (
        <Modal
            style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%) !important'}}
            animationType='fade'
            transparent={true}
            onRequestClose={()=>close()}
            visible={visible}
        >
            <TouchableWithoutFeedback onPress={()=>close()}>
                <View style={{flex:1 ,alignItems: 'center', justifyContent: 'center', backgroundColor:'#00000069'}}>
                    <TouchableWithoutFeedback>
                        <View  style={{width: width*0.8, backgroundColor:'#fff', borderRadius: 10}}>
                            <View style={{padding: 8,borderTopLeftRadius:10, borderTopRightRadius: 10,backgroundColor: '#0451A5',justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 20, color: 'white'}}>
                                    {strings.selectPTitle}
                                </Text>
                            </View>
                            <View style={{padding: 10}}>
                                <View style={[{flexDirection: 'row'}, (isRTL?{justifyContent:'flex-end'}:null)]}>
                                    <Text style={{fontSize: 18}}><B>{strings.selectPBrand}</B>{selected.brand}</Text>
                                </View>
                                <Text style={{fontSize: 18, alignSelf:isRTL?'flex-end':'flex-start',textAlign:isRTL?'right':'left'}}><B>{strings.selectPPattern}</B>{patternName} ({colorName})</Text>
                                <View style={[{flexDirection: 'row'}, (isRTL?{justifyContent:'flex-end'}:null)]}>
                                    <Text style={{fontSize: 18}}><B>{strings.selectPPrice}</B> {price} {strings.selectPerMeter}</Text>
                                </View>
                                <View style={[{flexDirection: 'row'}, (isRTL?{justifyContent:'flex-end'}:null)]}>
                                    {isRTL?<Text style={{fontSize: 18}}>{finalPrice} </Text>:null}
                                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>{strings.selectPFinalPrice}</Text>
                                    {!isRTL?<Text style={{fontSize: 18}}> {finalPrice}</Text>:null}
                                </View>
                            </View>
                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                <View style={{alignItems : 'center', justifyContent: 'center'}}>
                                    {selected.pattern && selected.color?
                                        <Image style={{width: width*0.8, height: 350, resizeMode: 'stretch'}} source={{uri: selected.color.path}} /> :
                                        <Text style={{fontSize:20, color:'rgba(255,40,67,0.67)'}}>{strings.noColorPattern}</Text>
                                    }
                                </View>
                            </View>
                            {!isCountNeeded && selected.pattern && selected.color &&
                                <View style={{margin:10,flexDirection:'row', alignSelf:'center', alignItems:'center'}}>
                                    <Input keyboardType={'numeric'} isRTL={isRTL} maxLength={20} label={strings.measurementLabel} onChangeText={(m)=>onEnterMeasurement(m)}/>
                                </View>
                            }
                            <View style={{height: 5}}/>
                            <TouchableOpacity onPress={()=>{
                                (selected.pattern && selected.color)?
                                    measurement?
                                        (isNaN(measurement)?
                                            Alert.alert(language.commonFields.alertTitle, strings.promoNumberAlert, [{text: language.commonFields.okButton}]):
                                            (parseFloat(measurement)>0)?
                                                onAdd():
                                                Alert.alert(language.commonFields.alertTitle, strings.greaterNumberError, [{text: language.commonFields.okButton}])):
                                        Alert.alert(language.commonFields.alertTitle, strings.enterMeasurement, [{text: language.commonFields.okButton}]):
                                    close()
                            }}>
                                <View style={{ backgroundColor: '#0451A5', alignItems: 'center', justifyContent: 'center', padding:10, borderBottomLeftRadius:10, borderBottomRightRadius: 10}}>
                                    <Text style={{fontSize: 20, color: 'white'}}>{strings.selectPButton}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default ProductModal;
