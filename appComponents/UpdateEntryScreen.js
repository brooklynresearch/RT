import React, { Component } from 'react';

import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  View
} from 'react-native';

const lockOpen = require('../img/ic_lock_open_white_24dp.png')
const lockClosed = require('../img/ic_lock_white_24dp.png')

export default class UpdateEntryScreen extends Component {

    constructor(props) {
        super(props)

        this.state = {
            editingText: false
        }
    }

    toggleEdit() {
        this.setState({editingText: !this.state.editingText})
        this.refs.TextEdit.focus()
    }

    render() {
        const {params} = this.props.navigation.state
        return (
            <View style={styles.container}>
                <View style={styles.textArea}>
                    <TextInput style={styles.docText}
                        ref="TextEdit"
                        value={params.doc.body}
                        editable={this.state.editingText}
                    />
                    <TouchableOpacity style={styles.editBtn} onPress={this.toggleEdit.bind(this)}>
                        <Image
                            source={this.state.editingText ? lockOpen : lockClosed}
                        />
                    </TouchableOpacity>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: "#000"
    },
    docText: {
        flex: 3,
        fontSize: 24,
        color: "#fff"
    },
    editBtn: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        right: "5%",
        flex: 1,
    },
    cameraPort: {
        flex: 2,
        backgroundColor: "#999",
        alignItems: 'center',
        justifyContent: 'center'
    }
})

