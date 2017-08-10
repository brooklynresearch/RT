import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
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
                <View style={styles.textArea}>
                    <Text style={styles.docText}>{params.doc.body}</Text>
                </View>
                <View style={styles.cameraPort}>
                    <Image
                        source={require('../img/ic_add_a_photo_white_48dp.png')}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000"
    },
    textArea: {
        flex: 1,
        backgroundColor: "#000"
    },
    docText: {
        fontSize: 40,
        color: "#fff"
    },
    cameraPort: {
        flex: 2,
        backgroundColor: "#999",
        alignItems: 'center',
        justifyContent: 'center'
    }
})

