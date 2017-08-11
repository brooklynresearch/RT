import React, { Component } from 'react';

import {
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  View
} from 'react-native';
import Camera from 'react-native-camera';

const lockOpen = require('../img/ic_lock_open_white_24dp.png')
const lockClosed = require('../img/ic_lock_white_24dp.png')
const save = require('../img/ic_save_white_36dp.png')

export default class UpdateEntryScreen extends Component {

    constructor(props) {
        super(props)

        this.camera = null

        this.state = {
            editingText: false,
            text: "",
            cameraActive: false
        }
    }

    save(doc) {
        this.props.navigation.state.params.updateFn(doc, this.state.text)
        this.props.navigation.goBack()
    }

    toggleEdit() {
        this.setState({editingText: !this.state.editingText})
        this.refs.TextEdit.focus()
    }

    toggleCamera() {
        this.setState({cameraActive: !this.state.cameraActive})
    }

    renderCameraOff() {
        return (
            <TouchableOpacity onPress={this.toggleCamera.bind(this)}>
                <Image
                    source={require('../img/ic_add_a_photo_white_48dp.png')}
                />
            </TouchableOpacity>
       )
    }

    renderCameraOn() {
        return (
            <Camera
                ref="Camera"
                style={styles.cameraPreview}
                aspect="fill"
                defaultTouchToFocus>
                    <TouchableOpacity
                      style={styles.closeBtn}
                      onPress={this.toggleCamera.bind(this)}>
                        <Image
                            source={require('../img/ic_clear_white_36dp.png')}
                        />
                    </TouchableOpacity>
            </Camera>
       )
    }

    render() {
        const {params} = this.props.navigation.state

        return (
            <View style={styles.container}>
                <View style={styles.textArea}>
                    <TextInput style={styles.docText}
                        ref="TextEdit"
                        defaultValue={params.doc.body}
                        editable={this.state.editingText}
                        onChangeText={(text) => this.setState({text})}
                    />
                    <View style={styles.buttonArea}>
                        <TouchableOpacity style={styles.saveBtn}
                            onPress={this.save.bind(this, params.doc)}>
                            <Image
                                source={save}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.editBtn}
                            onPress={this.toggleEdit.bind(this)}>
                            <Image
                                source={this.state.editingText ? lockOpen : lockClosed}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.cameraPort}>
                    {this.state.cameraActive ? this.renderCameraOn() : this.renderCameraOff()}
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
    buttonArea: {
        flex: 1,
        justifyContent: 'space-around',
    },
    saveBtn: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        right: "5%"
    },
    editBtn: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        right: "5%",
    },
    cameraPort: {
        flex: 2,
        //backgroundColor: "#999",
        alignItems: 'center',
        justifyContent: 'center'
    },
    cameraPreview: {
        flex: 1,
        width: "100%",
        height: "100%",
        flexDirection: 'row',
        //alignItems: 'center',
        justifyContent: 'flex-end'
    },
    closeBtn: {
        backgroundColor: "#888",
        height: "10%",
        alignItems: 'center',
        justifyContent: 'flex-start'
    }
})

