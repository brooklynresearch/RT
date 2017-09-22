import React, { Component } from 'react'

import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native'

import { StackNavigator } from 'react-navigation'

//Our modules
import RememberList from './appComponents/RememberList'
import NewEntryInput from './appComponents/NewEntryInput'
import UpdateEntryScreen from './appComponents/UpdateEntryScreen'
import Database from './appComponents/Database'

const SYNC_URL = 'http://192.168.0.114:5984/remember'

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

    //Function to be called whenever the local
    //database reports a change
    let updateFn = this.updateList.bind(this)

    Database.connect(updateFn).then(() => {
      this.updateList()
      Database.startSync(SYNC_URL)
    }).catch(err => {
      this.setState({debug: '[!] Error reading local database: ' + err})
    })

  }

  componentWillUnmount() {
    //Cancel listeners to prevent mem leaks.
    //I do not know if this is necessary,
    //I was getting warnings about too many listeners

    Database.close()
  }

  updateList() {

    Database.all().then(results => {
      this.setState({
        docs: results.rows.map(row => row.doc)
      })
    }).catch(err => {
      this.setState({debug: '[!] Error in local database: ' + err})
    })
  }

  updateItem(doc, newText, blob, type) {

    let newDoc = Database.buildDoc(doc, newText, blob, type)

    Database.update(newDoc).then(response => {
      this.setState({debug: '[+] OK -- updated item in db: ' + response.id})
    }).catch( err => {
      this.setState({debug: '[!] Error updating item: ' + err})
    })
  }

  deleteItem(row) {

    Database.delete(row).then(response => {
      this.setState({debug: "[+] OK -- Deleted: " + row._id})
    }).catch(err => {
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

