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
            //this.setState({debug: "Local Database Change"})
          })
          .on('complete', (info) => {
              //disconnect
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

    renderList() {

        return (
            <ListView
                dataSource={this.state.docs}
                renderRow={
                    (row) =>
                      <View style={styles.row}>
                      <Text style={styles.item}>{row.body}</Text>
                          <TouchableOpacity onPress={this.deleteItem.bind(this, row)}>
                            <View style={styles.deleteBtn}>
                                <Text style={styles.delete}>X</Text>
                            </View>
                          </TouchableOpacity>
                      </View>
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
      fontSize: 40,
      color: "#fff",
      height: 52,
      textAlign: 'left'
  },
  rememberText: {
    color: "#000",
    borderColor: 'blue',
    lineHeight: 40,
    borderWidth: 2,
    fontSize: 20,
    textAlign: 'center',
  },
  inputContainer: {
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  deleteBtn: {
    backgroundColor: "white",
    justifyContent: 'center'
  },
  delete: {
    color: "red",
    fontSize: 40,
  }
});

