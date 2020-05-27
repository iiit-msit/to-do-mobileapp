/*
This screen for user home
just to display the user email address
*/
import React, {Component} from 'react'
import { StyleSheet, Text, View, Button } from 'react-native';
import { AsyncStorage } from 'react-native';
import BottomTab from '../components/botTab'

/*
The home screen to just display the user email and 
log out
*/
class HomeScreen extends Component{
    //state to store the email and token
    state = {
        email: '',
        token: '',
    }; 

    //soon after the user redirected to home need to
    //get the user details from async storage
    componentDidMount(){
        AsyncStorage.getItem('userDetails').then((details) => {
            var obj = JSON.parse(details);
            this.setState({email: obj.email, token: obj.token});
        });
    }

    //user logged out delete the details from async storage
    deleteToken = () =>{
        AsyncStorage.clear()
        this.props.navigation.navigate('signIn');
    }

    render(){
        return(
            <BottomTab></BottomTab>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
});



export default HomeScreen;