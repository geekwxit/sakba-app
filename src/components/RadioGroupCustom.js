import React, { Component } from 'react';
import { View, Alert, Text, Image, Dimensions,ActivityIndicator, TouchableWithoutFeedback} from 'react-native';
import RadioButton from 'react-native-vector-icons/MaterialCommunityIcons';

/** This class groups the radio buttons in a single container **/

export default class RadioGroupCustom extends Component{

    constructor(props){
        super(props);
        this.state = {
            fabricTypes: props.data,
            length: props.data.length,
            selectedFabricIndex : props.default,
            loaderStates: [],
        }
    }

    select(index){
        this.props.onSelect(index);
    }

    componentDidMount(){
        length = this.state.length;
        array = new Array(length);
        array.fill(true);
        this.setState({loaderStates: array});
    }

    render() {
        var data = this.props.data;
        var length = data?data.length:0;
        var fontSizeLabel = 15;
        var rows = (isRTL) => {
            // console.log("PRINTING LIST STARTED ");
            var stack = [];
            isOdd = length%2==0;
            maxRow = isOdd?length-1/2:length/2;
            isImage = this.props.isImage;
    for(var i=0, row = 1; i<length;i){
        const j = i;
        // console.log("Printing the list ", i);
        row<=maxRow?stack.push(
            <View key={row} style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                <TouchableWithoutFeedback onPress={()=>this.select(j)}>
                    <View style={{flexDirection: 'row', flex:1 ,alignItems: 'center'}}>
                        {!isRTL?<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <RadioButton name={this.props.selected===j?"radiobox-marked":"checkbox-blank-circle-outline"} size={25} color={'#0451A5'} />
                        </View>:null}
                        {isImage?
                            <View>
                                <Image
                                    style={{width: 100, height: 100, resizeMode: 'cover', marginLeft: 5}} source={{uri:data[i].path}} />
                            </View>:
                            <View>
                                <Text>{data[i].name + '(' +data[i].price + ' KD)'}</Text>
                            </View>
                        }
                        {isRTL?<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <RadioButton name={this.props.selected===j?"radiobox-marked":"checkbox-blank-circle-outline"} size={25} color={'#0451A5'} />
                        </View>:null}
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={()=>this.select(j+1)}>
                    <View style={{flexDirection: 'row', flex:1 ,alignItems: 'center'}}>
                        {!isRTL?
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <RadioButton name={this.props.selected===j+1?"radiobox-marked":"checkbox-blank-circle-outline"} size={25} color={'#0451A5'} />
                        </View>:null}
                        {isImage?
                            <View>
                                <Image
                                    style={{width: 100, height: 100, resizeMode: 'cover', marginLeft: 5}} source={{uri:data[i+1].path}} />
                            </View>:
                            <View>
                                <Text>{data[i+1].name + '(' +data[i+1].price + ' KD)'}</Text>
                            </View>
                        }
                        {isRTL?
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <RadioButton name={this.props.selected===j+1?"radiobox-marked":"checkbox-blank-circle-outline"} size={25} color={'#0451A5'} />
                            </View>:null}
                    </View>
                </TouchableWithoutFeedback>

            </View>
            ):

            stack.push(
                <View key={row} style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableWithoutFeedback onPress={() => this.select(j)}>
                        <View
                            style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                            {!isRTL?
                            <View
                                style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <RadioButton
                                    name={this.props.selected === j ? "radiobox-marked" : "checkbox-blank-circle-outline"}
                                    size={25} color={'#0451A5'}/>
                            </View>:null}
                            {isImage?
                                <View>
                                    <Image
                                        style={{width: 100, height: 100, resizeMode: 'cover', marginLeft: 5}} source={{uri:data[i].path}} />
                                </View>:
                                <View>
                                    <Text>{data[i].name + '(' +data[i].price + ' KD)'}</Text>
                                </View>
                            }
                            {isRTL?
                                <View
                                    style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                    <RadioButton
                                        name={this.props.selected === j ? "radiobox-marked" : "checkbox-blank-circle-outline"}
                                        size={25} color={'#0451A5'}/>
                                </View>:null}
                        </View>
                    </TouchableWithoutFeedback>
                </View>)
        i+=2;
        row++;
    }
    console.log("Printing list completed ");
    return stack;
}
        return(
            <View>
                {
                    rows(this.props.isRTL)
                }
            </View>
        )
    }
}