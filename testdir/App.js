import React, { Component } from 'react';
import { View, Text, Image, Button, TouchableOpacity } from 'react-native';


export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            arr : [
                {text: "Yes"},
                {text: "No"},
                {text: "SO"},
            ]
        }
    }

    render() {
        return (
            <View>
                <TouchableOpacity onPress={()=>this.setState({index:this.state.index+1})} >
                    <Text style={{fontSize: 50}}>CLick</Text>
                </TouchableOpacity>
                <View>
                    <Text>{this.state.arr[this.state.index].text}</Text>
                </View>
            </View>)
    }
}
