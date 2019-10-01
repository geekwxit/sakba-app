import React, { Component } from 'react';
import { View, Alert, Text, Image, Dimensions, TouchableWithoutFeedback} from 'react-native';
import RadioButton from 'react-native-vector-icons/MaterialCommunityIcons';
const { width, height } = Dimensions.get('window');

/** This class groups the radio buttons in a single container **/

export default class RadioGroupCustom extends Component{

    constructor(props){
        super(props);
        this.state = {
            fabricTypes: props.data,
            length: props.data.length,
            selectedFabricIndex : props.default,
        }
    }

    select(index){
        // debugger
        // this.setState(lastState=>({...lastState,  fabricTypes: {index: {isSelected: true}}}))
        this.setState({selectedFabricIndex: index});
        this.props.onSelect(index);
    }

    render() {
        var fontSizeLabel = 15;
        var rows = () => {
            var stack = [];
            isOdd = this.state.length%2==0;
            maxRow = isOdd?this.state.length-1/2:this.state.length/2;
            isImage = this.props.isImage;
            isColor = this.props.isColor;
            for(let i=0, row = 1; i<this.state.length;i){
                const j = i;
                row<=maxRow?stack.push(
                    <View key={row} style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                            <TouchableWithoutFeedback onPress={()=>this.select(j)}>
                                <View style={{flexDirection: isColor?'column':'row', flex:1 ,alignItems: 'center'}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                        <RadioButton name={this.state.selectedFabricIndex===j?"radiobox-marked":"checkbox-blank-circle-outline"} size={25} color={'#0451A5'} />
                                        {isColor?
                                            <View style={{width: 100, height: 100,marginLeft:5, backgroundColor: this.state.fabricTypes[i].code, borderWidth:1, }}  />:null}
                                    </View>
                                    {!isImage?<Text style={{paddingHorizontal: 5, fontSize: fontSizeLabel}}>{isColor?this.state.fabricTypes[i].name:this.state.fabricTypes[i]}</Text>:
                                    <Image style={{width: 100, height: 100, resizeMode: 'contain', marginLeft: 5}} source={this.state.fabricTypes[i]} />}
                                </View>
                            </TouchableWithoutFeedback>

                            <TouchableWithoutFeedback onPress={()=>this.select(j+1)}>
                                <View style={{flexDirection: isColor?'column':'row', flex:1 ,alignItems: 'center'}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                        <RadioButton name={this.state.selectedFabricIndex===j+1?"radiobox-marked":"checkbox-blank-circle-outline"} size={25} color={'#0451A5'} />
                                        {isColor?
                                            <View style={{fontSize: fontSizeLabel, width: 100, height: 100, marginLeft:10, backgroundColor: this.state.fabricTypes[j+1].code, borderWidth:1, }}  />:null}
                                    </View>
                                    {!isImage?<Text style={{paddingHorizontal: 5, fontSize: fontSizeLabel}}>{isColor?this.state.fabricTypes[i+1].name:this.state.fabricTypes[i+1]}</Text>:
                                        <Image style={{width: 100, marginLeft: 5,height: 100, resizeMode: 'contain'}} source={this.state.fabricTypes[i+1]} />}
                                </View>
                            </TouchableWithoutFeedback>

                    </View>
                ):
                    stack.push(<View key={row} style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableWithoutFeedback onPress={()=>this.select(j)}>
                        <View style={{flexDirection: isColor?'column':'row', flex:1, alignItems:'center'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <RadioButton name={this.state.selectedFabricIndex===j?"radiobox-marked":"checkbox-blank-circle-outline"} size={25} color={'#0451A5'} />
                                {isColor?
                                    <View style={{width: 100, height: 100,marginLeft: 5, backgroundColor: this.state.fabricTypes[i].code, borderWidth:1, }}  />:null}
                            </View>
                            {!isImage?<Text style={{fontSize: fontSizeLabel, paddingHorizontal: 5}}>{isColor?this.state.fabricTypes[i].name:this.state.fabricTypes[i]}</Text>:
                                <Image style={{width: 100, height: 100, resizeMode: 'contain', marginLeft: 5}} source={this.state.fabricTypes[i]} />}
                            {/*<Text style={{paddingHorizontal:5}}>{this.state.fabricTypes[i]}</Text>*/}
                        </View>
                    </TouchableWithoutFeedback>

                    </View>)
                i+=2;
                row++;
            }
            return stack;
        }

        return(
            <View>
                {rows()}
            </View>
        )
    }
}
