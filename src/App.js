import React, { Component } from 'react';
import { View, Text } from 'react-native';
import firebase from 'firebase';
class App extends Component {

  state = { username: 'empty'};

  componentWillMount() {
    firebase.initializeApp({
      apiKey: "AIzaSyA_jrPdLZQ3R3y6Oqu9ouYZh9NoHjSoC3o",
      authDomain: "devent-7da1c.firebaseapp.com",
      databaseURL: "https://devent-7da1c.firebaseio.com",
      storageBucket: "devent-7da1c.appspot.com",
      messagingSenderId: "870675382955"
    });

    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        this.setState({ username: user.email });
      }
    })
  }

  render() {
    return (
      <View>
        <Text>{this.state.username}</Text>
      </View>
    );
  }
}

export default App;
