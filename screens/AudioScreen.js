// PictureScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import { auth, firestore } from '../firebaseConfig';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS, AudioRecordingOptions } from 'expo-av';

import { styles } from '../styles/styles';

const AudioScreen = () => {
  const [recordings, setRecordings] = useState([]);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const verifyPermissions = async () => {
    const result = await Audio.requestPermissionsAsync()
    return result.granted;
  };

  const startRecordingAudio = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }

    setIsRecording(true);

    try {
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      console.log('Recording started');
    } catch (error) {
      console.log('An error has occurred', error);
    }
  };

  const stopRecordingAudio = async () => {
    try {
      await recording.stopAndUnloadAsync();
      console.log('Recording stopped and saved at:', recording.getURI());

      // Guardar la grabación en Firebase
      const currentUser = auth.currentUser;
      const audioRef = await firestore.collection('audios').add({
        audioUrl: recording.getURI(),
        userId: currentUser.uid,
      });

      setRecordings((prevRecordings) => [
        ...prevRecordings,
        { id: audioRef.id, audioUrl: recording.getURI() },
      ]);
    } catch (error) {
      console.log('An error has occurred', error);
    }

    setIsRecording(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePlayAudio(item.audioUrl)}>
      <Text>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? stopRecordingAudio : startRecordingAudio}
      />
      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default AudioScreen;
