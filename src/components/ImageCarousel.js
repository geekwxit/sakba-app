import React, { Component } from "react";
import {Linking,
    Dimensions, ScrollView, StyleSheet, View, Image,TouchableOpacity, TouchableWithoutFeedback} from "react-native";

const {width} = Dimensions.get('window');

class ImageCarousel extends Component {

    scrollRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex:0
        }
    }

    changeImage(){
        this.scrollRef.current.scrollTo({
            animated: true,
            y: 0,
            x: width * this.state.selectedIndex
        })
    }

    componentDidMount = () => {
        setInterval( ()=> {
            this.setState( prev => ({ selectedIndex: prev.selectedIndex === this.props.data.length - 1 ? 0 : prev.selectedIndex + 1  }),
                this.changeImage)},3000)
    }

    setSelectedIndex = event => {
        // width of the viewSIze
        const viewSize = event.nativeEvent.layoutMeasurement.width;
        // get current position of the scrollView
        const contentOffset = event.nativeEvent.contentOffset.x;
        const selectedIndex = Math.floor(contentOffset / viewSize);
        this.setState({ selectedIndex });
    }

    render() {
        const {data, baseURL, style} = this.props;
        const {selectedIndex} = this.state
        return (
            <View>
                <ScrollView
                    style={this.props.style}
                    horizontal
                            showsHorizontalScrollIndicator={false}
                            pagingEnabled
                            onMomentumScrollEnd={this.setSelectedIndex}
                            ref = {this.scrollRef}
                            >
                    {data.map((image,index) => (
                        <View style={styles.carouselView}>
                            <Image key={image} source={{uri: baseURL+image}} style={styles.carouselImg} />
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.circleView}>
                    {data.map((image, i) => (
                        <TouchableOpacity key={i} onPress={()=>this.setState({selectedIndex: i}, this.changeImage)}>
                        <View key={image} style={[styles.whiteCircle, {backgroundColor: i==selectedIndex?this.props.activeColor:this.props.inActiveColor}]}/>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    }
}
export default ImageCarousel;

const styles = StyleSheet.create({
    container: {width:width-20,elevation:1,height:width/2,borderBottomWidth: 0.5, borderBottomColor: '#333',},
    carouselView:{width:width-20,elevation:1,height:width/2},
    carouselImg:{flex:1,width:null,height:null,resizeMode:'contain',},
    circleView:{width:width,position:'absolute',bottom:5,height:10,display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center'},
    whiteCircle:{width:6,height:6,borderRadius:3,margin:5,backgroundColor:'#fff'}

});
