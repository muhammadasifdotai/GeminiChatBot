import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Voice from '@react-native-voice/voice';
import Message from './src/components/Message';
import Response from './src/components/Response';
import {SVG} from './src/assets';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [listData, setListData] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = stopListing;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = error => console.log('onSpeechError', error);

    const androidPermissionChecking = async () => {
      if (Platform.OS === 'android') {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        console.log('androidPermissionChecking hasPermission : ', hasPermission);
      }
    };
    androidPermissionChecking();

    // for removing all listener
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = event => {
    console.log('Recording Started...: ', event);
  };

  const onSpeechResults = event => {
    const text = event.value[0];
    setRecognizedText(text);
  };

  const startListing = async () => {
    setIsListening(true);
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.log('Start Listing Error : ', error);
    }
  };

  const stopListing = async () => {
    try {
      await Voice.stop();
      Voice.removeAllListeners();
      setIsListening(false);
    } catch (error) {
      console.log('StopListing Error : ', error);
    }
  };

  const SearchInput = () => {
    if (inputText.trim() === '') {
      // Prevent sending an empty message
      return;
    }

    setListData(prevList => [...prevList, inputText]);
    setInputText('');

    // Scroll to the bottom when a new message is added
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({animated: true});
      }
    }, 100);
  };

  const sendMessage = () => {
    if (recognizedText) {
      setListData(prevList => [...prevList, recognizedText]);
      setRecognizedText('');

      // Scroll to bottom after new message is added
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 100); // Delay to ensure the layout is updated before scrolling
    }
  };

  const clearAllChat = () => {
    setListData([]);
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar />

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('./src/assets/images/Gemini.png')}
          style={styles.icon}
        />
        <Text style={{fontSize: 24, fontWeight: '800', color: '#323232'}}>
          Gemini AI
        </Text>
        <TouchableOpacity onPress={clearAllChat} style={styles.clearButton}>
          <SVG.Recyclebin />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <FlatList
        ref={flatListRef}
        style={{paddingHorizontal: 16, marginBottom: 80}}
        data={listData}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <View>
            <Message message={item} />
            <Response prompt={item} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        onContentSizeChange={() =>
          flatListRef.current.scrollToEnd({animated: true})
        }
      />

      {/* Go to Bottom Button */}
      {listData.length > 0 && (
        <View style={styles.goToBottomContainer}>
          <TouchableOpacity
            onPress={scrollToBottom}
            style={styles.goToBottomButton}>
            <SVG.DownArrow />
          </TouchableOpacity>
        </View>
      )}

      {/* Search-Bar */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Ask Gemini AI anything..."
          placeholderTextColor={'black'}
          style={styles.input}
          value={inputText}
          onChangeText={text => setInputText(text)}
          selectionColor={'#323232'}
        />
        <TouchableOpacity onPress={SearchInput} style={styles.send}>
          <SVG.SendIcon />
        </TouchableOpacity>
      </View>

      {/* Voice Functionality */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={recognizedText}
          onChangeText={text => setRecognizedText(text)}
        />
        <TouchableOpacity
          onPress={() => {
            isListening ? stopListing() : startListing();
          }}
          style={styles.voiceButton}>
          {isListening ? (
            <Text style={styles.voiceButtonText}>•••</Text>
          ) : (
            <Image
              source={{uri: 'https://cdn-icons-png.flaticon.com/512/4980/4980251.png'}}
              style={{width: 45, height: 45}}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#55E6C1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 8,
    justifyContent: 'space-between',
  },
  icon: {
    width: 60,
    height: 60,
  },
  clearButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  goToBottomContainer: {
    position: 'absolute',
    right: 20,
    bottom: 100, // Place it just above the search bar
  },
  goToBottomButton: {
    padding: 8,
    backgroundColor: '#CAD3C8',
    borderRadius: 30,
  },
  send: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#55E6C1',
    borderRadius: 50,
    height: 57,
    width: 57,
  },
  searchBar: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 8,
  },
  input: {
    backgroundColor: "#f1f2f3",
    width: '60%',
    fontSize: 16,
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 32,
    borderWidth: 0.1,
    marginLeft: 11,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
  },
  voiceButton: {
    marginLeft: 10,
    fontSize: 24,
  },
  voiceButtonText: {
    fontSize: 24,
    height: 45,
  },
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FF6969',
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
