import React, { Component } from 'react'

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

export default class NewEntryInput extends Component {

  constructor(props) {

    super(props)

    this.state = {
      text: ""
    }

  }

  _addItem() {

    this.props.onComplete(this.state.text)
    this.setState({text: ""})

  }

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.textEntryContainer}>
          <TextInput
            style={styles.rememberText}
            value={this.state.text}
            onChangeText={(text) => this.setState({text})}
          />
        </View>

        <TouchableOpacity onPress={this._addItem.bind(this)}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>
              Remember This
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )

  }
}

const styles = StyleSheet.create({
  rememberText: {
    color: "#000",
    borderColor: 'blue',
    lineHeight: 40,
    borderWidth: 2,
    fontSize: 20,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  textEntryContainer: {
    width: "100%",
    top: "5%",
    backgroundColor: "#fff",
    bottom: "2%"
  },
  button: {
    width: "100%",
    top: 10,
    borderColor: "blue",
    borderWidth: 2,
    bottom: "10%",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "blue"
  },
  buttonText: {
    fontSize: 40,
    textAlign: 'center',
    color: '#fff',
  }
})

