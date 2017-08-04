import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import PouchDB from 'pouchdb-react-native';

const localDB = new PouchDB('localEntries');

export default class RememberThis extends Component {

    constructor(props) {
        super(props)
        this.state = {
            text: "",
            docs: []
        }
    }

    componentDidMount() {
        localDB.allDocs({include_docs: true})
          .then(results => {
            this.setState({
                docs: results.rows.map(row => row.doc)
            });
          }).catch(err => console.log.bind(console, '[Fetch all]'));

        localDB.changes({
            live: true,
            include_docs: true
        }).on('change', console.log.bind(console, "Local Database Change"))
          .on('complete', console.log.bind(console, '[Change:Complete]'))
          .on('error', console.log.bind(console, '[Change:Error]'))
    }

    addItem() {
        console.log("[+} Adding item to local db")
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

            <TouchableOpacity onPress={this.addItem.bind(this)}>
                <View style={styles.button}>
                    <Text style={styles.instructions}>
                        Remember This
                    </Text>
                </View>
            </TouchableOpacity>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  rememberText: {
    color: "#000",
    height: 40,
    borderColor: 'gray',
    borderWidth: 2,
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  textEntryContainer: {
    width: "100%",
    backgroundColor: "#fff",
    bottom: "2%"
  },
  button: {
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "blue"
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    bottom: 10
  },
  instructions: {
    fontSize: 40,
    textAlign: 'center',
    color: '#fff',
  }
});

