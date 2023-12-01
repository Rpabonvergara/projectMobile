import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Button, Alert } from 'react-native';
import { firestore, auth } from '../firebaseConfig';
import { onSnapshot, collection, deleteDoc, addDoc, doc, where, query } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import * as MailComposer from 'expo-mail-composer';

import { styles } from '../styles/styles';

const PictureScreen = () => {
    const [images, setImages] = useState([]);
    const currentUser = auth.currentUser;


    const verifyPermissions = async() => {
        const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
        const libraryResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(cameraResult.status !== 'granted' && libraryResult.status!=='granted'){
            Alert.alert('Grant Permissions firt to use the app', [{text : 'OK'}]);
            return false;
        }
        else{
            return true;
        }
    }


    useEffect(() => {
        if (!currentUser) {
            return;
        }

        const unsubscribe = onSnapshot(
            query(collection(firestore, 'images'), where('userId', '==', currentUser.uid)),
            (snapshot) => {
                const imagesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                console.log(imagesData);
                setImages(imagesData);
            }
        );

        return () => unsubscribe();
    }, [currentUser]);

    const handleDeleteImage = async (id) => {
        try {
            await deleteDoc(doc(firestore, 'images', id));
            // Actualiza el estado después de eliminar la imagen
            setImages((prevImages) => prevImages.filter((image) => image.id !== id));
        } catch (error) {
            console.error('Error deleting image', error);
            Alert.alert('Error', 'Failed to delete image');
        }
    };

    const handlePickImage = async () => {
        const hasPermission = await verifyPermissions();

        if (hasPermission) {
            try {
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    quality: 0.5,
                });

                if (!result.canceled) {
                    const imageRef = await addDoc(collection(firestore, 'images'), {
                        imageUrl: result.assets[0].uri,
                        userId: currentUser.uid,
                    });
                    setImages((prevImages) => [...prevImages, { id: imageRef.id, imageUrl: result.assets[0].uri }]);
                }
            } catch (error) {
                console.error('Error picking image', error);
                Alert.alert('Error', 'Failed to pick image');
            }
        }
    };

    const handleTakePicture = async () => {
        const hasPermission = await verifyPermissions();

        if (hasPermission) {
            try {
                const result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    quality: 0.5,
                });

                if (!result.canceled) {
                    const imageRef = await addDoc(collection(firestore, 'images'), {
                        imageUrl: result.assets[0].uri,
                        userId: currentUser.uid,
                    });
                    setImages((prevImages) => [...prevImages, { id: imageRef.id, imageUrl: result.assets[0].uri }]);
                }
            } catch (error) {
                console.error('Error taking picture', error);
                Alert.alert('Error', 'Failed to take picture');
            }
        }
    };

    const sendMessageWithMail = async (imageUrl) => {
        const isAvailable = await MailComposer.isAvailableAsync();
      
        if (isAvailable) {
          var options = {
            subject: 'Check out this image!',
            body: `I wanted to share this image with you.`,
            attachments: [imageUrl],
          };
      
          MailComposer.composeAsync(options)
            .then((result) => {
              console.log(result.status);
              // Mostrar alerta de confirmación después de enviar el correo electrónico
              Alert.alert('Email Sent', 'The Image has been sent successfully.');
            })
            .catch((error) => {
              console.error('Error sending email', error);
              Alert.alert('Error', 'Failed to send email');
            });
        } else {
          Alert.alert('Email is not available');
        }
      };

    const handleImageOptions = (id, imageUrl) => {
        Alert.alert(
          'Confirmation',
          'What do you plan to do with the image?',
          [
            {
                text: 'Share Via Email',
                  onPress: async () => {
                  sendMessageWithMail(imageUrl);                              
                },
            },

            {
              text: 'Delete',
                onPress: async () => {
                handleDeleteImage(id);
                Alert.alert('Image Delete', 'Image Deleted successfully!');
              },
            },

            {
                text: 'Cancel',
                style: 'cancel',
              },
          ],
          { cancelable: false }
        );
      };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleImageOptions(item.id, item.imageUrl)}>
            <Image source={{ uri: item.imageUrl }} style={{ width: 150, height: 150, margin: 5 }} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePickImage} style={styles.button}>
                <Text style={styles.buttonText}>Pick Image</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleTakePicture} style={styles.button}>
                <Text style={styles.buttonText}>Take Picture</Text>
            </TouchableOpacity>
            {images.length === 0 ? (
                <Text>No images available.</Text>
            ) : (
                <FlatList
                    data={images}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    numColumns={2}
                />
            )}
        </View>
    );
};

export default PictureScreen;