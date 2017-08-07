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
            this.setState({debug: "Local Database Change"})
          })
          .on('complete', (info) => {
              //this.setState({debug: '[+] OK -- updated local db: ' + info})
          })
          .on('error', (err) => {
              this.setState({debug: '[!] Error updating local database: ' + err})
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

    addItem() {

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

    renderList() {

        return (
            <ListView
                dataSource={this.state.docs}
                renderRow={
                    (row) =>
                      <Text style={styles.item}>{row.body}</Text>
                }
                enableEmptySections={true}
                style={styles.itemlist}
            />
       )
    }

    render() {

        return (
          <View style={styles.mainContainer}>

              <View style={styles.listContainer}>
                <Text style={styles.debug}>{this.state.debug}</Text>
                {this.renderList()}
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
  listContainer: {
    flex: 3,
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

