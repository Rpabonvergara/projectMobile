import React, { useState } from 'react';

import { View, TextInput, Text, Button, Alert, StyleSheet } from 'react-native';
import { db, firestore, auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {ref, set, get, onValue} from 'firebase/database';
import {doc, setDoc, getDoc, onSnapshot} from 'firebase/firestore';

import { styles } from '../styles/styles';

const RegistrationScreen = (props) => {

  [firstName, setFirstName] = useState('');
  [lastName, setLastName] = useState('');
  [email, setEmail] = useState('');
  [password, setPassword] = useState('');

  registerWithFirebase = () => {

    if (!firstName.trim()) {
      Alert.alert('Please enter your First Name.');
      return;
    }
    
    if (!lastName.trim()) {
      Alert.alert('Please enter your Last Name.');
      return;
    }

    if (email.length < 4) {
      Alert.alert('Please enter an email address.');
      return;
    }

    if (password.length < 4) {
      Alert.alert('Please enter a valid password (More than 3 Characters) ');
      return;
    }


    createUserWithEmailAndPassword(auth, email, password,)
      .then(function (_firebaseUser) {       
        setTimeout(saveUserWithFirebase, 400);
      })
      .catch(function (error) {
        console.log(email);
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode == 'auth/weak-password') {
          Alert.alert('The password is too weak.');
        }
        else {
          Alert.alert(errorMessage);
        }
        console.log(error);
      }
      );
  }

  saveUserWithFirebase = () =>
  {
    var userID = auth.currentUser.uid;

     // SAVE USER TO FIRESTORE

    setDoc(doc(firestore, 'users/' + userID),{
      FirstName : firstName,
      LastName : lastName,
      Email : email
    },
    {
      merge : true
    })
    .then(()=>{
      Alert.alert('User Succesfully Saved')
      props.navigation.navigate('ScreenOne'); 
    })
    .catch(()=>{
      Alert.alert('Error Saving User');
      console.log(error)
    })
  }

    return (
      <View style={styles.container}>
            <Text style={styles.label}>Complete the form</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(value) => setFirstName(value)}
              placeholder="First Name"
            />
            <TextInput
              style={styles.textInput}
              onChangeText={(value) => setLastName(value)}
              placeholder="Last Name"
            />
            <TextInput
              style={styles.textInput}
              onChangeText={ (value) => setEmail(value) }
              autoCapitalize="none"
              autoCorrect = {false}
              autoCompleteType="email"
              keyboardType="email-address"
              placeholder="email"
            />
            <TextInput
              style={styles.textInput}
              onChangeText={(value) => setPassword(value)}
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType="password"
              keyboardType="default"
              placeholder="Password"
              secureTextEntry={true}
            />
              <View style={styles.buttonContainer}>
                <Button style={styles.button} title="Register" onPress={registerWithFirebase} />
              </View>
          </View>
    );
}


export default RegistrationScreen;