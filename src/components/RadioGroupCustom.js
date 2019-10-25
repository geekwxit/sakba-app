import React, { Component } from 'react';
import { View, Alert, Text, Image, Dimensions,ActivityIndicator, TouchableWithoutFeedback} from 'react-native';
import RadioButton from 'react-native-vector-icons/MaterialCommunityIcons';
const { width, height } = Dimensions.get('window');
import Loader from "./Loader";

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
        // debugger
        // this.setState(lastState=>({...lastState,  fabricTypes: {index: {isSelected: true}}}))
        //this.setState({selectedFabricIndex: index});
        this.props.onSelect(index);
    }

    componentDidMount(){
        length = this.state.length;
        array = new Array(length);
        array.fill(true);
        this.setState({loaderStates: array});
    }

    render() {
        // debugger
        var data = this.props.data;
        var length = data?data.length:0;
        var fontSizeLabel = 15;
        var rows = () => {
            console.log("PRINTING LIST STARTED ");
            var stack = [];
            isOdd = length%2==0;
            maxRow = isOdd?length-1/2:length/2;
            isImage = this.props.isImage;
            isColor = this.props.isColor;
    for(var i=0, row = 1; i<length;i){
        const j = i;
        console.log("Printing the list ", i);
        row<=maxRow?stack.push(
            <View key={row} style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                <TouchableWithoutFeedback onPress={()=>this.select(j)}>
                    <View style={{flexDirection: isColor?'column':'row', flex:1 ,alignItems: 'center'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <RadioButton name={this.props.selected===j?"radiobox-marked":"checkbox-blank-circle-outline"} size={25} color={'#0451A5'} />
                            {isColor?
                                <View style={{width: 100, height: 100,marginLeft:5, backgroundColor: data[i].code, borderWidth:1, }}  />:null}
                        </View>
                        {!isImage?
                            <Text style={{paddingHorizontal: 5, fontSize: fontSizeLabel}}>
                                {isColor?
                                    data[i].name:data[i].name}
                            </Text>:
                            <View>
                                <Image
                                    //onLoadEnd={()=>this.setState({loaderStates: {i: false} })}
                                    style={{width: 100, height: 100, resizeMode: 'cover', marginLeft: 5}} source={{uri:data[i].path}} />
                                {/*{this.state.loaderStates[i] && <Loader />}*/}
                            </View>
                        }
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={()=>this.select(j+1)}>
                    <View style={{flexDirection: isColor?'column':'row', flex:1 ,alignItems: 'center'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <RadioButton name={this.props.selected===j+1?"radiobox-marked":"checkbox-blank-circle-outline"} size={25} color={'#0451A5'} />
                            {isColor?
                                <View style={{fontSize: fontSizeLabel, width: 100, height: 100, marginLeft:10, backgroundColor: data[j+1].code, borderWidth:1, }}  />:null}
                        </View>
                        {!isImage?
                            <Text style={{paddingHorizontal: 5, fontSize: fontSizeLabel}}>
                                {isColor?
                                    data[i+1].name:data[i+1].name}
                            </Text>:
                            <View>
                                <Image
                                    //onLoadEnd={()=>{t= i+1;this.setState({loaderStates: {t: false} })}}
                                    style={{width: 100, height: 100, resizeMode: 'cover', marginLeft: 5}} source={{uri:data[i+1].path}} />
                                {/*{this.state.loaderStates[i+1] && <Loader />}*/}
                            </View>
                        }
                        {/*{!isImage?<Text style={{paddingHorizontal: 5, fontSize: fontSizeLabel}}>{isColor?data[i+1].name:data[i+1].name}</Text>:*/}
                        {/*    <Image style={{width: 100, marginLeft: 5,height: 100, resizeMode: 'contain'}} source={{uri: data[i+1].path}} />}*/}
                    </View>
                </TouchableWithoutFeedback>

            </View>
            ):

            stack.push(
                <View key={row} style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableWithoutFeedback onPress={() => this.select(j)}>
                        <View
                            style={{flexDirection: isColor ? 'column' : 'row', flex: 1, alignItems: 'center'}}>
                            <View
                                style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <RadioButton
                                    name={this.props.selected === j ? "radiobox-marked" : "checkbox-blank-circle-outline"}
                                    size={25} color={'#0451A5'}/>
                                {isColor ?
                                    <View style={{
                                        width: 100,
                                        height: 100,
                                        marginLeft: 5,
                                        backgroundColor: data[i].code,
                                        borderWidth: 1,
                                    }}/> : null}
                            </View>
                            {!isImage?
                                <Text style={{paddingHorizontal: 5, fontSize: fontSizeLabel}}>
                                    {isColor?
                                        data[i].name:data[i].name}
                                </Text>:
                                <View>
                                    <Image
                                        //onLoadEnd={()=>this.setState({loaderStates: {i: false} })}
                                        style={{width: 100, height: 100, resizeMode: 'cover', marginLeft: 5}} source={{uri:data[i].path}} />
                                    {/*{this.state.loaderStates[i] && <Loader />}*/}
                                </View>
                            }



                            {/*{!isImage ? */}
                            {/*    <Text style={{fontSize: fontSizeLabel, paddingHorizontal: 5}}>*/}
                            {/*        {isColor ? */}
                            {/*            data[i].name : data[i].name}*/}
                            {/*    </Text> :*/}
                            {/*    <Image style={{width: 100, height: 100, resizeMode: 'contain', marginLeft: 5}}*/}
                            {/*           source={{uri: data[i].path}}/>}*/}
                            {/*<Text style={{paddingHorizontal:5}}>{this.state.fabricTypes[i]}</Text>*/}
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
                    rows()
                }
            </View>
        )
    }
}



// var rows = () => {
//     var stack = [];
//     isOdd = length%2==0;
//     maxRow = isOdd?length-1/2:length/2;
//     isImage = this.props.isImage;
//     isColor = this.props.isColor;
//     for(let i=0, row = 1; i<length;i){
//         const j = i;
//         row<=maxRow?stack.push(
//             <View key={row} style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
//                 <TouchableWithoutFeedback onPress={()=>this.select(j)}>
//                     <View style={{flexDirection: isColor?'column':'row', flex:1 ,alignItems: 'center'}}>
//                         <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
//                             <RadioButton name={this.props.selected===j?"radiobox-marked":"checkbox-blank-circle-outline"} size={25} color={'#0451A5'} />
//                             {isColor?
//                                 <View style={{width: 100, height: 100,marginLeft:5, backgroundColor: data[i].code, borderWidth:1, }}  />:null}
//                         </View>
//                         {!isImage?
//                             <Text style={{paddingHorizontal: 5, fontSize: fontSizeLabel}}>
//                                 {isColor?
//                                     data[i].name:data[i].name}
//                             </Text>:
//                             <View>
//                                 <Image
//                                     //onLoadEnd={()=>this.setState({loaderStates: {i: false} })}
//                                     style={{width: 100, height: 100, resizeMode: 'cover', marginLeft: 5}} source={{uri:data[i].path}} />
//                                 {/*{this.state.loaderStates[i] && <Loader />}*/}
//                             </View>
//                         }
//                     </View>
//                 </TouchableWithoutFeedback>
//
//                 <TouchableWithoutFeedback onPress={()=>this.select(j+1)}>
//                     <View style={{flexDirection: isColor?'column':'row', flex:1 ,alignItems: 'center'}}>
//                         <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
//                             <RadioButton name={this.props.selected===j+1?"radiobox-marked":"checkbox-blank-circle-outline"} size={25} color={'#0451A5'} />
//                             {isColor?
//                                 <View style={{fontSize: fontSizeLabel, width: 100, height: 100, marginLeft:10, backgroundColor: data[j+1].code, borderWidth:1, }}  />:null}
//                         </View>
//                         {!isImage?
//                             <Text style={{paddingHorizontal: 5, fontSize: fontSizeLabel}}>
//                                 {isColor?
//                                     data[i+1].name:data[i+1].name}
//                             </Text>:
//                             <View>
//                                 <Image
//                                     //onLoadEnd={()=>{t= i+1;this.setState({loaderStates: {t: false} })}}
//                                     style={{width: 100, height: 100, resizeMode: 'cover', marginLeft: 5}} source={{uri:data[i+1].path}} />
//                                 {/*{this.state.loaderStates[i+1] && <Loader />}*/}
//                             </View>
//                         }
//                         {/*{!isImage?<Text style={{paddingHorizontal: 5, fontSize: fontSizeLabel}}>{isColor?data[i+1].name:data[i+1].name}</Text>:*/}
//                         {/*    <Image style={{width: 100, marginLeft: 5,height: 100, resizeMode: 'contain'}} source={{uri: data[i+1].path}} />}*/}
//                     </View>
//                 </TouchableWithoutFeedback>
//
//             </View>
//             ):
//
//             stack.push(
//                 <View key={row} style={{flexDirection: 'row', alignItems: 'center'}}>
//                     <TouchableWithoutFeedback onPress={() => this.select(j)}>
//                         <View
//                             style={{flexDirection: isColor ? 'column' : 'row', flex: 1, alignItems: 'center'}}>
//                             <View
//                                 style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
//                                 <RadioButton
//                                     name={this.props.selected === j ? "radiobox-marked" : "checkbox-blank-circle-outline"}
//                                     size={25} color={'#0451A5'}/>
//                                 {isColor ?
//                                     <View style={{
//                                         width: 100,
//                                         height: 100,
//                                         marginLeft: 5,
//                                         backgroundColor: data[i].code,
//                                         borderWidth: 1,
//                                     }}/> : null}
//                             </View>
//                             {!isImage?
//                                 <Text style={{paddingHorizontal: 5, fontSize: fontSizeLabel}}>
//                                     {isColor?
//                                         data[i].name:data[i].name}
//                                 </Text>:
//                                 <View>
//                                     <Image
//                                         //onLoadEnd={()=>this.setState({loaderStates: {i: false} })}
//                                         style={{width: 100, height: 100, resizeMode: 'cover', marginLeft: 5}} source={{uri:data[i].path}} />
//                                     {/*{this.state.loaderStates[i] && <Loader />}*/}
//                                 </View>
//                             }
//
//
//
//                             {/*{!isImage ? */}
//                             {/*    <Text style={{fontSize: fontSizeLabel, paddingHorizontal: 5}}>*/}
//                             {/*        {isColor ? */}
//                             {/*            data[i].name : data[i].name}*/}
//                             {/*    </Text> :*/}
//                             {/*    <Image style={{width: 100, height: 100, resizeMode: 'contain', marginLeft: 5}}*/}
//                             {/*           source={{uri: data[i].path}}/>}*/}
//                             {/*<Text style={{paddingHorizontal:5}}>{this.state.fabricTypes[i]}</Text>*/}
//                         </View>
//                     </TouchableWithoutFeedback>
//
//                 </View>)
//         i+=2;
//         row++;
//     }
//     return stack;
// }
