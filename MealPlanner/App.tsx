import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/components/HomeScreen';
import MealPlanListScreen from './src/components/MealPlanListScreen';
import MealPlanDetailScreen from './src/components/MealPlanDetailScreen';
import EditMealPlanScreen from './src/components/EditMealPlanScreen';
import FeedbackScreen from './src/components/FeedbackScreen';
import FoodLogScreen from './src/components/FoodLogScreen';
import NutritionAnalysisScreen from './src/components/NutritionAnalysisScreen';
import ProgressTrackingScreen from './src/components/ProgressTrackingScreen';
import PatientListScreen from './src/components/PatientListScreen';
import PatientProgressScreen from './src/components/PatientProgressScreen';
import MessagingScreen from './src/components/MessagingScreen';
import ReminderSettingsScreen from './src/components/ReminderSettingsScreen';
import NotificationScreen from './src/components/NotificationScreen';
import LogProgress from './src/components/LogProgress';
import NutritionistHomeScreen from './src/components/NutritionistHomeScreen';
import LoginScreen from './src/components/LoginScreen';
import RegistrationScreen from './src/components/RegistrationScreen';
import ReportScreen from './src/components/ReportMealPlanScreen';
import ReportMealPlan from './src/components/ReportMealPlanScreen';
import UserMealPlanScreen from './src/components/UserMealPlanScreen';
import MealPlanTarget from './src/components/MealPlanTargetsScreen';
import EditProfileScreen from './src/components/EditProfileScreen';
import NutritionistList from './src/components/NutritionList';
import MessageScreen from './src/components/MessageScreen';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MealPlanList" component={MealPlanListScreen} />
        <Stack.Screen name="MealPlanDetail" component={MealPlanDetailScreen} />
        <Stack.Screen name="EditMealPlan" component={EditMealPlanScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
        <Stack.Screen name="FoodLog" component={FoodLogScreen} />
        <Stack.Screen name="NutritionAnalysis" component={NutritionAnalysisScreen} />
        <Stack.Screen name="ProgressTracking" component={ProgressTrackingScreen} />
        <Stack.Screen name="PatientList" component={PatientListScreen} />
        <Stack.Screen name="PatientProgress" component={PatientProgressScreen} />
        <Stack.Screen name="Messaging" component={MessagingScreen} />
        <Stack.Screen name="ReminderSettings" component={ReminderSettingsScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="LogProgress" component={LogProgress} />
        <Stack.Screen name="NutritionistHomeScreen" component={NutritionistHomeScreen} />
        <Stack.Screen name="ReportMealPlanScreen" component={ReportMealPlan} />
        <Stack.Screen name="UserMealPlanScreen" component={UserMealPlanScreen} />
        <Stack.Screen name="MealPlanTarget" component={MealPlanTarget} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name='NutritionList' component={NutritionistList}/>
        <Stack.Screen name='MessageScreen' component={MessageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
