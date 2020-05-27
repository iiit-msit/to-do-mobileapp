// for Bottom Navigation//
import React from 'react';
// import react in our code.
import { Text, View, StyleSheet } from 'react-native';
// import all the basic component we have used
import RequiredCourses from './requiredCourses';

export default class ProgramScreen extends React.Component {
  // Setting Screen to show in Setting Option
  render () {
    return (
      <RequiredCourses />
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