// for Bottom Navigation//
import React from 'react';
// import react in our code.
import { StyleSheet } from 'react-native';
// import all the basic component we have used
import ToDo from './toDo';

export default class HomeScreen extends React.Component {

  // Home Screen to show in Home Option
  render () {
    return (
      <ToDo />

    );
  }
}
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginTop: 16,
  },
});
