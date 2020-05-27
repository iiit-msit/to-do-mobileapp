import React, { Component } from 'react'
import { StyleSheet,} from 'react-native';
import AppNavigator from './MyNavigator.js';

class App extends Component {
  render () {
    return (
      <AppNavigator/>
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

export default App;