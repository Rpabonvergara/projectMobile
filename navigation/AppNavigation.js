import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import RegistrationScreen from '../screens/RegistrationScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import MainScreen from '../screens/MainScreen';
import PictureScreen from '../screens/PictureScreen';
import AudioScreen from '../screens/AudioScreen';


const Stack = createNativeStackNavigator();

function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                headerMode="screen"
                screenOptions={{
                    headerTintColor: Platform.OS === 'android' ? 'white' : 'blue',
                    headerStyle: {
                        backgroundColor: Platform.OS === 'android' ? 'gray' : ''
                    }
                }}
            >
                <Stack.Screen
                    name="ScreenOne"
                    component={WelcomeScreen}
                    options={{
                        title: 'Share it!',                        
                    }}
                />
                <Stack.Screen
                    name="ScreenTwo"
                    component={MainScreen}
                    options={{
                        title: 'User Profile',
                    }}
                />
                <Stack.Screen
                    name="ScreenThree"
                    component={RegistrationScreen}
                    options={{
                        title: 'Registration Page',
                    }}
                />
                <Stack.Screen
                    name="ScreenFour"
                    component={PictureScreen}
                    options={{
                        title: 'Picture Repository',
                    }}
                />
                <Stack.Screen
                    name="ScreenFive"
                    component={AudioScreen}
                    options={{
                        title: 'Audio Repository',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;