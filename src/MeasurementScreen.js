import React, { Component } from 'react';
import {TouchableWithoutFeedback, Picker, Alert, View, Text, Image, Dimensions, SafeAreaView, TextInput, TouchableOpacity, Linking,ScrollView } from 'react-native';
import {Button} from "native-base";
import axios from "./axios/AxiosInstance";

const { width, height } = Dimensions.get('window');

export default class MeasurementScreen extends Component {
    state = {
        acceptTerms: false, neck:'', length:'', shoulder:'', arm_length:'',
        arm_width:'', vest_size:'', hip_size:'', bottom:'', name: '', email: ''
    };

    static navigationOptions = { header:null };

    async submit(){
        let {neck, length, shoulder, arm_length, arm_width, vest_size, hip_size,
            bottom, name, email} = this.state;
        if(!this.validateFields(neck, length, shoulder, arm_length, arm_width, vest_size, hip_size,
            bottom, name, email)){
            if(this.state.acceptTerms){
                await axios.post('write_measurements.php', {
                    neck, length, shoulder, arm_length, arm_width,
                    vest_size, hip_size, bottom, name, email
                })
                    .then(response=>response.data)
                    .then(response=>{
                        if(response.error){
                            alert(response.msg);
                        } else {
                            alert("Measurement submitted successfully!");
                            this.props.navigation.navigate('login');
                        }
                    })

            } else {
                alert("Please accept terms and conditions.");
            }
            // this.validateFields(ata})
        } else {
            alert("All fields are mandatory.");
        }
    }

    validateFields(){
        var empty =0;
        var ar = Object.assign([], arguments);
        ar.forEach(a=>a.trim().length==0?empty++:0);
        console.log(empty)
        return empty;
    }

    render(){
        return (
            <SafeAreaView style={{flex:1}}>
                <ScrollView>
                    <View style={{marginTop:10,flexDirection:'row', alignItems:'center', justifyContent:'space-evenly'}}>
                        <View style={{flex:1.5, height:100}}>
                            <Image style={{width:null,height:null,flex:1, resizeMode:'contain'}} source={require('../img/om.png')} />
                        </View>
                        <View style={{flex: 3.5,alignSelf:'flex-end', justifyContent:'space-evenly'}}>
                            <Input data={ "الاسم :"} onChangeText={(name)=>this.setState({name})}/>
                            <Input data={'ايميل :'} onChangeText={(email)=>this.setState({email})}/>
                        </View>
                    </View>
                    <View style={{alignItems:'center', width:width, marginTop:20}}>
                        <View style={{width:'90%',height:(width+(width*0.1)), justifyContent:'center'}}>
                            <Image style={{width:null, height: null,flex:1,resizeMode:'contain'}} source={require('../img/dress.png')} />
                            <View style={{
                                justifyContent:'space-evenly',
                                alignItems:'center',position:'absolute',flex:1,zIndex:10,width:'100%', height: '90%'}}>
                                <Box onChangeText={(neck)=>this.setState({neck})}  data={'الرقبة'}/>
                                <Box onChangeText={(length)=>this.setState({length})}  data={'الطول'}/>
                                <Box onChangeText={(shoulder)=>this.setState({shoulder})}  data={'الكتف'}/>
                                <Box onChangeText={(arm_length)=>this.setState({arm_length})}  data={'طول الذراع'}/>
                                <Box onChangeText={(arm_width)=>this.setState({arm_width})}  data={'وسع الذراع'}/>
                                <Box onChangeText={(vest_size)=>this.setState({vest_size})}  data={'وسع البطن'}/>
                                <Box onChangeText={(hip_size)=>this.setState({hip_size})}  data={'وسع الورك'}/>
                                <Box onChangeText={(bottom)=>this.setState({bottom})}  data={'وسع الخطوه'}/>
                            </View>
                        </View>
                    </View>
                    <View style={{alignSelf:'center', marginTop:20,flexDirection:'row', width:'90%', alignItems:'center'}}>
                        <View style={{width:'93%',height:70}}>
                            <Text style={{paddingHorizontal:5,textAlign:'justify'}}>* اقر أن المقاسات المعطاة صحيحة وانني موافق على المقاس، ولا تتحمل شركة سكبه أي مسؤولية اذا كانت مقاسات الدشداشه المعطاة غير صحيحة.</Text>
                        </View>
                        <View style={{flex:1,height:70}}>
                            <Checkbox isActive={this.state.acceptTerms} onChangeMode={()=>this.setState(prev=>({acceptTerms:!prev.acceptTerms}))}  />
                        </View>
                    </View>
            <Button
                style={{ marginTop:10,marginBottom:20,alignSelf:'center',backgroundColor: '#0451A5', width: width - 80, height: 40, justifyContent: 'center' }}
                onPress={() =>this.submit()}>
                <Text style={{ fontSize: 18, color: 'white' }}>Submit Measurements</Text>
            </Button>
            </ScrollView>
        </SafeAreaView>
    )
  }
}

const Box=({data, onChangeText, image})=>(
    <View style={{padding:10,width:'70%',alignItems:'center',
        justifyContent:'center', borderWidth:0}}>
        <Text style={{fontSize: 14, fontWeight:'bold',color: '#0451A5'}}>{data}</Text>
        <TextInput onChangeText={(text)=>onChangeText(text)} style={{borderColor:'#0451A5',textAlign:'center',padding:0, margin:0, width:'60%', borderBottomWidth:1,borderStyle:'dotted', borderRadius:0.5}}/>
    </View>
)

const Input=({data, onChangeText, image})=>(
    <View style={{width:'95%',color:'#0451A5',flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
        <TextInput onChangeText={onChangeText} style={{height:35,textAlign:'right',flex:4, width:null,borderColor:'#0451A5', borderBottomWidth:1,borderStyle:'dotted', borderRadius:0.5}}/>
        <Text style={{flex:1, color:'#0451A5',fontWeight:'bold',fontSize:14}}>{data}</Text>
    </View>
)

const Checkbox=({onChangeMode, isActive})=>(
    <TouchableWithoutFeedback onPress={onChangeMode}>
        <View style={{borderWidth:2, borderRadius:2,alignItems:'center', justifyContent:'center', borderColor:'#0451A5', width:18, height:18}}>
            {isActive && <Image source={require('../img/blue_tick.png')} style={{resizeMode: 'contain', width:10,height:10}}/>}
        </View>
    </TouchableWithoutFeedback>
)

