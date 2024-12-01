import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet, SafeAreaView, Platform, StatusBar } from "react-native";
import io from 'socket.io-client';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const App = () => {
  const socket = io('http://192.168.1.172:1337');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('getId', data => {
      setUser(data);
    })

    socket.on('sendDataServer', (data) => {
      setChatMessages(prev => [...prev, data.data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  // const inputRef = useRef();
  // const scrollRef = useRef();

  const handleNewMessage = () => {
    if (message === "")
    {
      return;
    }

    socket.emit('sendDataClient', {'text': message, 'user': user});
    setMessage("");
  };

  return (
    <SafeAreaView style={styles.outerContainer}>
      <KeyboardAwareScrollView 
        //ref={scrollRef}
      >
        <View style={styles.messagingScreen}>
          {
            chatMessages.map((msg, key) => {
              return (
                <View style={ (msg.user === user) ? styles.messageRow : [styles.messageRow, { justifyContent: 'flex-end' }] } key={key}>
                  <View style={styles.messageBubble}>
                    <Text>{msg.text}</Text>
                  </View>
                </View>
              );
            })
          }
        </View>

        <View style={styles.messagingInputContainer}>
          <TextInput
            style={styles.messagingInput}
            value={message}
            onChangeText={(value) => setMessage(value)}
            //ref={inputRef}
          />
          <Pressable
            style={styles.messagingButtonContainer}
            onPress={handleNewMessage}
          >
            <View>
              <Text style={styles.sendButton}>SEND</Text>
            </View>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 50 : 50,
  },
  messagingScreen: {
    padding: 20,
  },
  messageRow: {
    flexDirection: 'row', 
  },
  messageBubble: {
    margin: 5,
    padding: 10,
    backgroundColor: 'gray',
    alignSelf: 'center',
    borderRadius: 10,
  },
  messagingInputContainer: {
    width: "100%",
    minHeight: 100,
    backgroundColor: "white",
    paddingVertical: 30,
    paddingHorizontal: 15,
    justifyContent: "center",
    flexDirection: "row",
  },
  messagingInput: {
    borderWidth: 1,
    padding: 15,
    flex: 1,
    marginRight: 10,
    borderRadius: 20,
  },
  messagingButtonContainer: {
    width: "30%",
    backgroundColor: "green",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  sendButton: {
    color: "#f2f0f1", 
    fontSize: 20,
  },
});

export default App;