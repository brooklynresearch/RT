import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  ListView,
  TouchableOpacity,
  View
} from 'react-native';


export default class RememberList extends Component {
    constructor(props) {
        super(props)

        this.dataSource = new ListView.DataSource(
            {rowHasChanged: (r1, r2) => r1.id !== r2.id}
        );
    }

    _onDelete(row) {
        return () => this.props.onDelete(row)
    }

    renderRow(row) {
        return (
           <View style={styles.row}>
              <Text style={styles.entry}>{row.body}</Text>
              <TouchableOpacity onPress={this._onDelete(row)}>
                <View style={styles.deleteBtn}>
                    <Text style={styles.delete}>X</Text>
                </View>
              </TouchableOpacity>
          </View>
       )
    }

    render() {
       let ds = this.dataSource.cloneWithRows(this.props.docs);

        return (
          <View style={styles.listContainer}>
              <ListView
                  dataSource={ds}
                  renderRow={this.renderRow.bind(this)}
                  enableEmptySections={true}
                  style={styles.entryList}
              />
          </View>
        )
    }
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 3,
    justifyContent: 'flex-start',
  },
  entryList: {
    backgroundColor: '#000'
  },
  entry: {
      fontSize: 40,
      color: "#fff",
      height: 52,
      textAlign: 'left'
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
})

