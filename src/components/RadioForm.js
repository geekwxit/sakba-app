import React, { Component } from 'react';
import {
    View,Text,Platform,
    TouchableWithoutFeedback,
} from 'react-native';
import RadioButton from "./RadioButton";
const isIos = Platform.OS == 'ios';

export default class RadioForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selected: props.initial?props.initial:0
        }
    }
    _onPress = (value) =>{
        this.setState({selected: value});
        this.props.onPress(value);
    }
    render(){
        const isRTL = this.props.isRTL;
        const showAtIndex = this.props.showAtIndex;
        const current = this.props.value;
        return(
            <View>
                {this.props.radio_props.map((item, index)=>{
                    return (
                        <View>
                            <TouchableWithoutFeedback key={index} onPress={()=>{this._onPress(item.value)}}>
                                <View style={{flexDirection: 'row',alignItems:!isRTL?'center':'flex-start', alignSelf: isRTL?'flex-end':'flex-start'}}>
                                    {isRTL?<Text style={[{alignSelf:'flex-end',padding:2,fontSize: 20, color: 'black'}, isIos?{textAlign:'right'}:null]}>{item.label}</Text>:null}
                                    <RadioButton touchEnabled={this.props.radioTouchEnabled?true:false}
                                                 checked={current!=undefined?current==item.value:
                                                     this.state.selected===item.value}
                                                 color={this.props.buttonColor} size={22}/>
                                    {!isRTL?<Text style={{padding:2,fontSize: 20, color: 'black'}}>{item.label}</Text>:null}
                                </View>
                            </TouchableWithoutFeedback>
                            {(showAtIndex!=null && showAtIndex!=undefined && showAtIndex==index)&&this.props.children}
                        </View>
                    )
                })}
            </View>
        )
    }
}
