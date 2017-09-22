# RememberThis
Proof of concept

## Installation

### Requirements
1. [Nodejs and npm](https://nodejs.org/en/download/)

2. React native CLI:

  ```bash
  $ npm install -g react-native-cli
  ```

3. Extra npm packages

   After cloning the repo, change to the RememberThis directory and run
   ```bash
   $ npm install
   ```

4. For syncing data, you will need to have a server running [CouchDB](http://docs.couchdb.org/en/latest/install/index.html)

## Running on Device or Emulator

[Follow directions for your OS and target device](https://facebook.github.io/react-native/docs/getting-started.html "Official Docs")

## Usage
The app has two main screens: the Home screen, which displays the list of local
database contents, and the Update screen, which allows you to create and edit
items in the database.
On first run, there will be no database items so the Home screen will be mostly empty.
Pressing the 'Remember This' button on the bottom takes you to the Update screen
where you can enter a title and add a photo or video (only one media item can be added
for now.) To start adding a title, press the little lock icon on the right side of the screen.
This screen doubles as the detail view for saved items which is why editing takes another
button press.
Now press the camera icon in the middle of the screen to take a photo.
Press the shutter icon to take a photo or the video icon to start filming.
Once you have a taken either a photo or video, you will see it embedded in
the main body area of the screen. If you want to change it, just tap the middle of the
image area to start over. If you press the image and decide not to change anything, you
can press the grey 'X' button in the top corner of the camera area to keep the previous
photo/video.
Once you have created an item to save in the database, press the save icon in the top
right, above the title text area. On pressing the save button, you will return back to the
Home screen and you will see your new entry as the first item in the list along with some
debugging text at the top.
If you press on the title text, you will be taken back to the Update screen and will
see the attached media file displayed.
Finally, on the right side of the Home screen list, next to each item text is a red 'X' button
which will delete the item from the database.

For synchronization, you will need to update the variable SYNC_URL in App.js
to match the IP address of the machine running CouchDB.

If everything is set up correctly, synchronization with the CouchDB server will
happen automatically.

## Development

### Working with React

### Project Files
  1. App.js
    * Implementation for the Home screen
    * On startup, starts connections to local database and remote sync database
    * Uses Database module to interact with the local database
    * Declares the list of navigation screens (just 'Home' and 'Update' so far)

  2. appComponents/Database.js
    * Exports utility class with wrapper methods for PouchDB access
    * Used in App.js

  3. appComponents/RememberList.js
    * React component class that renders the list of database items
    * Used in App.js

  4. appComponents/NewEntryButton.js
    * React component class that renders the button at the bottom of the Home screen
    * Used in App.js

  5. appComponents/UpdateEntryScreen.js
    * Implementation for the Update screen
    * Camera and filesystem access for media files

## Issues
  * Video file synchronization. Video files save locally on device with no issue, but
    do not sync with the remote.
