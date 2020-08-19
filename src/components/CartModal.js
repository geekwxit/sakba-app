import React from 'react';
import {
    Dimensions,
    Image,
    Modal, Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import {B} from "./TextStyles";
import {isIos} from "../login/Login";

const { width, height } = Dimensions.get('window');

const  FabricCartItem = ({texts, isRTL, color, colorName, name, rate, quantity, price, incQuantity, decQuantity,onRemove }) =>{
    return (
        <View style={{borderColor: '#0451A5', borderWidth: 1, padding: 0, flexDirection: 'row'}}>
            {!isRTL?
                <View style={{flexDirection: 'row', width:'70%'}}>
                    <View style={{ flex: 2, padding : 10}}>
                        <Image style={{width: 80, height: 80,resizeMode: 'contain', flex: 1}} source={{uri: color}}/>
                    </View>
                    <View style={{flex:2}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                            {name} ({colorName})
                        </Text>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>{texts.rateLabel} {rate} {texts.kdPerMeter}</Text>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>{texts.cartQuantity} {quantity}</Text>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>{texts.cartPrice} {price}</Text>
                        {/*<Text style={{fontSize: 20, fontWeight: 'bold'}}>Color: {color}</Text>*/}
                    </View>
                </View>:null}
            <View style={{alignSelf: 'flex-end',width:'30%', padding: 5}}>
                <View style={{marginBottom:20,flexDirection:'row', alignItems:'center',justifyContent:'space-between'}}>
                    <TouchableOpacity onPress={()=>incQuantity()}>
                        <AntDesign size={25} color={'#0451A5'} name={'pluscircle'}/>
                    </TouchableOpacity>
                    <Text style={{fontWeight:'bold'}}>{quantity}</Text>
                    <TouchableOpacity onPress={()=>decQuantity()}>
                        <AntDesign size={25} color={'#0451A5'} name={'minuscircle'}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => onRemove()}>
                    <View style={{ backgroundColor: '#0451A5',padding:5,
                        alignItems: 'center', justifyContent: 'center', borderRadius: 10}}>
                        <Text style={{fontSize: 15, color: 'white'}}>{texts.cartRemove}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {isRTL?
                <View style={{flexDirection: 'row', width:'70%'}}>
                    <View style={{flex: 2}}>
                        <Text style={{fontSize: 20,textAlign:'right', fontWeight: 'bold'}}>{name}</Text>
                        <Text style={{fontSize: 15,textAlign:'right', fontWeight: 'bold'}}>{texts.rateLabel} {rate} {texts.kdPerMeter}</Text>
                        {/*<Text style={{fontSize: 15, fontWeight: 'bold'}}>{texts.cartQuantity} {quantity}</Text>*/}
                        <Text style={{fontSize: 15, textAlign:'right',fontWeight: 'bold'}}>{texts.cartPrice} {price}</Text>
                        {/*<Text style={{fontSize: 20, fontWeight: 'bold'}}>Color: {color}</Text>*/}
                    </View>
                    <View style={{ padding:10}}>
                        <Image style={{width: 80, height: 80,flex:1,resizeMode: 'contain'}} source={{uri: color}}/>
                    </View>
                </View>:null}
        </View>
    )
}

const ProductCartItem = ({texts, isRTL, image, name, rate, quantity, price, incQuantity, decQuantity, onRemove}) =>{
    return (
        <View style={{transform:[{scaleX:isRTL?-1:1}],borderColor: '#0451A5', borderWidth: 1, padding: 0, flexDirection: 'row'}}>
            <Image style={{width:100, height: 100, resizeMode:'contain'}} source={{uri: image}}/>
            <View style={{flexDirection:'row',padding:5, flex:1}}>
                <View style={{flex:3.2}}>
                    <B style={{transform:[{scaleX:isRTL?-1:1}],fontSize: 18}}>{name}</B>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}}>
                        <B style={{transform:[{scaleX:isRTL?-1:1}],fontSize: 15}}>{texts.rateLabel}</B>
                        <Text style={{transform:[{scaleX:isRTL?-1:1}]}}>{rate} {texts.kd}</Text>
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}}>
                        <B style={{transform:[{scaleX:isRTL?-1:1}],fontSize: 15}}>{texts.cartQuantity}</B>
                        <Text style={{transform:[{scaleX:isRTL?-1:1}]}}>{quantity}</Text>
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}}>
                        <B style={{transform:[{scaleX:isRTL?-1:1}],fontSize: 15}}>{texts.selectPPrice}</B>
                        <Text style={{transform:[{scaleX:isRTL?-1:1}]}}>{price} {texts.kd}</Text>
                    </View>
                </View>
                <View style={{alignSelf: 'flex-end',flex:1.8}}>
                    <View style={{marginBottom:20,flexDirection:'row', alignItems:'center',justifyContent:'space-between'}}>
                        <TouchableOpacity onPress={()=>incQuantity()}>
                            <AntDesign size={25} color={'#0451A5'} name={'pluscircle'}/>
                        </TouchableOpacity>
                        <Text style={{transform:[{scaleX:isRTL?-1:1}],fontWeight:'bold'}}>{quantity}</Text>
                        <TouchableOpacity onPress={()=>decQuantity()}>
                            <AntDesign size={25} color={'#0451A5'} name={'minuscircle'}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => onRemove()}>
                        <View style={{padding:5, backgroundColor: '#0451A5',
                            alignItems: 'center', justifyContent: 'center', borderRadius: 10}}>
                            <Text style={{transform:[{scaleX:isRTL?-1:1}],fontSize: 15, color: 'white'}}>{texts.cartRemove}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const CartModal = (props) => {
    cartTotal = 0;
    var isRTL = props.isRTL;
    texts = props.text;
    console.log(props);
    return(
        <Modal
            style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%) !important'}}
            animationType='fade'
            transparent={true}
            onRequestClose={()=>props.close()}
            visible={props.visible}
        >
            <TouchableWithoutFeedback onPress={()=>props.close()}>
                <View style={{flex:1 ,alignItems: 'center', justifyContent: 'center', backgroundColor:'#00000069'}}>
                    <TouchableWithoutFeedback onPress={()=>{}}>
                        <View  style={{width: width*0.8, backgroundColor:'#fff', borderRadius: 10}}>
                            <View style={{padding: 8,borderTopLeftRadius:10, borderTopRightRadius: 10,backgroundColor: '#0451A5',justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 20, color: 'white'}}>
                                    {texts.cartTitle}
                                </Text>
                            </View>
                            <View style={{height: height*0.5}}>
                                {props.cartItems.length>0?
                                    <View style={{flex:1, justifyContent:'space-evenly'}}>
                                        <ScrollView showsVerticalScrollIndicator={false}>
                                            <View style={{marginBottom:10}} onStartShouldSetResponder={()=>true}>
                                                {
                                                    props.cartItems.map((item, index)=>{
                                                        if(item.isFabric){
                                                            cartTotal += (item.quantity*item.price)*(props.isCountNeeeded?props.measurement:item.measurement);
                                                            return <FabricCartItem  rate={parseFloat(item.price).toFixed(2)}
                                                                                    showDetail={(product)=>{props.showDetail(product)}}
                                                                                    isRTL={isRTL} texts={props.text}
                                                                                    price={
                                                                                        props.isCountNeeeded?
                                                                                            parseFloat((item.quantity*item.price)*props.measurement).toFixed(2):
                                                                                            parseFloat((item.quantity*item.price)*item.measurement).toFixed(2)
                                                                                    }
                                                                                    quantity={item.quantity} key={index}
                                                                onRemove={()=>props.removeItem(item.quantity,index)}
                                                                name={props.brands[item.brand].name}
                                                                incQuantity={()=>props.updateQuantity(index, 1)}
                                                                decQuantity={()=>item.quantity==1?props.removeItem(item.quantity, index):props.updateQuantity(index, -1)}
                                                                colorName={props.brands[item.brand].patterns[item.pattern].colors[item.color].name}
                                                                pattern={props.brands[item.brand].patterns[item.pattern].path}
                                                                color={props.brands[item.brand].patterns[item.pattern].colors[item.color].path}/>
                                                        } else if(item.isProduct){
                                                            cartTotal += (item.quantity*item.price);
                                                            return <ProductCartItem
                                                                rate={parseFloat(item.price).toFixed(2)}
                                                                isRTL={isRTL}
                                                                texts={props.text}
                                                                price={parseFloat(item.quantity*item.price).toFixed(2)}
                                                                quantity={item.quantity}
                                                                key={index}
                                                                onRemove={()=>props.removeItem(item.quantity,index)}
                                                                name={item.name}
                                                                incQuantity={()=>props.updateQuantity(index, 1)}
                                                                decQuantity={()=>item.quantity==1?props.removeItem(item.quantity, index):props.updateQuantity(index, -1)}
                                                                image={item.image}/>
                                                        }
                                                    })
                                                }
                                            </View>
                                        </ScrollView>
                                        {props.fabricsEnabled && props.isCountNeeded && <View style={{
                                            flex:1,
                                            borderWidth:1,
                                            borderColor:'rgba(4,90,225,0.35)',
                                            maxHeight:(isIos?undefined:5),
                                            backgroundColor: 'rgba(4,92,255,0.35)',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding:(isIos?0:10)}}>
                                            {!isRTL && <Text style={{fontSize: 15, color: '#fff', alignSelf: 'center'}}>{texts.measureText}</Text>}
                                            <Text style={{fontSize: 15, color: '#fff', alignSelf: 'center'}}> {props.measurement} {texts.meters}</Text>
                                            {isRTL && <Text style={{fontSize: 15, color: '#fff', alignSelf: 'center'}}>{texts.measureText}</Text>}
                                        </View>}
                                        <View style={{
                                            borderWidth:1,
                                            borderColor:'rgba(4,90,225,0.35)',
                                            backgroundColor: 'rgba(4,92,255,0.35)',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                        </View>
                                        <View style={{
                                            borderTopColor: 'rgba(255,255,255,0)',
                                            borderBottomColor: '#fff', borderLeftColor: '#fff', borderRightColor: '#fff',
                                            borderWidth:2,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding:10}}>
                                            <Text style={{fontSize: 20, color: '#0451A5', alignSelf: 'center'}}>{texts.cartTotal} {parseFloat(cartTotal).toFixed(2)} {texts.kd}</Text>
                                        </View>
                                        <TouchableOpacity onPress={props.checkout}>
                                            <View style={{ backgroundColor: '#0451A5', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding:10, borderBottomLeftRadius:10, borderBottomRightRadius: 10}}>
                                                <Text style={{fontSize: 20, color: 'white', alignSelf: 'center'}}>{texts.cartConfirm}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style={{color: 'grey', fontSize: 20}}>{texts.cartEmpty}</Text>
                                    </View>
                                }
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default CartModal;
