import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logFood, generateNutritionalAnalysis } from '../services/api'; // Import APIs

const FoodLogScreen = () => {
  const [foodItem, setFoodItem] = useState('');
  const [mealTime, setMealTime] = useState('');
  const [userId, setUserId] = useState(null);
  const [stageName, setStageName] = useState(''); // Stage name for nutritional analysis

  // Fetch user ID and stage name from AsyncStorage on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user ID
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) setUserId(parseInt(storedUserId));

        // Fetch selected stage data
        const stageData = await AsyncStorage.getItem('selectedStage');
        if (stageData) {
          const parsedData = JSON.parse(stageData);
          setStageName(parsedData.stageName);
          
        }
      } catch (error) {
        console.error('Failed to fetch user data from AsyncStorage:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogFood = async () => {
    const log_date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

    // Validate inputs
    if (!foodItem || !mealTime) {
      Alert.alert('Error', 'Please enter all fields.');
      return;
    }

    try {
      // Step 1: Log the food item
      await logFood({
        user_id: userId,
        food_item: foodItem,
        meal_time: mealTime,
        log_date: log_date,
      });

      Alert.alert('Success', 'Food logged successfully!');

      // Step 2: Trigger nutritional analysis generation
      try {

        await generateNutritionalAnalysis({
          user_id: userId,
          stage_name: stageName, // Use fetched stage name
        });
        console.log(stageName)
        Alert.alert('Success', 'Nutritional analysis updated successfully!');
      } catch (error) {
        console.error('Error generating nutritional analysis:', error);
        Alert.alert('Warning', 'Food logged but failed to update nutritional analysis.');
      }

      // Clear input fields
      setFoodItem('');
      setMealTime('');
    } catch (error) {
      console.error('Error logging food:', error);
      Alert.alert('Error', 'Failed to log food. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Log Your Food Intake</Text>

      <TextInput
        style={styles.input}
        placeholder="Food Item"
        value={foodItem}
        onChangeText={setFoodItem}
      />

      <TextInput
        style={styles.input}
        placeholder="Meal Time (e.g., Breakfast)"
        value={mealTime}
        onChangeText={setMealTime}
      />

      <Button title="Log Food" onPress={handleLogFood} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default FoodLogScreen;
