import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMeals, fetchUserMealPlan } from '../services/api'; // API services

const MealPlanDetailScreen = ({ route, navigation }) => {
  const { stageExists } = route.params; // Determine if a stage exists
  const [viewType, setViewType] = useState('daily'); // Default to daily view
  const [selectedDay, setSelectedDay] = useState('Monday'); // Default day for daily view
  const [storedStageData, setStoredStageData] = useState(null); // Stage data from AsyncStorage
  const [mealPlan, setMealPlan] = useState(null); // Meal plan data

  // Fetch stage data and meal plan on component mount
  useEffect(() => {
    const fetchStoredStageData = async () => {
      try {
        const stageData = await AsyncStorage.getItem('selectedStage');
        if (stageData) {
          const parsedData = JSON.parse(stageData);
          setStoredStageData(parsedData);

          if (stageExists) {
            fetchUserMealPlanData(parsedData.stage_name); // Fetch existing meal plan
          } else {
            fetchMealPlan(parsedData.stage_name_id); // Generate new meal plan
          }
        }
      } catch (error) {
        console.error('Error retrieving stored stage data:', error);
      }
    };

    const fetchMealPlan = async (stage_name_id) => {
      try {
        const response = await createMeals(stage_name_id); // Generate meal plan
        setMealPlan(response.data);
        await AsyncStorage.setItem('weeklyMealPlan', JSON.stringify(response.data)); // Save meal plan to AsyncStorage
      } catch (error) {
        console.error('Error fetching meal plan:', error);
      }
    };

    const fetchUserMealPlanData = async (stage_name) => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const response = await fetchUserMealPlan({ user_id: userId, stage_name });
        setMealPlan(response.data);
        await AsyncStorage.setItem('weeklyMealPlan', JSON.stringify(response.data)); // Save meal plan to AsyncStorage
      } catch (error) {
        console.error('Error fetching user meal plan:', error);
      }
    };

    fetchStoredStageData();
  }, [stageExists]);

  // Render meal details for a specific meal type
  const renderMeal = (meal) => {
    if (!meal || meal.length === 0) return <Text>No meals available</Text>;
    return meal.map((item, index) => (
      <View key={index} style={styles.mealContainer}>
        <Text style={styles.mealName}>{item.meal_name || 'N/A'}</Text>
        <Text style={styles.calories}>{item.calories || 0} calories</Text>
        <Text>Carbs: {item.carbs || 0}g</Text>
        <Text>Fat: {item.fats || 0}g</Text>
        <Text>Protein: {item.protein || 0}g</Text>
        <Text>Fiber: {item.fiber || 0}g</Text>
        <Text>Grams: {item.grams || 0}g</Text>
        <Text>Measure: {item.measure || 'N/A'}</Text>
      </View>
    ));
  };

  // Render daily plan for selected day
  const renderDailyPlan = () => {
    const dayPlan = mealPlan ? mealPlan[selectedDay] : null;
    
    if (!dayPlan) return <Text>No meal plan available for {selectedDay}.</Text>;

    return (
      <View>
        <Text style={styles.dayTitle}>{selectedDay} Plan</Text>
        {['breakfast', 'lunch', 'Supper', 'Snack'].map((mealType) => (
          <View key={mealType}>
            <Text style={styles.mealHeader}>
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}:
            </Text>
            {renderMeal(dayPlan[mealType]) || <Text>No data available</Text>}
          </View>
        ))}
      </View>
    );
  };

  // Render weekly summary with clickable days
  const renderWeeklyPlan = () => {
    if (!mealPlan) return <Text>No weekly meal plan available.</Text>;

    return (
      <View>
        {Object.keys(mealPlan).map((dayKey, index) => {
          const dayPlan = mealPlan[dayKey];
          return (
            <TouchableOpacity
              key={index}
              style={styles.dayContainer}
              onPress={() => {
                setSelectedDay(dayKey);
                setViewType('daily'); // Switch to daily view for selected day
              }}
            >
              <Text style={styles.dayTitle}>{dayKey}</Text>
              <Text>Breakfast: {dayPlan.breakfast?.[0]?.meal_name || 'N/A'}</Text>
              <Text>Lunch: {dayPlan.lunch?.[0]?.meal_name || 'N/A'}</Text>
              <Text>Supper: {dayPlan.Supper?.[0]?.meal_name || 'N/A'}</Text>
              <Text>Snack: {dayPlan.Snack?.[0]?.meal_name || 'N/A'}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meal Plan Details</Text>

      {/* Toggle between Daily and Weekly views */}
      <View style={styles.toggleContainer}>
        <Button title="Daily Plan" onPress={() => setViewType('daily')} />
        <Button title="Weekly Plan" onPress={() => setViewType('weekly')} />
      </View>

      {/* Render the selected view */}
      <ScrollView style={styles.planContainer}>
        {viewType === 'daily' ? renderDailyPlan() : renderWeeklyPlan()}
      </ScrollView>

      {/* Display stored stage details */}
      {storedStageData && (
        <View style={styles.stageDetails}>
          <Text style={styles.stageText}>Stage Name: {storedStageData.stage_name}</Text>
          <Text style={styles.stageText}>Description: {storedStageData.stage_description}</Text>
        </View>
      )}

      {/* Generate report button */}
      <TouchableOpacity
        style={styles.reportButton}
        onPress={() => navigation.navigate('ReportMealPlanScreen', { mealPlan, storedStageData })}
      >
        <Text style={styles.reportButtonText}>Generate Report</Text>
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
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '500',
  },
  calories: {
    fontSize: 14,
    color: '#888',
  },
  stageDetails: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  stageText: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 5,
  },
  mealHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
  },
  reportButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MealPlanDetailScreen;
