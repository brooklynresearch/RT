import React, { Component } from 'react'

import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native'

import { StackNavigator } from 'react-navigation'

import RememberList from './appComponents/RememberList'
import NewEntryInput from './appComponents/NewEntryInput'
import UpdateEntryScreen from './appComponents/UpdateEntryScreen'

import PouchDB from 'pouchdb-react-native'

const localDB = new PouchDB('localEntries')
const remoteDB = new PouchDB('http://192.168.0.114:5984/remember')

class Homescreen extends Component {

  static navigationOptions() {
    return {header: null}
  }

  constructor(props) {

    super(props)

    this.state = {
      text: "",
      docs: [],
      debug: ""
    }

    localDB.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', () => {
      this.updateList()
      //this.setState({debug: "Local Database Change"})
    }).on('complete', (info) => {
      //disconnect
    }).on('error', (err) => {
      this.setState({debug: '[!] Error updating local database: ' + err})
    })

    localDB.sync(remoteDB, {
      live: true,
      retry: true
    }).on('change', (info) => {
      this.setState({debug: "[+] Remote database change: " + info.change.start_time})
    }).on('error', (err) => {
      this.setState({debug: "[!] Remote database error: " + err})
    })

    this.updateList()

  }

  updateList() {

    localDB.allDocs({include_docs: true, attachments: true, descending: true})
      .then(results => {
        //this.setState({debug: '[+] Local db items: ' + items});
        this.setState({
          docs: results.rows.map(row => row.doc)
        })
      })
      .catch(err => {
        this.setState({debug: '[!] Error in local database: ' + err})
        throw err
      })

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
      })
  }

  updateItem(doc, newText, blob) {

    let entry = {}

    if (doc === null) { //It's new
      entry = {
        _id: Date.now().toString(),
        body: newText
      }
    } else {
      entry = {
        _id: doc._id,
        _rev: doc._rev,
        body: newText,
      }
    }
    if (blob !== null) {
      entry._attachments = {
        'image': {
          content_type: "image/png",
          data: blob
        }
      }
    }

    localDB.put(entry).then( response => {
      this.setState({debug: '[+] OK -- updated item in db: ' + response.id})
    }).catch( err => {
      this.setState({debug: '[!] Error updating item: ' + err})
    })

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
      })

  }

  selectItem(row) {

    let {navigate} = this.props.navigation
    navigate('Update', {
      doc: row,
      updateFn: this.updateItem.bind(this)
    })

  }

  render() {

    return (
      <View style={styles.mainContainer}>

        <Text style={styles.debug}>{this.state.debug}</Text>

        <RememberList
          docs={this.state.docs}
          onSelect={this.selectItem.bind(this)}
          onDelete={this.deleteItem.bind(this)}
        />

        <NewEntryInput
          onSelect={this.selectItem.bind(this, null)}
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
})

const RememberApp = StackNavigator({
  Home: {screen: Homescreen},
  Update: {screen: UpdateEntryScreen}
})

AppRegistry.registerComponent('rememberThis', () => RememberApp)

