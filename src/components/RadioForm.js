import React, { Component } from 'react';
import {
    View,Text,
    TouchableWithoutFeedback,
} from 'react-native';
import RadioButton from "./RadioButton";

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
        return(
            <View>
                {this.props.radio_props.map((item, index)=>{
                    return (
                        <TouchableWithoutFeedback onPress={()=>{this._onPress(item.value)}}>
                            <View style={{flexDirection: 'row', alignItems:'center', alignSelf: isRTL?'flex-end':'flex-start'}}>
                                {isRTL?<Text style={{textAlign:'right',padding:2,fontSize: 20, color: 'black'}}>{item.label}</Text>:null}
                                <RadioButton touchEnabled={this.props.radioTouchEnabled?true:false} checked={this.state.selected===item.value} color={this.props.buttonColor} size={22}/>
                                {!isRTL?<Text style={{padding:2,fontSize: 20, color: 'black'}}>{item.label}</Text>:null}
                            </View>
                        </TouchableWithoutFeedback>
                    )
                })}
            </View>
        )
    }
}
