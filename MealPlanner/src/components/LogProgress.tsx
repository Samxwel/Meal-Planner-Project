import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logProgress } from '../services/api'; // API call function

const LogProgress = ({ navigation }) => {
  const [weight, setWeight] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [glucoseLevel, setGlucoseLevel] = useState('');
  const [notes, setNotes] = useState('');
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

  const handleLogProgress = async () => {
    if (!weight || !bloodPressure || !glucoseLevel) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    try {
      await logProgress({
        user_id: userId,
        weight_kg: parseFloat(weight),
        blood_pressure: bloodPressure,
        glucose_level: parseFloat(glucoseLevel),
        notes,
      });
      Alert.alert("Success", "Progress logged successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error logging progress:", error);
      Alert.alert("Error", "Failed to log progress. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Your Progress</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your blood pressure (e.g., 120/80)"
        value={bloodPressure}
        onChangeText={setBloodPressure}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your glucose level (mg/dL)"
        keyboardType="numeric"
        value={glucoseLevel}
        onChangeText={setGlucoseLevel}
      />
      <TextInput
        style={styles.input}
        placeholder="Add notes (optional)"
        multiline
        numberOfLines={4}
        value={notes}
        onChangeText={setNotes}
      />

      <Button title="Submit Progress" onPress={handleLogProgress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default LogProgress;
