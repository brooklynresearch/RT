/*global require*/ //this is just for eslint
import React, { Component } from 'react'

import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  View
} from 'react-native'
import Camera from 'react-native-camera'
import RNFB from 'react-native-fetch-blob'

const lockOpen = require('../img/ic_lock_open_white_24dp.png')
const lockClosed = require('../img/ic_lock_white_24dp.png')
const save = require('../img/ic_save_white_36dp.png')
const blank = require('../img/ic_add_a_photo_white_48dp.png')

export default class UpdateEntryScreen extends Component {

  constructor(props) {

    super(props)

    this.camera = null

    let doc = this.props.navigation.state.params.doc

    this.state = {
      editingText: false,
      text: doc ? doc.body : "",
      cameraActive: false,
      imageAttachment: this.getAttachment(doc),
      isNewImage: false,
      debug: ""
    }

  }

  getAttachment(doc) {

    if (doc) {
      return doc._attachments ? doc._attachments.image.data : null
    }
    return null

  }

  save(doc, blob) {

    let img = this.state.isNewImage ? blob : null
    this.props.navigation.state.params.updateFn(doc, this.state.text, img)
    this.props.navigation.goBack()

  }

  readImageBlob(doc) {

    if (this.state.isNewImage) {

      RNFB.fs.readFile(this.state.imageAttachment, 'base64')
        .then( data => {
          this.save(doc, data)
        })
        .catch( err => {
          this.setState({debug: "File error: " + err.message})
          throw err
        })
    } else {
      this.save(doc, null)
    }

  }

  toggleEdit() {

    this.setState({editingText: !this.state.editingText})
    this.refs.TextEdit.focus()

  }

  toggleCamera() {

    this.setState({cameraActive: !this.state.cameraActive})

  }

  capture() {

    if (this.camera) {
      this.camera.capture()
        .then( data  => {
          this.setState({debug: data.path})
          this.setState({isNewImage: true, imageAttachment: data.path})
          this.toggleCamera()
        })
        .catch(err => {
          this.setState({debug: err})
        })
    }

  }

  getSource() {

    let src = this.state.imageAttachment
    if (!this.state.isNewImage && this.state.imageAttachment) {
      //We haven't taken a new photo
      //and there is one already in the database
      src = "data:image/png;base64," + this.state.imageAttachment
    }
    return src

  }

  renderCameraOff() {

    return (
      <TouchableOpacity onPress={this.toggleCamera.bind(this)}>
        <Image
          style={this.state.imageAttachment ? {height: 450, width: 450} : {flex: 0}}
          source={
            this.state.imageAttachment ? {uri: this.getSource()} : blank
          }
        />
      </TouchableOpacity>
    )

  }

  renderCameraOn() {

    return (
      <Camera
        ref={ cam => {
          this.camera = cam
        }}
        style={styles.cameraPreview}
        aspect="fill"
        defaultTouchToFocus>

        <TouchableOpacity
          style={styles.captureBtn}
          onPress={this.capture.bind(this)}>
          <Image
            source={require('../img/ic_camera_white_48dp.png')}
          />
        </TouchableOpacity>
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
            defaultValue={this.state.text}
            editable={this.state.editingText}
            onChangeText={(text) => this.setState({text})}
          />
          <View style={styles.buttonArea}>
            <TouchableOpacity style={styles.saveBtn}
              onPress={this.readImageBlob.bind(this, params.doc)}>
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
    justifyContent: 'flex-end'
  },
  debug: {
    flex: 1,
    fontSize: 14,
    color: 'yellow',
    alignItems: 'center',
    zIndex: 10
  },
  captureBtn: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeBtn: {
    backgroundColor: "#888",
    height: "10%",
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
})

