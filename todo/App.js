import React from "react"
import {  StyleSheet, Text, View, Button, ActivityIndicator, Alert, ScrollView, ListView } from "react-native"
import * as Google from 'expo-google-app-auth';
import Constants from 'expo-constants';
import { Header } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import AccordianMenu from "./AccordionMenu";
import { AsyncStorage } from 'react-native';
import { hide } from "expo/build/launch/SplashScreen";



export default class App extends React.Component {
  constructor(props) {
    super(props)
    var today = new Date()
    this.state = {
      signedIn: false,
      name: "",
      email: "",
      dataSource: [],
      date: moment(today).format("YYYY-MM-DD"),
      invalidUser: false,
      loading: true,
      idToken: ""
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('userDetails').then((details) => {
      var obj = JSON.parse(details);
      if (obj) {
        this.state.signedIn = true;
        this.get_events()
        this.setState({
          signedIn: true,
          email: obj.user.email,
          access: obj.accessToken,
          refreshToken: obj.refreshToken,
          idToken: obj.idToken
        })
      }
    });
  }

  signIn = async () => {
    try {
      this.setState({ loading: true })
      let resp = await AsyncStorage.getItem('userDetails')
      if (resp != null) {
        let userDetails = resp;
        console.log(userDetails)
        let info = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${userDetails.idToken}`)
          .then(response => {
            if (response.status != 200) {
              fetch(`https://oauth2.googleapis.com/token?client_id=957732613139-a4rbsd7po036hqh8u6ocn9vslsbgn9m8.apps.googleusercontent.com&refresh_token=${userDetails.refreshToken}&grant_type=refresh_token`,
                { method: 'post' })
                .then((response) => response.status == 200 ? response.json() : {})
            }
          })
        this.setState({
          signedIn: true,
          email: userDetails.user.email,
          access: info.accessToken,
          refreshToken: userDetails.refreshToken,
          idToken: userDetails.idToken
        })
        userDetails.accessToken = info.accessToken;
        await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));

      } else {
        const result = await Google.logInAsync({
          androidClientId:
            "957732613139-a4rbsd7po036hqh8u6ocn9vslsbgn9m8.apps.googleusercontent.com",
        })

        if (result.type == "success") {
          this.setState({
            signedIn: true,
            email: result.user.email,
            access: result.accessToken,
            refreshToken: result.refreshToken,
            idToken: result.idToken
          })
          // console.log(result);
          const userDetails = await result.json;
          AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));
        }
      }
      this.get_events()
    } catch (e) {
      console.log("error", e)
    }
  }
  
  async get_events() {
    //console.log(this.state.email);
    //console.log(this.state.date);
    await fetch(`http://192.168.43.132:5000/events/${this.state.date}/${this.state.email}`)
      .then(response => response.json())
      .then((data) => {

        //console.log(data)
        this.setState({

          dataSource: data
        })
      })
      .catch(error => console.log(error))
  }
  signout = async () => {
    this.setState({ signedIn: false }),
      await AsyncStorage.removeItem("userDetails");
    <LoginPage signIn={this.signIn} />
  }

  // checkDetails = () => {

  //   // console.debug(`Trying to Check url for token ${this.state.idToken}`)
  //   // await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${this.state.idToken}`)
  //   //   .then(
  //   //     (response) => {
  //   //       if (response.status == 200) {
  //   //         response.json((data) => {
  //   //           console.log(data)
  //   //         })
  //   //       }
  //   //     });
  //   console.debug(`Trying to get from refresh token ${this.state.refreshToken}`)
  //   fetch(`https://oauth2.googleapis.com/token?client_id=957732613139-a4rbsd7po036hqh8u6ocn9vslsbgn9m8.apps.googleusercontent.com&refresh_token=${this.state.refreshToken}&grant_type=refresh_token`,
  //     { method: 'post' })
  //     .then((response) => response.status == 200 ? response.json() : {})
  //     .then(json => {
  //       console.log(json)
  //     })
  // }


  //new method
  // async revoke_Access() {
  //   await fetch("https://oauth2.googleapis.com/revoke", {
  //     method: 'POST',
  //     params: { 'token': result.accessToken },
  //     headers: { 'content-type': 'application/x-www-form-urlencoded' }
  //   });
  // }



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
                      bottom: 20,
                      marginLeft: 0,
                    },
                    dateInput: {
                      marginLeft: 30,
                      marginBottom: 30,

                    }
                  }}
                  onDateChange={(date) => { this.setState({ date: date }), this.get_events() }}
                />}
              centerComponent={{ text: 'ToDo List', style: { color: 'white', fontSize: 30, fontWeight: "bold", marginBottom: 30, textAlign: "center", marginLeft: 40 } }}
              rightComponent={
                <View style={{ marginBottom: 30, size: 100 }}>
                  <Button
                    color="green"
                    title="LogOut"

                    onPress={() => this.signout()
                    } />
                </View>
              }

              backgroundColor="#3D6DCC"
            />
            {this.state.dataSource.length === 0 ? (
              <View style={styles.container}>
                <Text style={{ fontSize: 30 }}>No event scheduled today</Text>
              </View>)
              : (
                //  <FlatList

                //    data={this.state.dataSource} 
                //     renderItem={({ item }) => <Item item={item} />} 
                //  />
                // <ListView
                //   dataSource={this.state.dataSource}
                //   renderRow={this._renderRow(item)}
                // />
                <View style={styles.accordian}>
                  {this.renderAccordians()}
                </View>
              )}
          </View >
        ) : (
            <LoginPage signIn={this.signIn} />
          )}
      </View>
    );
  };
  renderAccordians = () => {
    const items = [];
    for (item of this.state.dataSource) {
      items.push(
        <AccordianMenu
          title={item.summary}
          data={(<Text>Description :{item.description}</Text>)}
          created_on={(<Text>Created on :{item.created}</Text>)}
          Start={(<Text>Start at :{item.start.dateTime}</Text>)}
          End={(<Text>Ends at :{item.end.dateTime}</Text>)}
          Created_by={(<Text>Created by: {item.creator.email}</Text>)}
          event_id = {item.id}
          email_id = {this.state.email}





        //     <Text style={styles.text}>Start : {item.start.dateTime} </Text>
        //     <Text style={styles.text}>End : {item.end.dateTime} </Text>
        //     <Text style={styles.text}>Created By : {item.creator.email} </Text>


        />
      );
    }
    return items;
  }
};



const LoginPage = props => {
  return (
    <View>
      <Text style={styles.header}>Sign In With Google</Text>
      <Button title="Sign in with Google" onPress={() => props.signIn()} />
    </View>
  )
}


const styles = StyleSheet.create({
  accordian: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    fontSize: 25
  },
  container1: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  item: {
    backgroundColor: 'skyblue',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 0,
  },
  head: {
    fontSize: 20,
  },
  text: {
    fontSize: 22,
  }

})