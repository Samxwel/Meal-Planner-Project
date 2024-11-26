import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMealPlans, checkStageExists } from '../services/api'; // Import the API call for stage checking

const MealPlanListScreen = ({ navigation, route }) => {
  const userId = route.params.user_Id;
  const [diseaseData, setDiseaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stageAvailability, setStageAvailability] = useState({});

  useEffect(() => {
    const fetchMealPlans = async () => {
      setLoading(true);
      try {
        const response = await getMealPlans(userId);
        setDiseaseData(response.data);
      } catch (err) {
        setError('Failed to fetch meal plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlans();
  }, [userId]);

  useEffect(() => {
    // Function to check the availability of the stage in the UserMealPlan table
    const fetchStageAvailability = async (stageName) => {
      try {
        const response = await checkStageExists(userId, stageName);
        setStageAvailability((prevState) => ({
          ...prevState,
          [stageName]: response.data.stage_exists
        }));
      } catch (err) {
        console.log('Error checking stage availability:', err);
      }
    };

    // Check availability for all stages when the meal plan data is loaded
    if (diseaseData) {
      diseaseData.stages.forEach((stage) => {
        fetchStageAvailability(stage.stage_name);
      });
    }
  }, [diseaseData, userId]);

  const handleSelectStage = async (stage) => {
    try {
      await AsyncStorage.setItem('selectedStage', JSON.stringify({
        stage_name_id: stage.stage_name_id,
        stage_name: stage.stage_name,
        stage_description: stage.stage_description,
      }));
      navigation.navigate('MealPlanDetail', { stageExists: stageAvailability[stage.stage_name] });
    } catch (error) {
      console.log('Error saving selected stage:', error);
    }
  };
  

  const renderStage = ({ item }) => (
    <TouchableOpacity
      style={[styles.stageContainer, 
        !stageAvailability[item.stage_name] && { opacity: 0.5 }]} // Disable button if stage doesn't exist
      onPress={() => stageAvailability[item.stage_name] && handleSelectStage(item)} // Disable onPress if stage doesn't exist
      disabled={!stageAvailability[item.stage_name]} // Disable button if stage doesn't exist
    >
      <Text style={styles.stageName}>Stage: {item.stage_name}</Text>
      <Text style={styles.stageDescription}>{item.stage_description}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {diseaseData && (
        <>
          <Text style={styles.diseaseTitle}>Disease: {diseaseData.disease_name}</Text>
          <FlatList
            data={diseaseData.stages}
            keyExtractor={(item) => item.stage_name_id.toString()}
            renderItem={renderStage}
            contentContainerStyle={styles.list}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  diseaseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  list: {
    paddingBottom: 20,
  },
  stageContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    justifyContent: 'center',
  },
  stageName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  stageDescription: {
    fontSize: 14,
    color: '#333',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default MealPlanListScreen;
