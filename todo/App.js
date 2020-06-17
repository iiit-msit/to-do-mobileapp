import React from "react"
import {SafeAreaView, FlatList, StyleSheet, Text, View, Button,ActivityIndicator,Alert, ScrollView } from "react-native"
import * as Google from 'expo-google-app-auth';
import Constants from 'expo-constants';
import { Header } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';


export default class App extends React.Component {
  constructor(props) {
    super(props)
    var today = new Date()
    this.state = {
      signedIn: false,
      name: "",
      email : "",
     dataSource : [],
     date:moment(today).format("YYYY-MM-DD")
    }
  }

  signIn = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId:
          "957732613139-a4rbsd7po036hqh8u6ocn9vslsbgn9m8.apps.googleusercontent.com",
        
      })
      if (result.type == "success") {
        this.setState({
          signedIn: true,
          email : result.user.email
          })
          //console.log(this.state.email)
          this.get_events();
      } else {
        console.log("cancelled")
      }
    } catch (e) {
      console.log("error", e)
    }
  }
async get_events() {
  //console.log(this.state.email);
  //console.log(this.state.date);
    await fetch("http://192.168.43.63:5000/mydayevents"+"/"+this.state.email+"/"+this.state.date)
      .then(response =>  response.json())
      .then((data)=> 
      { 
          console.log(data)
          this.setState({
            dataSource: data
            })
      })
      .catch(error=>console.log(error))
}

signout(){
  this.setState({signedIn:false}),
  
  <LoginPage signIn={this.signIn}/>
}


  
  
render() {
    return ( 
      <View style={styles.container}>
        {this.state.signedIn ? (
        
          <View style={styles.container}>
          <Header
           
          leftComponent={
            <DatePicker
              date={this.state.date}
              mode="date"
              placeholder="select date"
              format="YYYY-MM-DD"
              minDate="2019-05-01"
              maxDate="2021-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  bottom : 20,
                  marginLeft: 0,  
                },
                dateInput: {
                  marginLeft:30,
                  marginBottom: 30,
                
                }
              }}
              onDateChange={(date) => {this.setState({date: date}),this.get_events()}}     
            />}
          centerComponent={{ text: 'ToDo List', style: { color: 'white',fontSize : 30 ,fontWeight:"bold",marginBottom:30,textAlign:"center",marginLeft: 40} }}
          rightComponent={
            <View style = {{marginBottom:30,size : 100}}>
            <Button
              color = "green"
              title="LogOut"
              
              onPress={() => this.signout()
            }/>
          </View>
      }
          
          backgroundColor="#3D6DCC"
        />
            {this.state.dataSource.length === 0 ?(
              <View style={styles.container}>
            <Text style = {{fontSize : 30}}>No event scheduled today</Text>
            </View>
            ):(
              <SafeAreaView style={styles.container}>
             <FlatList
               data={this.state.dataSource} 
                renderItem={({ item }) => <Item item={item} />} 
             />
             </SafeAreaView>
            )}
           </View >
        ) : (
          <LoginPage signIn={this.signIn} />  
        )}
      </View>
      
    );
  }
}


function Item({ item }) {
  
  return (
    <ScrollView>
    <View style={styles.item}> 
      <Text style={styles.head}>Title : {item.summary} </Text> 
      <Text style={styles.text}>Description : {item.description} </Text>
      <Text style={styles.text}>Created : {item.created} </Text>
      <Text style={styles.text}>Start : {item.start.dateTime} </Text>
      <Text style={styles.text}>End : {item.end.dateTime} </Text>
      <Text style={styles.text}>Created By : {item.creator.email} </Text>  
    </View>  
    </ScrollView>
  )
}



const LoginPage = props => {
  return (
    <View>
      <Text style={styles.header}>Sign In With Google</Text>
      <Button title="Sign in with Google" onPress={() => props.signIn()} />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    
  },
  header: {
    fontSize: 25
  },
  
  item: {
    backgroundColor: 'skyblue',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 0
  },
  head: {
    fontSize: 20,
  },
  text:{
    fontSize: 17,
  }

})