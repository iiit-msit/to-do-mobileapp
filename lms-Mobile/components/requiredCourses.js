import React from 'react';
import { StyleSheet, Footer, View, ScrollView, Text, FlatList, ActivityIndicator } from 'react-native';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import { Card, Rating } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { AsyncStorage } from 'react-native';
import { API_URL } from 'react-native-dotenv';


// This component is for rendering each card of the card layout.
function RCCard({ obj, view_style, title_style, grade_style, text_style }) {
  return (
    <View style={view_style}>
      <Text style={title_style}>{obj.courseName}</Text>
      {(obj.grade === "Incomplete" || obj.grade === "On-going") ? <Text style={grade_style}>Grade: {obj.grade}</Text>
        : <View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <View>
            <Text style={grade_style}>Grade: {obj.grade}</Text>
          </View>
          <View>
            <Rating type='custom'
              tintColor="#92c456" ratingCount={6}
              imageSize={18} readonly startingValue={(obj.points - 7) * 2}
              style={{ padding: 10 }} />
          </View>
        </View>
      }
      <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, }} />
      <Text style={text_style}>
        Status: {obj.status} |
        Points: {obj.points} |
        Credits: {obj.credits}
      </Text>
    </View >
  );
}

//This component is for rendering the card layout.
function RC({ item }) {
  return (
    <Card title="Program Status">
      {
        item.map((obj, i) => {
          return (
            (obj.points) ?
              // If points are not zero, then this part of code will be returned to render fn.
              <RCCard
                obj={obj}
                view_style={styles.pass} title_style={styles.cardTitle}
                grade_style={styles.gradeStyle} text_style={styles.textStyle}
                key={i}
              /> :
              // If points are other than zero, then we check whether the course is incomplete or not.
              (obj.grade === "Incomplete") ?
                // If the course is incomplete, then we will render this.
                <RCCard
                  obj={obj}
                  view_style={styles.fail} title_style={styles.cardTitle}
                  grade_style={styles.gradeStyle} text_style={styles.textStyle}
                  key={i}
                /> :
                // If the course is On-going, then we will render this.
                <RCCard
                  obj={obj}
                  view_style={styles.ongoing} title_style={styles.cardTitle}
                  grade_style={styles.gradeStyle} text_style={styles.textStyle}
                  key={i}
                />
          );
        })
      }
    </Card >
  );
}

// This component is for rendering the message part in the UI.
function MC({ message, icon_name }) {
  return (
    <View style={styles.icon}>
      <Icon name={icon_name} size={100} />
      <Text style={styles.status}>{message}</Text>
    </View>
  );
}

// This component is for rendering the message part in the UI.
function EC({ message, icon_name }) {
  return (
    <View style={styles.icon}>
      <Icon name={icon_name} size={100} />
      <Text style={{ fontSize: 25 }}>{message}</Text>
    </View>
  );
}

export default class RequiredCourses extends React.Component {
  constructor() {
    super();
    // Initialize the data in state
    this.state = {
      isLoading: true,
      result: [],
      isErrorOccured: false,
      isDataReady: false
    };
    // This is for only development purpose.
    //     AsyncStorage.setItem('userDetails', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBnQGZqdS51cyIsImlhdCI6MTU4ODMyOTc1Nn0.n4zk5GaD17AwaS-rMYOqEsV4q2XWnCxq7m6q1bbx5m8e3Gcp-QDqVBFGH60Kj85MqMtOp5bB5SOn7C2byoiVJg');
  }

  // function to fetch the data.
  async fetchAPIData() {
    try {
      let data = await AsyncStorage.getItem('userDetails');
      data = JSON.parse(data);
      // Need to change this url. This url is for development purpose only...change it with your server url.
      let response = await fetch(API_URL + '/api/academicdetails/required/courses/completion/?token=' + data.token); // Update data with data.token.
      let json = await response.json();
      if ("error" in json || json.result.length === 0) {
        this.setState({
          isLoading: false,
          isDataReady: false,
          errorMessage: `The grades are yet to be updated for any of the courses or
                         you might not be a valid user to view this screen.
                         Please write to help if you have any questions`
        });
      } else {
        this.setState({
          result: json.result,
          isPromoted: json.isPromoted,
          isLoading: false,
          isDataReady: true
        });
      }
    } catch (error) {
      this.setState({
        isErrorOccured: true,
        errorMessage: "Network unavailable. Please try again!",
        isLoading: false,
      });
    }
  }

  componentDidMount() {
    // API call to fetch required data
    this.fetchAPIData();
  }


  render() {
    return (
      <ScrollView vertical={true} style={styles.container}>
        {this.state.isLoading ?
          <View style={{ flex: 1, padding: 20 }}>
            <ActivityIndicator
              color='steelblue'
              size='large'
              style={styles.activityIndicator}
            />
          </View>
          :
          <View>
            {this.state.isDataReady ?
              <View>
                {this.state.isPromoted ?
                  <MC
                    message="Congratulations! You are promoted to second year."
                    icon_name="ios-trophy" />
                  :
                  <MC
                    message="Keep working! You will get there."
                    icon_name="ios-walk" />
                }
                <View>
                  <RC item={this.state.result} />
                </View>
              </View> :
              <View style={styles.error}>
                {this.state.isErrorOccured ?
                  <EC
                    message={this.state.errorMessage}
                    icon_name="ios-alert" />
                  : (
                    <EC
                      message={this.state.errorMessage}
                      icon_name="ios-create" />
                  )
                }
              </View>
            }
          </View>
        }
      </ScrollView>
    );
  }
}
// Stylesheet for the screen
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
  },
  ongoing: {
    flex: 1,
    borderColor: '#000000',
    borderWidth: 1.5,
    borderRadius: 10,
    margin: 5,
    justifyContent: 'space-between'
  },
  pass: {
    flex: 1,
    backgroundColor: "#92c456",
    borderWidth: 1.5,
    borderRadius: 10,
    margin: 5,
    justifyContent: 'space-between'
  },
  fail: {
    flex: 0.3,
    backgroundColor: "#eb2d35",
    margin: 5,
    borderWidth: 1.5,
    borderRadius: 10,
    justifyContent: 'space-between'
  },
  icon: {
    alignItems: 'center',
    paddingTop: heightPercentageToDP('5%')
  },
  status: {
    justifyContent: 'space-around',
    alignItems: 'center',
    fontSize: 23,
    padding: widthPercentageToDP('8%'),
    fontFamily: 'sans-serif',
  },
  cardTitle: {
    fontFamily: 'sans-serif',
    fontSize: 20,
    color: 'black',
    padding: 5
  },
  gradeStyle: {
    fontFamily: 'sans-serif',
    fontSize: 18,
    color: 'black',
    padding: 5
  },
  textStyle: {
    fontFamily: 'sans-serif',
    color: 'black',
    padding: 5
  },
  error: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: widthPercentageToDP('10%')
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
  }
});
