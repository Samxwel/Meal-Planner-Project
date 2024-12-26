import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMessages, sendMessages } from '../services/api';

const MessagingScreen = ({ route }) => {
    const { user } = route.params; // Selected patient's details
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
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
                const response = await getMessages(user.user_id);
                setMessages(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching messages:', error);
                setLoading(false);
            }
        };
        fetchMessages();
    }, [user]);

    const handleSendMessage = async () => {
        if (message.trim() === '') return;

        try {
            const newMessage = {
                sender_id: userId, // Replace with nutritionist's ID
                receiver_id: user.user_id,
                message_text: message,
            };
            await sendMessages(newMessage);
            setMessages([...messages, { ...newMessage, timestamp: 'Now', status: 'unread' }]);
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text>Loading Messages...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chat with {user.name}</Text>
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.messageContainer, item.sender_id === 2 ? styles.userMessage : styles.patientMessage]}>
                        <Text style={styles.messageText}>{item.message_text}</Text>
                        <Text style={styles.timestamp}>{item.timestamp}</Text>
                    </View>
                )}
            />
            <TextInput
                style={styles.input}
                placeholder="Type a message"
                value={message}
                onChangeText={setMessage}
            />
            <Button title="Send" onPress={handleSendMessage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    input: { padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 10, borderRadius: 5 },
    messageContainer: { padding: 10, borderRadius: 8, marginBottom: 10, maxWidth: '70%' },
    userMessage: { backgroundColor: '#e1f5fe', alignSelf: 'flex-end' },
    patientMessage: { backgroundColor: '#fff', alignSelf: 'flex-start' },
    messageText: { fontSize: 16, color: '#333' },
    timestamp: { fontSize: 12, color: '#888', marginTop: 5 },
});

export default MessagingScreen;
