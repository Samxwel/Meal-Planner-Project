import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMeals, saveMealPlan, fetchUserMealPlan, deleteUserMealPlan } from '../services/api';
import * as Print from 'expo-print';
import * as Sharing from "expo-sharing";

const MealPlanDetailScreen = ({ route, navigation }) => {
  const [viewType, setViewType] = useState('daily');
  const [selectedDay, setSelectedDay] = useState('Monday'); // Default to Monday
  const [storedStageData, setStoredStageData] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [userMealPlan, setUserMealPlan] = useState(null); // New state to store user meal plan

  useEffect(() => {
    const fetchStoredStageData = async () => {
      try {
        const stageData = await AsyncStorage.getItem('selectedStage');
        if (stageData) {
          const parsedData = JSON.parse(stageData);
          setStoredStageData(parsedData);
          fetchMealPlan(parsedData.stage_name_id); // Pass stagenameid to fetchMealPlan
          fetchUserMealPlanData(parsedData.stage_name); // Fetch user meal plan
        }
      } catch (error) {
        console.log('Error retrieving stored stage data:', error);
      }
    };

    const fetchMealPlan = async (stage_name_id) => {
      try {
        const response = await createMeals(stage_name_id); // Pass stagenameid to API call
        setMealPlan(response.data); // Store the fetched meal plan in state
      } catch (error) {
        console.log('Error fetching meal plan:', error);
      }
    };

    const fetchUserMealPlanData = async (stage_name) => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const response = await fetchUserMealPlan({ user_id: userId, stage_name });
        setUserMealPlan(response.data); // Set user meal plan if exists
      } catch (error) {
        console.log('Error fetching user meal plan:', error);
      }
    };

    fetchStoredStageData();
  }, []);

  const saveMealPlanToStorage = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const startDate = new Date().toISOString().split('T')[0]; // Current date
      const stage_name = storedStageData.stage_name;
      if (mealPlan && userId && storedStageData) {
        const response = await saveMealPlan({
          user_id: userId,
          stage_name: stage_name, // Include stage_name
          meal_plan: mealPlan,
          start_date: startDate,
        });

        Alert.alert("Success", response.data.message);
        setUserMealPlan(mealPlan); // Save the meal plan in the state to disable the save button
      } else {
        Alert.alert("Error", "No meal plan, user data, or stage data available.");
      }
    } catch (error) {
      console.log('Error saving meal plan:', error);
      Alert.alert("Error", "Failed to save meal plan.");
    }
  };

  const renderMeal = (meal) => {
    if (!meal) return null;
    return meal.map((item, index) => (
      `<div style="margin-bottom: 10px;">
        <h4>${item.meal_name}</h4>
        <p>Calories: ${item.calories}</p>
        <p>Carbs: ${item.carbs}g, Fat: ${item.fat}g, Protein: ${item.protein}g, Fiber: ${item.fiber}g</p>
        <p>Grams: ${item.grams}g, Measure: ${item.measure}</p>
      </div>`
    )).join('');
  };

  const generatePDF = async () => {
    if (!userMealPlan || !storedStageData) {
      Alert.alert('Error', 'No meal plan or stage data available to generate PDF.');
      return;
    }

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; color: #4CAF50; }
            h2 { color: #2196F3; }
            .meal { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Weekly Plan</h1>
          <h2>Username: Strum</h2>
          <h2>Disease: ${storedStageData.stage_name}</h2>
          ${Object.keys(userMealPlan).map(day => `
            <div class="meal">
              <h3>${day}</h3>
              <h4>Breakfast:</h4>
              ${renderMeal(userMealPlan[day]?.breakfast || [])}
              <h4>Lunch:</h4>
              ${renderMeal(userMealPlan[day]?.lunch || [])}
              <h4>Supper:</h4>
              ${renderMeal(userMealPlan[day]?.Supper || [])}
              <h4>Snack:</h4>
              ${renderMeal(userMealPlan[day]?.Snack || [])}
            </div>
          `).join('')}
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      Alert.alert('Success', `PDF has been saved to: ${uri}`);
      // Check if sharing is available, and share the PDF
      if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      alert("Sharing is not available on this device");
    }
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF.');
    }
  };

  const deleteUserMealPlanHandler = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found');
        return;
      }
      const response = await deleteUserMealPlan(userId);
      Alert.alert('Success', response.message || 'Meal plan deleted successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete meal plan');
    }
  };
  const renderDailyPlan = () => {
    if (!mealPlan || !selectedDay) return <Text>No daily plan available</Text>;
  
    const dayPlan = mealPlan[selectedDay];
    if (!dayPlan) return <Text>No plan found for {selectedDay}</Text>;
  
    return (
      <View>
        <Text style={styles.dayTitle}>{selectedDay}</Text>
        {['breakfast', 'lunch', 'Supper', 'Snack'].map((mealType) => (
          <View key={mealType} style={styles.mealContainer}>
            <Text style={styles.dayTitle}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</Text>
            {dayPlan[mealType]?.map((meal, index) => (
              <View key={index}>
                <Text>{meal.name}</Text>
                <Text>Calories: {meal.calories}</Text>
                <Text>Carbs: {meal.carbs}g, Fat: {meal.fat}g, Protein: {meal.protein}g, Fiber: {meal.fiber}g</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };
  
  const renderWeeklyPlan = () => {
    if (!mealPlan) return <Text>No weekly plan available</Text>;
  
    return (
      <View>
        {Object.keys(mealPlan).map((day) => (
          <View key={day} style={styles.dayContainer}>
            <Text style={styles.dayTitle}>{day}</Text>
            {['breakfast', 'lunch', 'Supper', 'Snack'].map((mealType) => (
              <View key={mealType} style={styles.mealContainer}>
                <Text>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</Text>
                {mealPlan[day][mealType]?.map((meal, index) => (
                  <View key={index}>
                    <Text>{meal.name}</Text>
                    <Text>Calories: {meal.calories}</Text>
                    <Text>Carbs: {meal.carbs}g, Fat: {meal.fat}g, Protein: {meal.protein}g, Fiber: {meal.fiber}g</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meal Plan Details</Text>
      <View style={styles.toggleContainer}>
        <Button title="Daily Plan" onPress={() => setViewType('daily')} />
        <Button title="Weekly Plan" onPress={() => setViewType('weekly')} />
      </View>

      <ScrollView style={styles.planContainer}>
        {mealPlan ? (viewType === 'daily' ? renderDailyPlan() : renderWeeklyPlan()) : <Text>Loading...</Text>}
      </ScrollView>

      {storedStageData && (
        <View style={styles.stageDetails}>
          <Text style={styles.stageText}>Stage Name: {storedStageData.stage_name}</Text>
          <Text style={styles.stageText}>Description: {storedStageData.stage_description}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.reportButton} onPress={generatePDF}>
        <Text style={styles.reportButtonText}>Export to PDF</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveMealPlanToStorage}
        disabled={!!userMealPlan} // Disable if userMealPlan exists
      >
        <Text style={styles.saveButtonText}>{userMealPlan ? 'Meal Plan Saved' : 'Save Meal Plan'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={deleteUserMealPlanHandler}
      >
        <Text style={styles.deleteButtonText}>Delete Meal Plan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  planContainer: {
    flex: 1,
  },
  dayContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  mealContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  stageDetails: {
    marginVertical: 20,
  },
  stageText: {
    fontSize: 16,
    marginBottom: 10,
  },
  reportButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MealPlanDetailScreen;
