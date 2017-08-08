import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  ListView,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import RememberList from './rememberList';
import NewEntryInput from './NewEntryInput';

import PouchDB from 'pouchdb-react-native';

const localDB = new PouchDB('localEntries');
const remoteDB = new PouchDB('http://192.168.0.174:5984/remember');

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});

export default class RememberThis extends Component {

    constructor(props) {
        super(props)

        this.state = {
            text: "",
            docs: ds,
            debug: ""
        }

        localDB.changes({
            since: 'now',
            live: true,
            include_docs: true
        }).on('change', () => {
            this.updateList()
            //this.setState({debug: "Local Database Change"})
          })
          .on('complete', (info) => {
              //disconnect
          })
          .on('error', (err) => {
              this.setState({debug: '[!] Error updating local database: ' + err})
          });

       localDB.sync(remoteDB, {
         live: true,
         retry: true
       }).on('change', (info) => {
           this.setState({debug: "[+] Remote database change: " + info.change.start_time})
       }).on('error', (err) => {
           this.setState({debug: "[!] Remote database error: " + err})
       });

      this.updateList();
    }

    updateList() {

         localDB.allDocs({include_docs: true, descending: true})
          .then(results => {
            let items = results.rows.map(row => row.doc)
            //this.setState({debug: '[+] Local db items: ' + items});
            this.setState({
                docs: ds.cloneWithRows(items)
            });
          }).catch(err => {
              this.setState({debug: '[!] Error in local database: ' + err})
          });
    }

    addItem(text) {

        let t = Date.now().toString()
        let b = text
        localDB.put({_id: t, body: b})
           .then( (response) => {
              this.setState({debug: '[+] OK -- added to local db: ' + response.id})
           })
           .catch( err => {
               this.setState({debug: '[!] Error inserting item: ' + err})
           });
    }

    deleteItem(row) {

        localDB.remove(row)
            .then( response => {
                if (response.ok === true) {
                    this.setState({debug: "[+] OK -- Deleted: " + row._id})
                }
            })
            .catch( err => {
                this.setState({debug: "[!] Error deleting item: " + err})
            });
    }

    render() {

        return (
          <View style={styles.mainContainer}>

              <Text style={styles.debug}>{this.state.debug}</Text>

              <RememberList
                  docs={this.state.docs}
                  onDelete={this.deleteItem.bind(this)}
              />

              <NewEntryInput
                  onComplete={this.addItem.bind(this)}
              />
          </View>
        )
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
});

