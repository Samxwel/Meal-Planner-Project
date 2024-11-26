import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage if using it

const HomeScreen = ({ navigation }) => {
  const [user_Id, setUserId] = useState(null);

  // Fetch userId from AsyncStorage or your state management solution
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const user_Id = storedUserId ? JSON.parse(storedUserId) : null; // Adjust the key based on your implementation
        if (user_Id) {
          setUserId(user_Id);
        }
      } catch (error) {
        console.error('Failed to fetch userId from AsyncStorage:', error);
      }
    };

    fetchUserId();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://example.com/background.jpg' }} // Replace with your image URL
        style={styles.backgroundImage}
      />
      <View style={styles.welcomeCard}>
        <Text style={styles.title}>Welcome to the Nutrition Management App!</Text>
        <Text style={styles.description}>
          Your journey to better health starts here. Choose an option below to get started!
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MealPlanList', { user_Id })} // Pass userId here
        >
          <Text style={styles.buttonText}>🍽 Meal Plans</Text>
          <Text style={styles.buttonDescription}>Explore personalized meal plans</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NutritionAnalysis')}>
          <Text style={styles.buttonText}>📊 Track Nutrition</Text>
          <Text style={styles.buttonDescription}>Analyze your nutritional intake</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ProgressTracking')}>
          <Text style={styles.buttonText}>📈 View Progress</Text>
          <Text style={styles.buttonDescription}>Monitor your progress over time</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Feedback')}>
          <Text style={styles.buttonText}>💬 Feedback</Text>
          <Text style={styles.buttonDescription}>Share your thoughts and suggestions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Notification')}>
          <Text style={styles.buttonText}>🔔 View Notifications</Text>
          <Text style={styles.buttonDescription}>Stay updated with alerts and messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditProfileScreen')}>
          <Text style={styles.buttonText}>🔔 Edit Profile</Text>
          <Text style={styles.buttonDescription}>Ensure your details are captured</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f7f7f7', // Light background color
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover', // Cover the entire screen
    opacity: 0.3, // Slight transparency for text readability
  },
  welcomeCard: {
    backgroundColor: '#ffffff', // White background for the welcome card
    padding: 20,
    borderRadius: 10,
    marginTop: 40, // Space from the top of the screen
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2, // For Android shadow
    alignItems: 'center', // Center the text in the card
    width: '90%', // Responsive width
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333', // Darker text for contrast
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666', // Subtle color for description
    textAlign: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20, // Add some padding at the bottom for scrollability
  },
  button: {
    backgroundColor: '#4CAF50', // Primary color
    padding: 20,
    borderRadius: 10,
    marginVertical: 10, // Spacing between buttons
    alignItems: 'center',
    elevation: 2, // Shadow effect for depth
  },
  buttonText: {
    color: '#fff', // White text for contrast
    fontSize: 22,
    fontWeight: 'bold',
  },
  buttonDescription: {
    color: '#fff', // White text for contrast
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center', // Center description text
  },
});

export default HomeScreen;
