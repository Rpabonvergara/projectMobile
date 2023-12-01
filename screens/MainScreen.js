import React, { useState, useEffect } from 'react';
import { View, Button, Alert, TouchableOpacity, Text } from 'react-native';
import { firestore, auth } from '../firebaseConfig';
import { onSnapshot, doc } from 'firebase/firestore';
import { sendEmailVerification } from 'firebase/auth';

import CustomHeaderButton from '../components/CustomHeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { styles } from '../styles/styles';

const MainScreen = (props) => {

    React.useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item
                        title="Screen Four"
                        iconName={Platform.OS === 'android' ? 'md-add' : 'ios-add'}
                        onPress={() => props.navigation.navigate('ScreenFour')}
                    />
                    <Item
                        title="Screen Five"
                        iconName={Platform.OS === 'android' ? 'md-add' : 'ios-add'}
                        onPress={() => props.navigation.navigate('ScreenFive')}
                    />
                </HeaderButtons>
            ),
        });
    }, []);

    const [emailVerified, setEmailVerified] = useState(false);

    const retrieveDataWithFirebase = () => {
        var userID = auth.currentUser.uid;
        onSnapshot(doc(firestore, '/users/' + userID), (snapshot) => {
            if (snapshot.exists()) {
                const firstName = snapshot.data().FirstName;
                Alert.alert(`Welcome,\n${firstName}`);
                setEmailVerified(auth.currentUser.emailVerified);
            }
        });
    };

    const sendVerificationEmail = () => {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                Alert.alert('Verification email sent successfully!');
            })
            .catch((error) => {
                Alert.alert('Error sending verification email', error.message);
            });
    };

    useEffect(() => {
        retrieveDataWithFirebase();
    }, []);

    let button;

    if (emailVerified) {
        button = <Button style={styles.headerText} title="Email Verified" disabled />
    }
    else {
        button = <Button style={styles.headerText} title="Send Verification Email" onPress={sendVerificationEmail} />
    }


    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => props.navigation.navigate('ScreenFour')} style={styles.button}>
                <Text style={styles.buttonText}>Image Repository</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => props.navigation.navigate('ScreenFive')} style={styles.button}>
                <Text style={styles.buttonText}>Audio Repository</Text>
            </TouchableOpacity>
            {button}
        </View>



    );
};

export default MainScreen;
