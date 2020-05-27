import React, { Component } from 'react'
import { View, StyleSheet, Text, Image } from 'react-native';
import Moment from 'react-moment';
import moment from 'moment-timezone';

export default class TodoItem extends Component {

  checkDate () {
    const currentDate = moment().utc('+2232+08822')
    // chcking with deadline and current time
    const deadline = moment(this.props.item.ETC).utc('+2232+08822')
    const check = currentDate.isBefore(deadline)

    const submissiondate = moment(this.props.item.timestamp).utc('+2232+08822')
    // with submission
    if (submissiondate.isValid()) {
      const submissionCheck = submissiondate.isBefore(deadline)
      // checking with deadline and submission
      if (submissionCheck) {
        // submission before deadline(when we have deadline)
        return (<View style={styles.bubble}><Text style={{ fontSize: 12, backgroundColor: 'rgb(153, 255, 153)', paddingLeft: 1.5, paddingRight: 1.5 }}>Submitted on time</Text></View>)
      } else if (!submissionCheck && deadline.isValid()) {
        return (<View style={styles.bubble}><Text style={{ fontSize: 12, backgroundColor: 'rgb(204, 255, 153)', paddingLeft: 1.5, paddingRight: 1.5 }}>Submitted, late by <Moment from={this.props.item.ETC} ago element={Text}>{this.props.item.timestamp}</Moment></Text></View>)
      } else {
        return (<View style={styles.bubble}><Text style={{ fontSize: 12, backgroundColor: 'rgb(204, 255, 153)', paddingLeft: 1.5, paddingRight: 1.5 }}>Submitted <Moment from={currentDate} ago element={Text}>{this.props.item.timestamp}</Moment> back </Text></View>)
      }
    }

    // No submission
    if (deadline.isValid()) {
      if (!this.props.item.status && check) {
        // no submission before currentTime
        return (<View style={styles.bubble}><Text style={{ fontSize: 12, backgroundColor: 'rgb(255, 255, 153)', paddingLeft: 1.5, paddingRight: 1.5 }}>Due in <Moment fromNow ago element={Text}>{this.props.item.ETC}</Moment></Text></View>)
      } else if (!this.props.item.status && !check) {
        // no submission after currentTime
        return (<View style={styles.bubble}><Text style={{ fontSize: 12, backgroundColor: 'rgb(255, 204, 153)', paddingLeft: 1.5, paddingRight: 1.5 }}>Missed deadline by <Moment fromNow ago element={Text}>{this.props.item.ETC}</Moment></Text></View>)
      }
    }
    if (!deadline.isValid() && !submissiondate.isValid()) {
      return (<View style={styles.bubble}><Text style={{ fontSize: 12, backgroundColor: 'rgb(255, 153, 153)', paddingLeft: 1.5, paddingRight: 1.5 }}>Ask your mentor for due date</Text></View>)
    }
  }

  checkStatus () {
    if (this.props.item.status) {
      return (<Image source={require('../assets/finaltick.png')} style={{ width: 12, height: 12 }} />)
    }
  }

  // Render the props and displaying them as per the UI requirements.
  render (props) {
    return (
      <View style={styles.mainCard}>
        <View>
          <Text style={styles.id}>{this.checkStatus()}
          </Text>
        </View>
        {/* <View style={styles.tick}>{this.checkStatus()}</View> */}
        <View style={styles.item}>
          {
            this.props.item.status ?// If Assignment is Submitted, do strike through
              <View>
                <Text style={styles.titleNoStrikeThrough} numberOfLines={1}>[{this.props.item.moduleName}] {this.props.item.activityName}</Text>
              </View> :// else apply no strike through
              <View>
                <Text style={styles.titleNoStrikeThrough} numberOfLines={1}>[{this.props.item.moduleName}] {this.props.item.activityName}</Text>
              </View>
          }
          <View style={styles.tag}><Text style={{ fontSize: 13 }}>{this.props.item.courseName}</Text></View>
          <View style={styles.tags}>
            {this.checkDate()}
          </View>
        </View>
      </View>
    )
  }
}

// Style sheet defination
const styles = StyleSheet.create({
  // maincard
  mainCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'steelblue',
    borderRadius: 4,
    marginTop: 2,
    marginBottom: 2,
    // backgroundColor: 'yellow',
  },
  // card styling
  item: {
    marginTop: 2,
    marginBottom: 2,
    flex: 2
  },
  // padding and margin for the id box
  id: {
    width: 25,
    marginBottom: 3,
    marginLeft: 2,
    padding: 3,
    fontSize: 12
  },
  tick: {
    marginBottom: 6,
    marginRight: -5,
    marginLeft: -22,
    width: 25
  },

  // for no strikethrough
  titleNoStrikeThrough: {
    // Define your HEX color code here.
    color: 'steelblue',
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold'
    // textDecorationLine: 'line-through',
  },
  // for strikethrough
  titleWithStrikeThough: {
    // Define your HEX color code here.
    color: 'steelblue',
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'line-through'
  },

  // Tag styliing
  tag: {
    paddingHorizontal: 2,
    justifyContent: 'center'
  },
  bubble: {
    paddingHorizontal: 2,
    borderColor: '#bbb',
    // borderWidth: 0.25,
    borderRadius: 10,
    justifyContent: 'center'
  },
  // Tags row
  tags: {
    flexDirection: 'row'
  }
});