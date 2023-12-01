import React, { useState } from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../components/CustomHeaderButton';

import { View, TextInput, Text, Button, Alert } from 'react-native';

import {db, firestore, auth} from '../firebaseConfig';
import {createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {ref, set, get, onValue} from 'firebase/database';
import {doc, setDoc, getDoc, onSnapshot} from 'firebase/firestore';

import { styles } from '../styles/styles';


const WelcomeScreen = (props) => {

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item 
                title="Screen 2" 
                iconName={Platform.OS === 'android' ? 'md-add' : 'ios-add'} 
                onPress={() => props.navigation.navigate('ScreenThree') }
            />
        </HeaderButtons>
      ),
    });
  }, []);

  [loginEmail, setLoginEmail] = useState('');
  [loginPassword, setLoginPassword] = useState('');
  [loggedIn, setLoggedIn] = useState(false);
    
    loginWithFirebase = () => {
        if (loginEmail.length < 4) {
          Alert.alert('Please enter an email address.');
          return;
        }
    
        if (loginPassword.length < 4) {
          Alert.alert('Please enter a valid password.');
          return;
        }
    
        signInWithEmailAndPassword(auth, loginEmail, loginPassword)
          .then(function (_firebaseUser) {
            props.navigation.navigate('ScreenTwo');            
           // Alert.alert('user logged in!');
            setLoggedIn(true);
          })
          .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
    
            if (errorCode === 'auth/wrong-password') {
              Alert.alert('Wrong password.');
            }
            else {
              Alert.alert(errorMessage);
            }
          }
          );
      }



    return (
        <View style={styles.container}>
        
        <Text style={styles.label}>Sign In And Share</Text>
            <TextInput
            style={styles.textInput}
            onChangeText={ (value) => setLoginEmail(value) }
            autoCapitalize="none"
            autoCorrect={false}
            autoCompleteType="email"
            keyboardType="email-address"
            placeholder="email"
            />
            <TextInput
            style={styles.textInput}
            onChangeText={ (value) => setLoginPassword(value) }
            autoCapitalize="none"
            autoCorrect={false}
            autoCompleteType="password"
            keyboardType="default"
            placeholder="password"
            secureTextEntry = {true}
            />
        <View style={styles.buttonContainerWelcome}>  
          <Button style={styles.button} title="Login" onPress={loginWithFirebase} />
          <Button style={styles.button} title="Register" onPress={()=>props.navigation.navigate('ScreenThree')}/>
        </View> 
      </View>
    );
}

export default WelcomeScreen;