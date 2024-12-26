import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { getNutritionists } from '../services/api'; // API service to fetch nutritionists

const NutritionistList = ({ navigation }) => {
  const [nutritionists, setNutritionists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNutritionists = async () => {
      try {
        const response = await getNutritionists(); // Fetch nutritionists from API
        setNutritionists(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching nutritionists:', error);
        setLoading(false);
      }
    };
    fetchNutritionists();
  }, []);

  const handleSelectNutritionist = (nutritionist) => {
    navigation.navigate('MessageScreen', { nutritionist });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffa726" />
        <Text>Loading Nutritionists...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Nutritionists</Text>
      <FlatList
        data={nutritionists}
        keyExtractor={(item) => item.user_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.nutritionistItem}
            onPress={() => handleSelectNutritionist(item)}
          >
            <Text style={styles.nutritionistName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nutritionistItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nutritionistName: {
    fontSize: 18,
    color: '#333',
  },
});

export default NutritionistList;
