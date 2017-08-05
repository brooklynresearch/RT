import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  ListView,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import PouchDB from 'pouchdb-react-native';

const localDB = new PouchDB('localEntries');

export default class RememberThis extends Component {

    constructor(props) {
        super(props)

        const ds = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });

        this.state = {
            text: "",
            docs: [],
            debug: ""
        }

        localDB.allDocs({include_docs: true})
          .then(results => {
            //this.setState({debug: '[+] Local db items: ' + results.rows});
            this.setState({
                docs: ds.cloneWithRows(JSON.parse(results.rows))
            });
          }).catch(err => {
              this.setState({debug: '[!] Error in local database: ' + err})
          });

        localDB.changes({
            live: true,
            include_docs: true
        }).on('change', (change) => {
            //this.setState({debug: "Local Database Change: " + change})
          })
          .on('complete', (info) => {
              //this.setState({debug: '[+] OK -- updated local db: ' + info})
          })
          .on('error', (err) => {
              this.setState({debug: '[!] Error updating local database: ' + err})
          });
    }

    addItem() {
        console.log("[+} Adding item to local db")

        let t = Date.now().toString()
        let b = this.state.text
        localDB.put({_id: t, body: b})
           .then( (response) => {
              this.setState({debug: '[+] OK -- added to local db: ' + response.id})
           })
           .catch( err => {
               this.setState({debug: '[!] Error inserting item: ' + err})
           });

        this.setState({text: ""})
    }

    render() {

        return (

          <View style={styles.mainContainer}>

              <View style={styles.listContainer}>
                <Text style={styles.debug}>{this.state.debug}</Text>
                <ListView
                    dataSource={this.state.docs}
                    renderRow={
                        ({row}) => <Text style={styles.item}>{row}</Text>
                    }
                    style={styles.itemlist}
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
  },
  itemlist: {
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

