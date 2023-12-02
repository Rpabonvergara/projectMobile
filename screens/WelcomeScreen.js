import React, { useState, useEffect, useLayoutEffect } from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Animated, Easing, Alert, Platform } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import CustomHeaderButton from '../components/CustomHeaderButton';
import { styles } from '../styles/styles';

const WelcomeScreen = (props) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [logoOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    animateLogo();
  }, []);

  const animateLogo = () => {
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const loginWithFirebase = () => {
    if (loginEmail.length < 4 || loginPassword.length < 4) {
      Alert.alert('Please enter valid credentials.');
      return;
    }

    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      .then((_firebaseUser) => {
        props.navigation.navigate('ScreenTwo');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === 'auth/wrong-password') {
          Alert.alert('Wrong password.');
        } else {
          Alert.alert(errorMessage);
        }
      });
  };

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="Screen 2"
            iconName={Platform.OS === 'android' ? 'md-add' : 'ios-add'}
            onPress={() => props.navigation.navigate('ScreenThree')}
          />
        </HeaderButtons>
      ),
    });
  }, [props.navigation]);

  return (
    <View style={styleWelcomes.container}>
      <Animated.View style={{ opacity: logoOpacity, marginBottom: 20, flexDirection: 'row' }}>
        <View style={styleWelcomes.iconContainer}>
          <MaterialIcons name="headset" size={80} color="#333" style={styleWelcomes.icon} />
          <Text style={styleWelcomes.iconText}>Audio</Text>
        </View>
        <View style={styleWelcomes.iconContainer}>
          <Ionicons name="md-image" size={80} color="#333" style={styleWelcomes.icon} />
          <Text style={styleWelcomes.iconText}>Image</Text>
        </View>
      </Animated.View>
      <Text style={styles.label}>Sign In And Share</Text>
      <TextInput
        style={styleWelcomes.textInput}
        onChangeText={(value) => setLoginEmail(value)}
        autoCapitalize="none"
        autoCorrect={false}
        autoCompleteType="email"
        keyboardType="email-address"
        placeholder="Email"
      />
      <TextInput
        style={styleWelcomes.textInput}
        onChangeText={(value) => setLoginPassword(value)}
        autoCapitalize="none"
        autoCorrect={false}
        autoCompleteType="password"
        keyboardType="default"
        placeholder="Password"
        secureTextEntry={true}
      />
      <View style={styleWelcomes.buttonContainer}>
        <TouchableOpacity style={styleWelcomes.loginButton} onPress={loginWithFirebase}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styleWelcomes.registerButton} onPress={() => props.navigation.navigate('ScreenThree')}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styleWelcomes = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginBottom: 10,
  },
  iconText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    flex: 1, // Equal flex to distribute space evenly
    marginRight: 5, // Add some margin between buttons
  },
  registerButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    flex: 1, // Equal flex to distribute space evenly
    marginLeft: 8, // Add some margin between buttons
  },
  buttonText: {
    color: 'blue',
    fontWeight: 'bold',
  },
});
