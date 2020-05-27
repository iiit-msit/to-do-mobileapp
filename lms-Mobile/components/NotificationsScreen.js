import React from 'react';
import {ScrollView, StyleSheet, AsyncStorage, Text, View, Vibration, Platform } from 'react-native';

import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { Notifications } from 'expo';
import { Card, Button } from 'react-native-elements';
import CardsContainer from './CardsContainer';
import { API_URL} from 'react-native-dotenv'

export default class NotificationsScreen extends React.Component {
  state = {
    notificationsList: [],
  };
  
  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      expo_token = await Notifications.getExpoPushTokenAsync();
      console.log(expo_token);
	  AsyncStorage.getItem("userDetails").then((value) => {
		value = JSON.parse(value);
		this.subscribeToNotifications(value.email, expo_token, value.token);
	  });
      this.setState({ expoPushToken: expo_token });
    } 
    else {
      alert('Must use physical device for Push Notifications');
    }
  };
  
  async subscribeToNotifications(email, expo_token, api_token) {
    var data = {
     email: email,
     expoToken: expo_token
    };
    try {
	 const url = API_URL + '/api/notifications/subscribetonotification?token='+api_token;
	 console.log("here2");
     let response = await fetch(
      url,
      {
        method: "POST",
        headers: {
         "Accept": "application/json",
         "Content-Type": "application/json"
        },
       body: JSON.stringify(data)
     });
   } 
   catch (errors) {
     
    } 
  };

  componentDidMount() {
	if (Platform.OS === 'android') {
	  Notifications.createChannelAndroidAsync('msit-iiit', {
		name: 'msit-iiit',
		sound: true,
	  });
	};
    this.registerForPushNotificationsAsync();
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = notification => {
    // do whatever you want to do with the notification
	Vibration.vibrate();
    this.setState(state => {
      const list = [notification].concat(state.notificationsList);
      return {
        notificationsList: list
      };
    });
  };
  
  renderCard(item) {
	  if(item.data.img_url){
		  return (		
			 <Card title={item.data.title} image={{ uri: item.data.img_url }} >
				<Text style={{ marginBottom: 10 }}>
				   {item.data.body}
				</Text>
			 </Card>
		  );
	  }
	  else{
		  return (		
			 <Card title={item.data.title}  >
				<Text style={{ marginBottom: 10 }}>
				   {item.data.body}
				</Text>
			 </Card>
		  );
	  }
   }

  render() {
	if(this.state.notificationsList.length==0){
		 return (
			<View style={styles.container}>
			  <ScrollView>
				<View style={styles.container}>
					<Text style={ styles.message }>You Don't have any Notifications</Text>
				</View>
			  </ScrollView>
			</View>
		);
	}
	else{
		return (
			<View style={styles.container}>
			  <ScrollView>
				<View style={styles.container}>
					<CardsContainer data={this.state.notificationsList}  renderCard={this.renderCard} />
				</View>
			  </ScrollView>
			</View>
		);
	}
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 2
  },
  separator:
  {
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%'
  },
  text:
  {
    fontSize: 16,
    color: 'black',
    padding: 15
  },
  message:
  {
    fontSize: 16,
    color: 'black',
    padding: 15,
	fontWeight:"bold",
	textAlign:"center"
  },
  heading:
  {
    fontSize: 30,
    color: 'black',
    padding: 15,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  image: {
    width: '100%', 
    height: 250,
    alignItems: 'center'
  },
})