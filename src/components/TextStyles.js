import React,{Component} from "react";
import {Text} from 'react-native';

export const B=(props)=>(<Text style={[{fontWeight:'bold'}, props.style]}>{props.children}</Text>)
export const I=(props)=>(<Text style={[{fontStyle:'italic'}, props.style]}>{props.children}</Text>)
export const U=(props)=>(<Text style={[{textDecorationLine: 'underline'}, props.style]}>{props.children}</Text>)
