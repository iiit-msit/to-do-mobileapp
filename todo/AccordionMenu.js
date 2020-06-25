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
          status : "",
          event_id : props.event_id,
          email_id : props.email_id
        }

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }
    toggleSwitch = (value) => {
        
        this.setState({switchValue: value})
        if(!this.state.switchValue){
            this.update_status()
        }
        
     }
     async update_status(){
        //  console.log(this.state.event_id)
        await fetch(`http://192.168.43.132:5000/free_busy_update/${this.state.event_id}/${this.state.email_id}`)
        .then(response => response.json())
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
                    <Text style = {{fontSize:17,fontWeight :"bold"}}>{this.state.switchValue?'Free':'Busy'}</Text>
    
                    <Switch
                    style={{marginLeft:8}}
                    onValueChange = {this.toggleSwitch}
                    value = {this.state.switchValue}/>
                    </View>
                    
                    
                
                
                <View style={[{ flexDirection:"row"} ]}>
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