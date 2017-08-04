import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import PouchDB from 'pouchdb-react-native';

const localDB = new PouchDB('localEntries');

export default class RememberThis extends Component {

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

    render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

