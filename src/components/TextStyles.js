import React,{Component} from "react";
import {Text} from 'react-native';

export const B=(props)=>(<Text style={{fontWeight:'bold'}}>{props.children}</Text>)
export const I=(props)=>(<Text style={{fontStyle:'italic'}}>{props.children}</Text>)
export const U=(props)=>(<Text style={{textDecorationLine: 'underline'}}>{props.children}</Text>)
