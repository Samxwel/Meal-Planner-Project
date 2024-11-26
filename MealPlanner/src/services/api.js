// src/services/api.js

import axios from 'axios';

// Set up the base URL for the backend API
const API_URL = 'http://192.168.0.106:5000/api'; // Replace with your actual backend URL

// Axios instance for making requests
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User Management APIs
export const registerUser = async (userData) => {
  return api.post('/users/register', userData);
};

export const loginUser = async (credentials) => {
  return api.post('/users/login', credentials);
};

export const getUser = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error; // Re-throw error to be handled in the component
  }
};

export const updateUser = async (userId, updatedData) => {
  try {
    const response = await api.put(`/users/${userId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error; // Re-throw error to be handled in the component
  }
};



// Meal Planning APIs
export const getMealPlans = async (userId) => {
  return api.get(`/meal_plans/meal-plans/${userId}`);
};

export const createMeals = async (StageNameId) => {
  return api.get(`/meals/${StageNameId}`);
};

export const updateMealPlan = async (planId, updatedData) => {
  return api.put(`/meal-plans/${planId}`, updatedData);
};

export const submitFeedback = async (feedbackData) => {
  return api.post('/meal-plans/feedback', feedbackData);
};
export const saveMealPlan = async (data) => {
  return await api.post(`/user_meal_plan/save`, data);
};
export const checkStageExists = async (userId, stageName) => {
  try {
    const response = await api.get(`user_meal_plan/check_stage`, {
      params: { user_id: userId, stage_name: stageName }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchUserMealPlan = async (params) => {
  const response = await api.get(`/user_meal_plan/exist_mealplan`, { params });
  return response;
};


// Nutrition Tracking APIs
export const logFood = async ({ user_id, food_item, meal_time,log_date }) => {
  const response = await api.post('/food_items/nutrition/log-meal', {
    user_id,
    food_item,
    meal_time,
    log_date,
  });
  return response.data;
};

export const fetchFoodLog = async (userId) => {
  return api.get(`/food-log/${userId}`);
};

export const fetchNutritionAnalysis = async (userId) => {
  return api.get(`/nutrition-tracking/${userId}`);
};
export const generateNutritionalAnalysis = async (data) => {
  const response = await api.post(`/nutritionalanalysis/generate`, data);
  return response;
};

export const GetNutritionalAnalysis = async ({ userId, timeFrame }) => {
  try {
    const response = await api.post('/nutritionalanalysis/', {
      user_id: userId, // Correctly send user_id
      timeFrame: timeFrame, // Correctly send timeFrame
    });
    const { data, labels } = response.data;
    return { data, labels };
  } catch (error) {
    console.error('Error generating nutritional analysis:', error.response?.data || error.message);
    throw error;
  }
};




export const logProgress = async (data) => {
  const response = await api.post('progress_tracking/log', data);
  return response.data;
};

export const getProgressTracking = async (userId) => {
  try {
    const response = await api.get(`/progress_tracking/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching progress data:', error);
    throw error;
  }
};

// Feedback and Reporting APIs
export const submitUserFeedback = async (feedbackData) => {
  return api.post('/feedback', feedbackData);
};

export const fetchReports = async () => {
  return api.get('/reports');
};

// Healthcare Provider Interaction APIs
// Fetch patients
export const fetchPatients = async () => {
  try {
      const response = await api.get(`users/patients`);
      return response.data;
  } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
  }
};

// Update a patient
export const updatePatient = async (userId, updatedData) => {
  try {
      const response = await api.put(`users/patients/${userId}`, updatedData);
      return response.data;
  } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
  }
};

// Delete a patient
export const deletePatient = async (userId) => {
  try {
      const response = await api.delete(`users/patients/${userId}`);
      return response.data;
  } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
  }
};

export const fetchPatientProgress = async (patientId) => {
  return api.get(`/provider/patient-progress/${patientId}`);
};

export const sendMessage = async (messageData) => {
  return api.post('/provider/message', messageData);
};

export const reviewMealPlan = async (planId, reviewData) => {
  return api.put(`/provider/review-plan/${planId}`, reviewData);
};

// Technology Integration APIs (Reminders & Notifications)
export const sendNotification = async (notificationData) => {
  return api.post('/notifications', notificationData);
};

export const getUserMealPlan = async (userId) => {
  const response = await api.get(`/user_meal_plan/${userId}`);
  return response;
};

// Fetch all diseases
export const fetchDiseases = async () => {
  const response = await api.get('/diseases');
  return response;
};

// Fetch all meal plans
export const fetchMealPlans = async () => {
  const response = await api.get('/meal_plans');
  return response;
};

// Create a new disease
export const createDisease = async (data) => {
  const response = await api.post('/diseases', data);
  return response.data;
};

// Create a new meal plan
export const createMealPlan = async (data) => {
  const response = await api.post('/meal_plans', data);
  return response.data;
};

// Update an existing disease
export const updateDisease = async (diseaseId, data) => {
  const response = await api.put(`/diseases/${diseaseId}`, data);
  return response.data;
};

// Update an existing meal plan
export const UpdateMealPlan = async (planId, data) => {
  const response = await api.put(`/meal_plans/${planId}`, data);
  return response.data;
};

// Delete a disease
export const deleteDisease = async (diseaseId) => {
  const response = await api.delete(`/diseases/${diseaseId}`);
  return response;
};

// Delete a meal plan
export const deleteMealPlan = async (planId) => {
  const response = await api.delete(`/meal_plans/${planId}`);
  return response;
};
// Export the configured Axios instance
export default api;
