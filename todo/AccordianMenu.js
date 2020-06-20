import React, {Component} from 'react';
import { View, TouchableOpacity, Text, StyleSheet, LayoutAnimation, Platform, UIManager,Switch, Button,Alert} from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";

export default class AccordianMenu extends Component{

    constructor(props) {
        super(props);
        this.state = { 
          data: props.data,
          expanded : false,
          switchValue:false,
          switchValue1:false
        }

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }
    toggleSwitch = (value) => {
        
        this.setState({switchValue: value})
        
     }
     toggleSwitch1 = (value1) => {
        
        this.setState({switchValue1: value1})
        
     }

  
  render() {

    return (
       <View >
            <TouchableOpacity ref={this.accordian} style={styles.row} onPress={()=>this.toggleExpand()}>
                <Text style={[styles.title, styles.font]}>{this.props.title}</Text>
            </TouchableOpacity>
            
            {
                this.state.expanded &&
                <View style={styles.child}>
                    {this.props.data}
                    {this.props.created_on}
                    {this.props.Start}
                    {this.props.End}
                    {this.props.Created_by}
                    <View style={{flexDirection : "row"}}>
                    <Text style = {{fontSize:17,fontWeight :"bold"}}>{this.state.switchValue?'Switch is ON :':'Switch is OFF :'}</Text>
    
                    <Switch
                    style={{marginLeft:10}}
                    onValueChange = {this.toggleSwitch}
                    value = {this.state.switchValue}/>
                    </View>
                    <View style={{flexDirection : "row"}}>
                    <Text style = {{fontSize:17,fontWeight :"bold"}}>{this.state.switchValue1?'Switch is ON :':'Switch is OFF :'}</Text>
                    <Switch
                        style={{marginLeft:10}}
                        onValueChange = {this.toggleSwitch1}
                        value = {this.state.switchValue1}/>
                    </View>
                
                
                <View style={[{ flexDirection:"row"}]}>
                <Text style = {{fontSize:17,fontWeight :"bold"}}>Accept the invitation :  </Text>
                <Button
                    onPress={this.buttonClickListener}
                    title="Accept"
                    color="#FF3D00" 
                />
                </View>                       
                </View>
            } 
       </View>
    )
  }

  toggleExpand=()=>{
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({expanded : !this.state.expanded})
  }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        
      },
    title:{
        fontSize: 25,
        fontWeight:'bold',
        color: "black",
        width:"100%",
        marginLeft:10
    },
    row:{
        flexDirection: 'row',
        justifyContent:'space-between',
        height:56,
        alignItems:'center',
        backgroundColor: "#99CCFF",
        width:"100%"
    },
    parentHr:{
        height:1,
        color: "white",
        width:'100%'
    },
    child:{
        backgroundColor:"#C0C0C0",
        padding:20,
        fontSize: 30,
        fontWeight:'bold',
    
        
    }
    
});