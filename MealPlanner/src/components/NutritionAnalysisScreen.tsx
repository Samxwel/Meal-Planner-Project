import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure AsyncStorage is installed
import { GetNutritionalAnalysis } from '../services/api';

const screenWidth = Dimensions.get('window').width;

const NutritionAnalysisScreen = ({ navigation }) => {
  const [timeFrame, setTimeFrame] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNutritionData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = await AsyncStorage.getItem('userId'); // Fetch userId from AsyncStorage
        if (!userId) {
          throw new Error('User ID not found in storage.');
        }

        const response = await GetNutritionalAnalysis({ userId });
        setData(response);
      } catch (err) {
        setError(err.message || 'Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionData();
  }, []);

  // Helper to format dates for labels
  const formatLabels = (logDates) => {
    switch (timeFrame) {
      case 'daily':
        return logDates.map(date => {
          const day = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
          return day; // "Monday", "Tuesday", etc.
        });
      case 'monthly':
        return logDates.map((_, index) => `Week ${index + 1}`); // "Week 1", "Week 2", etc.
      case 'yearly':
        return logDates.map(date => {
          const month = new Date(date).toLocaleDateString('en-US', { month: 'long' });
          return month; // "January", "February", etc.
        });
      default:
        return logDates;
    }
  };

  // Filter data based on timeframe and limit the results
  const filterData = () => {
    const allData = data[timeFrame]?.data || [];
    switch (timeFrame) {
      case 'daily':
        return allData.slice(0, 7); // Last 7 days
      case 'monthly':
        return allData.slice(0, 5); // Last 5 weeks
      case 'yearly':
        return allData.slice(0, 5); // Last 5 months
      default:
        return allData;
    }
  };

  const currentData = filterData();
  const currentLabels = formatLabels(currentData.map(item => item.log_date));
  const currentTargets = data[timeFrame]?.targets || {};

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Nutrition Analysis</Text>
      <View style={styles.toggleContainer}>
        {['daily', 'monthly', 'yearly'].map(tf => (
          <TouchableOpacity
            key={tf}
            style={timeFrame === tf ? styles.selectedToggle : styles.toggle}
            onPress={() => setTimeFrame(tf)}
          >
            <Text style={styles.toggleText}>{tf.charAt(0).toUpperCase() + tf.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ffa726" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          {currentData.length > 0 ? (
            <LineChart
              data={{
                labels: currentLabels,
                datasets: [
                  {
                    data: currentData.map(item => item.calories),
                    color: () => 'orange', // Use color as a function
                  },
                ],
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          ) : (
            <Text style={styles.noDataText}>No data available for {timeFrame} timeframe.</Text>
          )}

          <View style={styles.targetsContainer}>
            <Text style={styles.targetsTitle}>Nutritional Targets:</Text>
            {Object.entries(currentTargets).map(([key, value]) => (
              <Text key={key} style={styles.targetText}>
                {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`}
              </Text>
            ))}
          </View>
        </>
      )}

      {/* Navigate to FoodLogScreen */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('FoodLog')}
      >
        <Text style={styles.buttonText}>Go to Food Log</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#f5f5f5',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  toggleContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  toggle: { padding: 10, borderRadius: 20, backgroundColor: '#f5f5f5' },
  selectedToggle: { padding: 10, borderRadius: 20, backgroundColor: '#ffa726' },
  toggleText: { color: '#000', fontSize: 16 },
  chart: { marginVertical: 20, borderRadius: 16 },
  targetsContainer: { marginTop: 20 },
  targetsTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  targetText: { fontSize: 16, color: '#333' },
  noDataText: { fontSize: 16, color: '#666', textAlign: 'center', marginVertical: 20 },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center', marginVertical: 20 },
  button: {
    backgroundColor: '#ffa726',
    padding: 12,
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NutritionAnalysisScreen;
