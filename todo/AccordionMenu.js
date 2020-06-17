import React, {Component} from 'react';
import { View, TouchableOpacity, Text, StyleSheet, LayoutAnimation, Platform, UIManager} from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";

export default class AccordianMenu extends Component{

    constructor(props) {
        super(props);
        this.state = { 
          data: props.data,
          expanded : false,
        }

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }
  
  render() {

    return (
       <View>
            <TouchableOpacity ref={this.accordian} style={styles.row} onPress={()=>this.toggleExpand()}>
                <Text style={[styles.title, styles.font]}>{this.props.title}</Text>
            </TouchableOpacity>
            <View style={styles.parentHr}/>
            {
                this.state.expanded &&
                <View style={styles.child}>
                    {this.props.data}
                    {this.props.created_on}
                    {this.props.Start}
                    {this.props.End}
                    {this.props.Created_by}
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
    title:{
        fontSize: 19,
        fontWeight:'bold',
        color: "black",
        width:"100%"
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
        fontFamily:'Cochin'
    }
    
});