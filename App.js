import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  FlatList,
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
            docs: [],
            debug: ""
        }
    }

    componentDidMount() {
        localDB.allDocs({include_docs: true})
          .then(results => {
            this.setState({
                docs: results.rows
            });
          }).catch(err => console.log.bind(console, '[Fetch all]'));

        localDB.changes({
            live: true,
            include_docs: true
        }).on('change', this.setState.bind(this, {debug: "Local Database Change"}))
          .on('complete', console.log.bind(console, '[Change:Complete]'))
          .on('error', console.log.bind(console, '[Change:Error]'))
    }

    addItem() {
        console.log("[+} Adding item to local db")

        let t = Date.now()
        let b = this.state.text
        localDB.put({_id: t, body: b})
           .catch(this.setState.bind(this, {debug: '[!]Error inserting '}));

        this.setState({text: ""})
    }

    render() {
        return (

          <View style={styles.mainContainer}>

              <View style={styles.listContainer}>
                <Text style={styles.debug}>{this.state.debug}</Text>
                <FlatList
                    data={this.state.docs}
                    renderItem={
                        ({item}) => <Text style={styles.item}>{item.body}</Text>
                    }
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.textEntryContainer}>
                    <TextInput
                        style={styles.rememberText}
                        value={this.state.text}
                        onChangeText={(text) => this.setState({text})}
                    />
                </View>

                <TouchableOpacity onPress={this.addItem.bind(this)}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>
                            Remember This
                        </Text>
                    </View>
                </TouchableOpacity>
              </View>
          </View>

        );
    }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#000'
  },
  debug: {
    fontSize: 16,
    color: "green",
    textAlign: 'left'
  },
  listContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#000'
  },
  item: {
      fontSize: 16,
      color: "#fff",
      height: 20,
      textAlign: 'left'
  },
  rememberText: {
    color: "#000",
    height: 40,
    borderColor: 'gray',
    borderWidth: 2,
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  inputContainer: {
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
  buttonText: {
    fontSize: 40,
    textAlign: 'center',
    color: '#fff',
  },
});

