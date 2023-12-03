import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, Alert } from 'react-native';
import Progress from 'react-native-progress/Bar';
import { auth, firestore } from '../firebaseConfig';
import { onSnapshot, collection, deleteDoc, addDoc, doc, where, query } from 'firebase/firestore';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import * as MailComposer from 'expo-mail-composer';
import { FontAwesome5 } from '@expo/vector-icons';

const AudioScreen = () => {

  const currentUser = auth.currentUser;
  const [recordings, setRecordings] = useState([]);
  const [recording, setRecording] = useState(null);
  const [soundObject, setSoundObject] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [stopRecord, setStopRecord] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [showRecordedAudio, setShowRecordedAudio] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
      if (!currentUser) {
        return;
      }

      const unsubscribe = onSnapshot(
        query(collection(firestore, 'audios'), where('userId', '==', currentUser.uid)),
        (snapshot) => {
          const recordingsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setRecordings(recordingsData);
        }
      );

      return () => unsubscribe();
    }, [currentUser]);

  const verifyPermissions = async () => {
    const result = await Audio.requestPermissionsAsync();
    return result.granted;
  };

  const startRecordingAudio = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }

    setIsRecording(true);
    setIsPlaying(false);

    await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            interruptionModeIOS: InterruptionModeIOS.DoNotMix,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
            playThroughEarpieceAndroid: false,
            staysActiveInBackground: true,
          });

    try {
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      newRecording.startAsync();
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
    } catch (error) {
      console.log('An error has occurred', error);
    }

    setIsRecording(false);
    setStopRecord(true);
  };

  const playRecordedAudio = async (audioUrl) => {
    setIsPlaying(true);
    setIsPaused(false);

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });

    try {
      const newSoundObject = new Audio.Sound();
      await newSoundObject.loadAsync({ uri: audioUrl });
      setSoundObject(newSoundObject);

      newSoundObject.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          const durationMillis = status.durationMillis || 0;
          const positionMillis = status.positionMillis || 0;
          setProgress(positionMillis / durationMillis);
          setCurrentTime(positionMillis / 1000);
          setTotalDuration(durationMillis / 1000);

          if (status.didJustFinish) {
            stopPlayingRecordedAudio();
          }
        }
      });

      await newSoundObject.playAsync();
      console.log('Playing started');
    } catch (error) {
      console.log('An error has occurred', error);
    }
  };

  const pausePlayingRecordedAudio = async () => {
    if (soundObject && !isPaused) {
      await soundObject.pauseAsync();
      setIsPaused(true);
      setIsPlaying(true);
      console.log('Playing paused');
    }
  };

  const resumePlayingRecordedAudio = async () => {
    if (soundObject && isPaused) {
      await soundObject.playAsync();
      setIsPaused(false);
      setIsPlaying(true);
      console.log('Playing resumed');
    }
  };

  const stopPlayingRecordedAudio = async () => {
    try {
      await recording.stopAndUnloadAsync();
      console.log('Recording stopped and saved at:', recording.getURI());
    } catch (error) {
      console.log('An error has occurred', error);
    }

    setIsPlaying(true);
    setIsPaused(false);

    setShowRecordedAudio(false);
    setStopRecord(false);
    setProgress(0);
  };

  const uploadAudioToFirebase = async () => {
    try {
      const currentUser = auth.currentUser;
      const audioRef = await addDoc(collection(firestore, 'audios'), {
        audioUrl: recording.getURI(),
        userId: currentUser.uid,
      });

      console.log('Recording uploaded to Firebase');
      setUploadError(null); // Clear any previous upload error
    } catch (error) {
      setUploadError('Error uploading audio to Firebase');
      console.log('An error occurred during upload', error);
    }
    setShowRecordedAudio(false);
    setStopRecord(false);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const sendMessageWithMail = async (audioUrl) => {
    const isAvailable = await MailComposer.isAvailableAsync();

    if (isAvailable) {
      var options = {
        subject: 'Check out this audio!',
        body: `I wanted to share this audio with you.`,
        attachments: [audioUrl],
      };

      MailComposer.composeAsync(options)
        .then((result) => {
          console.log(result.status);
          Alert.alert('Email Sent', 'The audio has been sent successfully.');
        })
        .catch((error) => {
          console.error('Error sending email', error);
          Alert.alert('Error', 'Failed to send email');
        });
    } else {
      Alert.alert('Email is not available');
    }
  };

  const handleAudioOptions = (id, audioUrl) => {
      Alert.alert(
        'Confirmation',
        'What do you plan to do with the audio?',
        [
          {
            text: 'Share Via Email',
            onPress: async () => {
              sendMessageWithMail(audioUrl);
            },
          },
          {
            text: 'Delete',
            onPress: async () => {
              handleDeleteAudio(id);
              Alert.alert('Audio Delete', 'Audio Deleted successfully!');
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

    const handleDeleteAudio = async (id) => {
        try {
          await deleteDoc(doc(firestore, 'audios', id));
          setRecordings((prevAudios) => prevAudios.filter((audio) => audio.id !== id));
        } catch (error) {
          console.error('Error deleting audio', error);
          Alert.alert('Error', 'Failed to delete audto');
        }
      };

    const getRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

  const renderItem = ({ item }) => (
    <View style={stylesAudio.recordingItem}>
      <TouchableOpacity
            onPress={() => playRecordedAudio(item.audioUrl)}
            onLongPress={() => handleAudioOptions(item.id, item.audioUrl)}
            style={stylesAudio.playButton}>
        <FontAwesome5 name="play" size={100} color={getRandomColor()} />
      </TouchableOpacity>
      <View style={stylesAudio.recordingInfo}>
        <Text style={stylesAudio.recordingText}>{item.id}</Text>
        {/* Add any additional information or labels here */}
      </View>
    </View>
  );

  return (
    <View style={stylesAudio.container}>
      <View style={stylesAudio.form}>
        <View style={stylesAudio.textContainer}>
          {!isRecording && !stopRecord && !showRecordedAudio && (
            <Text style={stylesAudio.textRecordTitle}>Tap the record button!</Text>
          )}
          {isRecording && !showRecordedAudio && (
            <Text style={stylesAudio.textRecordTitle}>Recording started!</Text>
          )}
          {stopRecord && !showRecordedAudio && (
            <Text style={stylesAudio.textRecordTitle}>Recording stopped!</Text>
          )}
        </View>

        <View style={stylesAudio.buttonContainer}>
          {!stopRecord && !showRecordedAudio && (
            <>
              <Button style={stylesAudio.button} color='red' title='Record' onPress={startRecordingAudio} />
              <Button style={stylesAudio.button} color='red' title='Stop' onPress={() => {
                stopRecordingAudio();
                setShowRecordedAudio(true);
              }} />
            </>
          )}
        </View>

        <View style={stylesAudio.buttonContainer}>
          {stopRecord && showRecordedAudio && (
            <>
              <TouchableOpacity style={stylesAudio.replayButton} onPress={isPaused ? resumePlayingRecordedAudio : pausePlayingRecordedAudio}>
                <FontAwesome5 name={isPaused ? 'play' : 'pause'} size={30} color='black' />
              </TouchableOpacity>
              <TouchableOpacity style={stylesAudio.replayButton} onPress={stopPlayingRecordedAudio}>
                <FontAwesome5 name='stop' size={30} color='black' />
              </TouchableOpacity>
              <TouchableOpacity style={stylesAudio.replayButton} onPress={uploadAudioToFirebase}>
                <FontAwesome5 name='cloud-upload-alt' size={30} color='black' />
              </TouchableOpacity>
            </>
          )}
        </View>

        {isPlaying && (
          <View>
            <Progress
              progress={progress}
              width={null} // Use null to fill the container
              height={10}
              color='red'
              indeterminate={false}
              style={{ marginTop: 1 }}
            />
            <Text style={{ marginTop: 2 }}>
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </Text>
          </View>
        )}
        {uploadError && (
          <Text style={{ color: 'red' }}>{uploadError}</Text>
        )}
      </View>

        <FlatList
          data={recordings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
        />
    </View>
  );
};

const stylesAudio = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  form: {
    flex: 1,
    flexDirection: 'column',
    margin: 30,
    justifyContent: 'flex-start',
  },
  buttonContainer: {
    paddingVertical: 6, // Adjust the value to increase or decrease space
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  textRecord: {
    fontSize: 30,
    color: '#fff',
  },
  textRecordTitle: {
      fontSize: 30,
      color: 'red',
    },
  replayButton: {
      padding: 10, // You can adjust the value to increase or decrease padding
    },
  flatListContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    recordingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      },
      playButton: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'lightgray', // Adjust the color as needed
        marginRight: 10,
      },
      recordingInfo: {
        flex: 1,
      },
      recordingText: {
        fontSize: 18,
      },
});

export default AudioScreen;
