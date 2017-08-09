import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default class UpdateEntryScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.test}>UPDATE SCREEN</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000"
    },
    test: {
        fontSize: 16,
        color: "#fff"
    }
})

