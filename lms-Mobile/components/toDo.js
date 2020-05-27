import React from 'react'
import { FlatList, ActivityIndicator, StyleSheet, View, Text, AsyncStorage } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import TodoItem from './todoItem'
import OfflineFirstAPI from 'react-native-offline-api';
import { API_URL } from 'react-native-dotenv'


const API_OPTIONS = {
  domains: { default: API_URL },
  prefixes: { default: '/api/todo' },
  debugAPI: false,
  printNetworkRequests: false
};

const API_SERVICES = {
  todo: {
    path: 'todo-list/',
    method: 'GET',
    expiration: 3 * 60 * 1000,
    disableCache: false
  }
};

const api = new OfflineFirstAPI(API_OPTIONS, API_SERVICES);

export default class ToDo extends React.Component {
  //  Constructor to initialse the TODO.
  constructor (props) {
    // Inheriting the Parent class props
    super(props)
    // Declaring the props
    this.state = {
      isLoading: true, // To check Data is loaded on not
      count: 0, // To check weather the To Do is empty or not to provide motivation message
      isErrorOccured: false, // To Check for any exception in the Fetching API
      token: '',
      dataJson: '',
      errorMessage: ''
    }
  }

  async componentDidMount () {
    // To fetch the To-Do available for a particular student from the API
    // console.log(this.state.token)
    // log.info(this.state.token);
    try {
      const value = await AsyncStorage.getItem('userDetails')
      var obj = JSON.parse(value)
      console.log('token' in obj);
      this.setState({ token: obj.token })
    } catch (error) {
      // console.log(error)
    }
    this.functionDataFetch();
  }

  async functionDataFetch () {
    try {
      const responseJson = await api.fetch(
        'todo',
        {
          queryParameters: {
            token: this.state.token
          }
        }
      );
      this.setState({
        isLoading: true, // True because Json is still being fetched, So to show the activyt indicator
        dataJson: '',
        errorMessage: '',
        isDataReady: false // Still fetching so data not ready
      },
      function fetchAPIData () {
        var todoList = []
        // Result list
        var counter = 0
        // Counter
        const apiData = responseJson// Fetched json is assigned to apiData
        // console.log("Before loop");
        // console.log(apiData);
        for (var eachModule in apiData.activities) { // console.log("each Module: "+eachModule)
          var acttivity = apiData.activities[eachModule]// Each activity
          // Pushing the details in the json into the list along with count and Key
          todoList.push({
            status: acttivity.status,
            courseName: acttivity.courseName,
            moduleName: acttivity.moduleName,
            moduleId: acttivity.moduleId,
            activityName: acttivity.activityName,
            activityId: acttivity.activityId,
            ETC: acttivity.ETC,
            key: acttivity.moduleId + acttivity.activityId,
            count: counter + 1,
            timestamp: acttivity.submittedAt
          })
          counter = counter + 1
        }// console.log(todoList)
        this.state.dataJson = todoList// Set the json to state variable
        this.state.isLoading = false// Change the state to confirm the fetching of Json
        this.state.count = counter// State assignment
        if (counter < 1) { // if count < 0, No ToDo available else show the TODO
          this.state.isDataReady = false
          this.state.errorMessage = "No To-Do's Available"
        } else {
          this.state.isDataReady = true
        }
        this.forceUpdate()// Re-Render the the UI with the changed state variables.
      }
      )
    } catch (error) {
      console.error(error)
    }
  }

  // For UI elements
  render () { // show activity indicator if the data is still fetching through the API
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator
            color='steelblue'
            size='large'
            style={styles.activityIndicator}
          />
        </View>
      )
    }
    // If Loading is done, Show the ToDO,if assignments are available else show the errors if any
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {this.state.isDataReady // If data is ready without any errors show the todo items in flatlist
            ? <View style={styles.list}>
              <FlatList
                data={this.state.dataJson}
                keyExtractor={(item, index) => item.key}
                renderItem={({ item }) => (
                  <TodoItem item={item} />
                )}
              />
            </View>
            : // Else show the errors if the data is not ready
            <View style={styles.error}>
              <Text style={{ fontSize: 30 }}>{this.state.errorMessage}
              </Text>
            </View>}
        </View>
      </View>
    )
  }
}

// Stylesheets defination for this component
const styles = StyleSheet.create({
  container: {
    width: widthPercentageToDP('100%'),
    flex: 1,
    backgroundColor: '#ffff'
  },
  content: {
    padding: 1
  },
  list: {
    marginTop: 2,
    marginBottom: 2
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
  }
})
