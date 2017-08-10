import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default class UpdateEntryScreen extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {params} = this.props.navigation.state
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{params.doc.body}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000"
    },
    text: {
        fontSize: 40,
        color: "#fff"
    }
})

