/*
This screen is to check whether the 
user is already logged or not

*/
import React, {Component} from 'react'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { AsyncStorage } from 'react-native';

/*
The loading screen component to check the 
status of user login
*/
class LoadingScreen extends Component {
  //state to store the login details
    state = {
        isLoggedIn: false
    }

    //get the details from asyncstorage
    componentDidMount(){
        AsyncStorage.getItem('userDetails')
                  .then((data) => {
                      if(data){
                        this.props.navigation.navigate('Home');
                      }else{
                        this.props.navigation.navigate('signIn');
                      }
        });
    }

    render() { 
        return (<View style={styles.container}>
            <Text>One moment please...</Text>
            <Text>{"\n"}</Text> 
            <ActivityIndicator size="large"/>
            </View>
            );
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
 
export default LoadingScreen;