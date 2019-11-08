import React, { Component } from 'react';
import {
    View,
    TouchableWithoutFeedback,
} from 'react-native';

export default RadioButton = (props) => {
    return(
        <View style={{padding: 2}}>
            <Touch enabled={props.touchEnabled} onPress={props.onPress}>
            <View style={{alignItems: 'center', justifyContent: 'center', width: props.size, height: props.size, borderRadius: 50, backgroundColor: props.color}}>
                <View style={{alignItems: 'center', justifyContent: 'center', width: props.size*0.7, height: props.size*0.7, backgroundColor: '#fff', borderRadius: 50}} >
                    {props.checked?<View style={{width: props.size*0.5, height: props.size*0.5, backgroundColor: props.color, borderRadius: 50}} />:null}
                </View>
            </View>
            </Touch>
        </View>
        )
}

const Touch = (props) => {
    return(
        <View>
            {props.enabled?
            <TouchableWithoutFeedback onPress={props.onPress}>
                {props.children}
            </TouchableWithoutFeedback>
            :
            <View>
                {props.children}
            </View>
            }
        </View>
    )
}