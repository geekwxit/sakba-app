import React,{Component}from 'react';
import {View,Text,Image,Dimensions} from 'react-native';
import {Button} from 'native-base';

const { width, height } = Dimensions.get('window');

export default class VisitPage extends Component<Props>{
  static navigationOptions = ({ navigation }) => {
    return{
      headerStyle:{ backgroundColor:'#0451A5',marginLeft:0},
      headerTintColor: '#fff',
    };
  };
  constructor(props){
    super(props)
    this.state={executive_Visit:false,visit_to_Shop:false, language: props.navigation.getParam('language')};
  }
  componentDidMount(){
      this.setState({language: this.props.navigation.getParam('language')});
  }

  requestExecutiveVisit(){
     this.props.navigation.navigate('executive_visitpage', {language: this.state.language});
  }
  visitToShop(){
     this.props.navigation.navigate('visit_to_shoppage', {language: this.state.language});
  }
  render(){
    var screen = this.state.language.visitPage;
    Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

    return(
      <View>
        <View style={{flexDirection:'row',justifyContent:'center',marginTop:50}}>
         <Image style={{width:80,height:80}} source={require('../img/om.png')} />
        </View>
        <View style={{flexDirection:'column',alignItems:'center',marginTop:50}}>
          <View>
            <Text style={{fontSize:18}}>{screen.title}</Text>
          </View>
          <View style={{marginTop:25,flexDirection:'column'}}>
            <Button   style ={{backgroundColor:'#0451A5',width:width-80,height:40,justifyContent:'center'}} onPress={() => this.requestExecutiveVisit()}>
               <Text style={{fontSize:20,color:'white'}}>{screen.requestButton}</Text>
            </Button>
            <Button   style ={{backgroundColor:'#0451A5',width:width-80,height:40,justifyContent:'center',marginTop:20}} onPress={() => this.visitToShop()}>
               <Text style={{fontSize:20,color:'white'}}>{screen.visitButton}</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
