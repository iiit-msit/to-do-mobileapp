import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, LayoutAnimation, Platform, UIManager, Switch, Button, Alert } from "react-native";
import { hide } from 'expo/build/launch/SplashScreen';
import SpinnerButton from 'react-native-spinner-button';
// import Icon from "react-native-vector-icons/MaterialIcons";

export default class AccordianMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            expanded: false,
            switchValue: false,
            status:"busy",
            event_id: props.event_id,
            email_id: props.email_id,
            title: "Check In",
            color: "#FF3D00",
            defaultLoading: false,
            stage: 0
        }

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }
    toggleSwitch = (value) => {

        this.setState({ switchValue:value })
        
    }
    async update_status() {
        await fetch(`http://192.168.43.254:5000/free_busy_update/${this.state.event_id}/${this.state.email_id}`)
            .then(response => response.json())
            .then((data) => {
                this.setState({
        
                  status : "Free"
                })
              })
              .catch(error => console.log(error))
           
    }

    checkin_student() {
        if (this.state.stage == 0) {
            this.setState({ defaultLoading: true });
            fetch(`http://192.168.43.254:5000//student_checkin/${this.state.event_id}/${this.state.email_id}`, { method: 'PUT' })
            this.setState({ defaultLoading: false });
            this.state.title = "Done";
            this.state.stage = 1;
        }
        else if (this.state.stage == 1) {

            this.setState({ defaultLoading: true });
            this.setState({ defaultLoading: false });
            this.state.title = "Completed";
            this.state.stage = 2;
            //hide.this.toggleSwitch();

        }
    }

    render() {

        return (
            <View >
                <TouchableOpacity ref={this.accordian} style={styles.row} onPress={() => this.toggleExpand()}>
                    <Text style={[styles.title, styles.font]}>{this.props.title}</Text>
                </TouchableOpacity>

                {
                    this.state.expanded &&
                    <View style={styles.child}>
                        {this.props.data}
                        {this.props.created_on}
                        {this.props.Start}
                        {this.props.End}
                        {this.props.Created_by}
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ fontSize: 17, fontWeight: "bold" }}>{this.state.switchValue ? 'Free' : 'Busy'}</Text>

                            <Switch
                                hide = {this.state.stage==0}
                                style={{ marginLeft: 8 }}
                                onValueChange={this.toggleSwitch}
                                value={this.state.switchValue} />
                        </View>




                        <View style={[{ flexDirection: "row" }]}>
                            <Text style={{ fontSize: 17, fontWeight: "bold" }}></Text>

                            <SpinnerButton
                                disabled={this.state.stage == 2}
                                buttonStyle={styles.buttonStyle}
                                isLoading={this.state.defaultLoading}
                                onPress={() => {
                                    this.checkin_student();
                                }}
                            >
                                <Text style={styles.buttonText}>{this.state.title}</Text>
                            </SpinnerButton>


                        </View>
                    </View>
                }
            </View>
        )
    }

    toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({ expanded: !this.state.expanded })
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",

    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: "black",
        width: "100%",
        marginLeft: 10
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 56,
        alignItems: 'center',
        backgroundColor: "#99CCFF",
        width: "100%"
    },
    parentHr: {
        height: 1,
        color: "white",
        width: '100%'
    },
    child: {
        backgroundColor: "#C0C0C0",
        padding: 20,
        fontSize: 30,
        fontWeight: 'bold',
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
        paddingHorizontal: 20,
    },
    buttonStyle: {
        borderRadius: 10,
        margin: 20,
        color: '#fefefe'
    }
});