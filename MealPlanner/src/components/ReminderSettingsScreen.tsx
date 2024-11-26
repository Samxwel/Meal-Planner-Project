// ReminderSettingsScreen.tsx content will go here
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const MealPlanListScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Meal Plan List</Text>
      <Text style={styles.description}>This is the Meal Plan List screen. Functionality for this screen will be added later.</Text>
      <Button
        title="Go Back to Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default MealPlanListScreen;
