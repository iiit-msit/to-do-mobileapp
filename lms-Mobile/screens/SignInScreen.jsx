/*
This screen is to do the authentication 
and authorization for a valid user
*/
import React, {Component} from 'react'
import * as Google from 'expo-google-app-auth';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import { logger } from 'react-native-logs';
import { AsyncStorage } from 'react-native';
import { API_URL, ANDROID_CLIENT_ID, ANDROID_STANDALONE_CLIENT_ID, REDIRECT_URL, IMAGE_URL, IOS_CLIENT_ID, IOS_STANDALONE_CLIENT_ID} from 'react-native-dotenv'
/*
The laoding bar
*/
const Loader = () => (
  <View style={styles.container}>
            <Text>One moment please...</Text>
            <Text>{"\n"}</Text> 
            <ActivityIndicator size="large"/>
  </View>
);

/*
The signin screen component for authentication and 
authorization
*/
class SignInScreen extends Component {
   //state to check the valid user
   state = { InvalidUser: false,loading: false}
  
  //async function to call the google oauth and lms API
  signInWithGoogleAuth = async() => {
    var log = logger.createLogger();
    try{
        this.setState({loading: true})
        //making async call to goolge oauth
        const result = await Google.logInAsync({
          androidClientId: ANDROID_CLIENT_ID,
          androidStandaloneAppClientId: ANDROID_STANDALONE_CLIENT_ID,
          iosClientId: IOS_CLIENT_ID,
          iosStandaloneAppClientId: IOS_STANDALONE_CLIENT_ID,
          redirectUrl: REDIRECT_URL
          // Please comment above line, when using with expo.
        });
        //if authenticated successfully by google then go in
        if(result.type === 'success'){
        const url = API_URL + '/api/auth/mauth';
        //making an async call for authorization
        const response = await fetch(url, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                "email": result.user.email,
                "accessToken": result.accessToken,
              })});
        //if unauthorized user then go in
        if(response.status == 401)
        {
          this.setState({InvalidUser: true, loading: false});
        }
        //if authorized user
        else
        {
          //convert the response into json
          const json = await response.json();
          //if the user is invalid
          if(json.token == undefined || json.role !== "student")
          {
            //invalid user
            this.setState({InvalidUser: true, loading: false});
            log.debug(json);
          }else{
            //valid user store the item in async storage
            AsyncStorage.setItem('userDetails', JSON.stringify(json));
            this.setState({loading:false})
            //valid user navigate to home screen
            this.props.navigation.navigate('Home');
          }
        }
      }
      else{
        //Not authenticated by google
        this.setState({InvalidUser: true, loading:false});
      }
    }
    catch(e){
      //when some error occurs in the google oauth or lms API
      //unexpected error kind of server crash
      this.setState({InvalidUser: true, loading:false})
      return {error: true}
    }
}

render() {
  //if invalid user
  if(this.state.InvalidUser){
    //loading bar
    if(this.state.loading){
      return(< Loader/>)
    }
    else{

      //return with error msg
      return (
          <View style = {styles.container}>
            <Image source = {{uri:IMAGE_URL}}
    style = {styles.logo}></Image>
            <Text style={styles.plainText}>This app is created for students from the class of 2021</Text>
            <Text style={styles.plainText}>who have a valid msitprogram.net email account.</Text>
              <Text style={styles.plainText}>Please contact help@msitprogram.net for help.</Text>
              <Text>{"\n"}</Text> 
              <TouchableOpacity style={[styles.buttonContainer, styles.googleButton]} onPress={() => this.signInWithGoogleAuth()}>
                <View style={styles.socialButtonContent}>
                  <Text style={styles.loginText}>Sign-in with Google</Text>
                </View>  
              </TouchableOpacity>
      </View>
      );
    }
  }
  else{
    //loading bar
    if(this.state.loading){
      return(< Loader/>)
    }
    else{
      //welcome note and sign in button
      return (      
        <View style = {styles.container}>
            {this.state.loading ? <Loader /> : null}
          <Image source = {{uri:IMAGE_URL}}
    style = {styles.logo}></Image>
              <Text style={styles.welcomeText}>Welcome to MSIT-LMS</Text>
              <Text style={styles.plainText}>Please login with your msitprogram.net</Text>
              <Text style={styles.plainText}> google account to use the App.</Text>
              <Text>{"\n"}</Text>      
              <TouchableOpacity style={[styles.buttonContainer, styles.googleButton]} onPress={() => this.signInWithGoogleAuth()}>
              <View style={styles.socialButtonContent}>
                <Text style={styles.loginText}>Sign-in with Google</Text>
              </View>
          </TouchableOpacity>                                       
        </View>
      );
    }
  }
}
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
},

logo:{
   width: 138, height: 165, alignItems: 'center', bottom:90}
,

welcomeText:{
  fontWeight: "bold", fontSize:25, paddingBottom:50},

plainText:{alignContent:"center", left:10},

inputContainer: {
  borderBottomColor: '#F5FCFF',
  backgroundColor: '#FFFFFF',
  borderRadius:30,
  borderBottomWidth: 1,
  width:250,
  height:45,
  marginBottom:15,
  flexDirection: 'row',
  alignItems:'center'
},
inputs:{
  height:45,
  marginLeft:16,
  borderBottomColor: '#FFFFFF',
  flex:1,
},
icon:{
width:15,
height:15,
},
inputIcon:{
marginLeft:15,
justifyContent: 'center'
},
buttonContainer: {
height:45,
flexDirection: 'row',
justifyContent: 'center',
alignItems: 'center',
marginBottom:20,
width:250,
borderRadius:30,
},
loginButton: {
backgroundColor: '#3498db',
},
fabookButton: {
backgroundColor: "#3b5998",
},
googleButton: {
backgroundColor: "#3498db",
},
loginText: {
color: 'white',
fontSize: 17,
},
restoreButtonContainer:{
width:250,
marginBottom:15,
alignItems: 'flex-end'
},
socialButtonContent:{
flexDirection: 'row',
justifyContent: 'center',
alignItems: 'center', 
},
socialIcon:{
color: "#FFFFFF",
marginRight:5
}
});
 
export default SignInScreen;