// Bottom Navigation//
import React from 'react'
// import all the basic component we have used
import Icon from 'react-native-vector-icons/Ionicons';
// import Ionicons to show the icon for bottom options
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './HomeScreen';
import ProgramScreen from './ProgramScreen';
import NotificationsScreen from './NotificationsScreen';

const NotifyStack = createStackNavigator(
  {
    // Defination of Navigaton from home screen
    Home: { screen: NotificationsScreen }
  },
  {
    defaultNavigationOptions: {
      // Header customization of the particular Screen
      headerStyle: {
        backgroundColor: '#3f51b5'
      },
      headerTintColor: '#FFFFFF',
      title: 'Notifications'
    }
  }
);

const HomeStack = createStackNavigator(
  {
    // Defination of Navigaton from home screen
    Home: { screen: HomeScreen }
  },
  {
    defaultNavigationOptions: {
      // Header customization of the particular Screen
      headerStyle: {
        backgroundColor: '#3f51b5'
      },
      headerTintColor: '#FFFFFF',
      title: 'Tasks To Do'
    }
  }
);
const ProgramStack = createStackNavigator(
  {
    // Defination of Navigaton from setting screen
    Settings: { screen: ProgramScreen }

  },
  {
    defaultNavigationOptions: {
      // Header customization of the particular Screen
      headerStyle: {
        backgroundColor: '#3f51b5'
      },
      headerTintColor: '#FFFFFF',
      title: 'Required Courses'
      // Header title
    }
  }
);
const App = createBottomTabNavigator(
  {
    OngoingCourse: {
      screen: HomeStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (<Icon name='ios-list' color={tintColor} size={25} />)
      }
    },
    ProgramStatus: {
      screen: ProgramStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (<Icon name='ios-school' color={tintColor} size={25} />)
      }
    },
    Notifications: {
      screen: NotifyStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (<Icon name='md-notifications' color={tintColor} size={25} />)
      }
    }
  },
  {
    tabBarOptions: {
      activeTintColor: 'white',
      inactiveTintColor: 'black',
      labelStyle: {
        fontSize: 15,
        fontFamily: 'sans-serif',
        paddingBottom: 2
      },
      style: {
        height: 58,
        backgroundColor: '#3f51b5'
      }
    }
  }
);
export default createAppContainer(App);