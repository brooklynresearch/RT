import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default class NewEntryInput extends Component {
    constructor(props) {
        super(props)

        this.state = {
            text: ""
        }
    }

    _addItem() {
        this.props.onSelect(this.state.text)
        this.setState({text: ""})
    }

    render() {
        return (
          <View style={styles.container}>

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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
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

