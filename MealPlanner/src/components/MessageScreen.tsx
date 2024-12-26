import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMessages, sendMessages } from '../services/api'; // API services for messaging

const MessageScreen = ({ route }) => {
  const { nutritionist } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Fetch user ID from AsyncStorage on component mount
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(parseInt(storedUserId)); // Convert to integer
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getMessages(nutritionist.user_id); // Fetch messages with the selected nutritionist
        setMessages(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setLoading(false);
      }
    };
    fetchMessages();
  }, [nutritionist]);

  const handleSendMessage = async () => {
    if (messageText.trim() === '') return;

    try {
      const newMessage = {
        sender_id: userId, // Replace with actual logged-in user ID
        receiver_id: nutritionist.user_id,
        message_text: messageText,
      };
      await sendMessages(newMessage); // Send message via API
      setMessages([...messages, { ...newMessage, timestamp: 'Now', status: 'unread' }]); // Add to local state
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffa726" />
        <Text>Loading Messages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat with {nutritionist.name}</Text>

      {/* Message List */}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.sender_id === 1 ? styles.userMessage : styles.nutritionistMessage]}>
            <Text style={styles.messageText}>{item.message_text}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        )}
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a message"
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    maxWidth: '70%',
  },
  userMessage: {
    backgroundColor: '#e1f5fe',
    alignSelf: 'flex-end',
  },
  nutritionistMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#ffa726',
    padding: 10,
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MessageScreen;
