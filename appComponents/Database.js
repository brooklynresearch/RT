import PouchDB from 'pouchdb-react-native'

export default class Database {

  constructor() {
    this.localDB
    this.remoteDB
    this.changeHandler
    this.syncHandler
  }

  //Connect to local database on device
  //Calls updateFn on db change event
  //and errorFn on db error event
  connect(dbName, updateFn, errorFn) {
    this.localDB = new PouchDB('localEntries')
    this.changeHandler = this.localDB.changes({
      since: 'now',
      live: true,
      include_docs: true,
      attachments: true
    }).on('change', () => {
      updateFn()
    }).on('complete', (info) => {
      //has disconnected
    }).on('error', (err) => {
      errorFn(err)
    })
  }

  //Start sync with remote database on server
  startSync(addr, updateFn, errorFn) {
    this.remoteDB = new PouchDB(addr)
    this.syncHandler = this.localDB.sync(this.remoteDB, {
      live: true,
      retry: true,
      attachments: true
    }).on('change', (info) => {
      updateFn(info)
    }).on('error', (err) => {
      errorFn(err)
    })
  }

  all() {
    return new Promise((resolve, reject) => {
      this.localDB.allDocs({
        include_docs: true,
        attachments: true,
        descending: true
      }).then(results => {
        resolve(results)
      }).catch(err => {
        reject(err)
      })
    })
  }

  create(doc) {
    return new Promise((resolve, reject) => {
      this.localDB.put(doc).then(response => {
        resolve(response)
      }).catch(err => {
        reject(err)
      })
    })
  }

  deleteDoc(doc) {
    return new Promise((resolve, reject) => {
      this.localDB.remove(doc)
        .then(response => {
          if (response.ok === true) {
            resolve(response)
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  //Helper function called before trying to
  //create or update an entry
  buildDoc(oldDoc, newText, blob, type) {
    let doc = {}

    if (oldDoc === null) { //It's new
      doc = {
        _id: Date.now().toString(),
        body: newText
      }
    } else {
      doc = {
        _id: oldDoc._id,
        _rev: oldDoc._rev,
        body: newText,
      }
    }
    if (blob !== null) {
      doc._attachments = {
        'image': {
          content_type: type,
          data: blob
        }
      }
    } 
    return doc
  }

  close() {
    this.changeHandler.cancel()
    this.syncHandler.cancel()
    this.localDB.close()
    this.remoteDB.close()
  }
}
