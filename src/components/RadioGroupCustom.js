import React, { Component } from 'react';
import { View, Alert, Text, Image, Dimensions, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import RadioButton from 'react-native-vector-icons/MaterialCommunityIcons';

/** This class groups the radio buttons in a single container **/

export default class RadioGroupCustom extends Component {

    constructor(props) {
        super(props);
        // this.state = {
        //     fabricTypes: props.data,
        //     length: props.data?props.data.length:0,
        //     selectedFabricIndex : props.default,
        //     loaderStates: [],
        // }
    }

    select(index) {
        this.props.onSelect(index);
    }

    componentDidMount() {
        // length = this.state.length;
        // array = new Array(length);
        // array.fill(true);
        // this.setState({loaderStates: array});
    }

    render() {
        const { noFabric } = this.props.text;
        var data = this.props.data;
        var length = data ? data.length : 0;
        var fontSizeLabel = 15;
        var rows = (isRTL) => {
            var stack = [];
            isOdd = length % 2 == 0;
            maxRow = isOdd ? length - 1 / 2 : length / 2;
            isImage = this.props.isImage;
            for (var i = 0, row = 1; i < length; i) {
                const j = i;
                row <= maxRow ? stack.push(
                    <View key={row} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <TouchableWithoutFeedback onPress={() => this.select(j)}>
                            <View style={[{ flexDirection: 'row', flex: 1, alignItems: 'center' }, (isRTL && { justifyContent: 'flex-end' })]}>
                                {!isRTL ? <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <RadioButton name={this.props.selected === j ? "radiobox-marked" : "checkbox-blank-circle-outline"} size={25} color={'#0451A5'} />
                                </View> : null}
                                {isImage ?
                                    <View>
                                        <Image
                                            style={{ width: 100, height: 100, resizeMode: 'cover', marginLeft: 5 }} source={{ uri: data[i].path }} />
                                        <Text style={{ width: '100%', textAlign: 'center' }}>{data[i].name}</Text>
                                    </View> :
                                    <View style={{ flex: 1 }} >
                                        <Text style={{ width: '100%', textAlign: 'center' }} >{data[i].name + '(' + data[i].price + ' KD)'}</Text>
                                    </View>
                                }
                                {isRTL ? <View style={{ marginLeft: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <RadioButton name={this.props.selected === j ? "radiobox-marked" : "checkbox-blank-circle-outline"} size={25} color={'#0451A5'} />
                                </View> : null}
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => this.select(j + 1)}>
                            <View style={[{ flexDirection: 'row', flex: 1, alignItems: 'center' }, (isRTL && { justifyContent: 'flex-end' })]}>
                                {!isRTL ?
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <RadioButton name={this.props.selected === j + 1 ? "radiobox-marked" : "checkbox-blank-circle-outline"} size={25} color={'#0451A5'} />
                                    </View> : null}
                                {isImage ?
                                    <View>
                                        <Image
                                            style={{ width: 100, height: 100, resizeMode: 'cover', marginLeft: 5 }} source={{ uri: data[i + 1].path }} />
                                        <Text style={{ width: '100%', textAlign: 'center' }}>{data[i + 1].name}</Text>
                                    </View> :
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ width: '100%', textAlign: 'center' }}>{data[i + 1].name + '(' + data[i + 1].price + ' KD)'}</Text>
                                    </View>
                                }
                                {isRTL ?
                                    <View style={{ marginLeft: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <RadioButton name={this.props.selected === j + 1 ? "radiobox-marked" : "checkbox-blank-circle-outline"} size={25} color={'#0451A5'} />
                                    </View> : null}
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                ) :

                    stack.push(
                        <View key={row} style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableWithoutFeedback onPress={() => this.select(j)}>
                                <View
                                    style={[{ flexDirection: 'row', flex: 1, alignItems: 'center' }, (isRTL && { justifyContent: 'flex-end' })]}>
                                    {!isRTL ?
                                        <View
                                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <RadioButton
                                                name={this.props.selected === j ? "radiobox-marked" : "checkbox-blank-circle-outline"}
                                                size={25} color={'#0451A5'} />
                                        </View> : null}
                                    {isImage ?
                                        <View>
                                            <Image
                                                style={{ width: 100, height: 100, resizeMode: 'cover', marginLeft: 5 }} source={{ uri: data[i].path }} />
                                            <Text style={{ width: '100%', textAlign: 'center' }}>{data[j].name}</Text>
                                        </View> :
                                        <View>
                                            <Text>{data[i].name + '(' + data[i].price + ' KD)'}</Text>
                                        </View>
                                    }
                                    {isRTL ?
                                        <View
                                            style={{ marginLeft: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <RadioButton
                                                name={this.props.selected === j ? "radiobox-marked" : "checkbox-blank-circle-outline"}
                                                size={25} color={'#0451A5'} />
                                        </View> : null}
                                </View>
                            </TouchableWithoutFeedback>
                        </View>)
                i += 2;
                row++;
            }
            return stack;
        }
        return (
            <View>
                {
                    data ?
                        rows(this.props.isRTL) :
                        <View style={{ backgroundColor: '#ff6b62', borderRadius: 10, height: 35, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 20, alignSelf: 'center', textAlign: this.props.isRTL ? 'right' : 'left' }}>{noFabric} {this.props.type}</Text>
                        </View>
                }
            </View>
        )
    }
}
