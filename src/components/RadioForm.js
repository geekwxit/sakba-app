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
        return(
            <View>
                {this.props.radio_props.map((item, index)=>{
                    return (
                        <TouchableWithoutFeedback onPress={()=>{this._onPress(item.value)}}>
                            <View style={{flexDirection: 'row', alignItems:'center', alignSelf: this.props.isRTL?'flex-end':'flex-start'}}>
                                {this.props.isRTL?<Text style={{padding:2,fontSize: 20, color: 'black'}}>{item.label}</Text>:null}
                                <RadioButton touchEnabled={this.props.radioTouchEnabled?true:false} checked={this.state.selected===item.value} color={this.props.buttonColor} size={22}/>
                                {!this.props.isRTL?<Text style={{padding:2,fontSize: 20, color: 'black'}}>{item.label}</Text>:null}
                            </View>
                        </TouchableWithoutFeedback>
                    )
                })}
            </View>
        )
    }
}