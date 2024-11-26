import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ProgressBar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getProgressTracking } from '../services/api'; // Updated to use the correct API function
import { captureRef } from 'react-native-view-shot'; // Import captureRef for taking snapshots

const screenWidth = Dimensions.get('window').width;

const ProgressTrackingScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [timeFrame, setTimeFrame] = useState('weekly');
  const chartRefs = useRef([]); // Reference to all chart components for capturing

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          const data = await getProgressTracking(storedUserId); // Fetch progress data
          setProgressData(data);

          // Capture and save the charts as images once data is loaded
          saveCharts();
        } else {
          console.error('No user ID found in storage');
        }
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getChartData = (key) => ({
    labels: progressData.map((entry) =>
      new Date(entry.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        data: progressData.map((entry) => parseFloat(entry[key] || 0)),
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      },
    ],
  });

  const saveCharts = async () => {
    try {
      const images = [];
      for (let i = 0; i < chartRefs.current.length; i++) {
        const uri = await captureRef(chartRefs.current[i], {
          format: 'png',
          quality: 0.8,
        });
        images.push(uri); // Add the captured image URI to the array
      }
      // Store all images in AsyncStorage
      await AsyncStorage.setItem('chartImages', JSON.stringify(images));
      console.log('Charts saved to AsyncStorage');
    } catch (error) {
      console.error('Error saving charts:', error);
    }
  };

  const clampProgress = (current, target) => {
    const progress = Math.min(Math.max(current / target, 0), 1);
    return parseFloat(progress.toFixed(2));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffa726" />
        <Text>Loading Progress...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={timeFrame === 'weekly' ? styles.selectedToggle : styles.toggle}
          onPress={() => setTimeFrame('weekly')}
        >
          <Text style={styles.toggleText}>Weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={timeFrame === 'monthly' ? styles.selectedToggle : styles.toggle}
          onPress={() => setTimeFrame('monthly')}
        >
          <Text style={styles.toggleText}>Monthly</Text>
        </TouchableOpacity>
      </View>

      {progressData.length === 0 ? (
        <Text style={styles.noData}>No progress data available</Text>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Weight Progress (kg)</Text>
          <View ref={(ref) => (chartRefs.current[0] = ref)}>
            <LineChart
              data={getChartData('weight_kg')}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          </View>

          <Text style={styles.sectionTitle}>Blood Pressure (mm Hg)</Text>
          <View ref={(ref) => (chartRefs.current[1] = ref)}>
            <LineChart
              data={getChartData('blood_pressure')}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          </View>

          <Text style={styles.sectionTitle}>Glucose Levels (mg/dL)</Text>
          <View ref={(ref) => (chartRefs.current[2] = ref)}>
            <LineChart
              data={getChartData('glucose_level')}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          </View>
        </>
      )}

      <Text style={styles.sectionTitle}>Your Goals</Text>
      <View style={styles.goalCard}>
        <Text style={styles.goalText}>Weight Goal: 66kg / 65kg</Text>
        <ProgressBar progress={clampProgress(66, 65)} color="#FFA726" style={styles.progressBar} />

        <Text style={styles.goalText}>Blood Pressure Goal: 115/75 / 120/80</Text>
        <ProgressBar progress={0.95} color="#FFA726" style={styles.progressBar} />

        <Text style={styles.goalText}>Glucose Level Goal: 80 / 85mg/dL</Text>
        <ProgressBar progress={clampProgress(80, 85)} color="#FFA726" style={styles.progressBar} />
      </View>

      <Text style={styles.sectionTitle}>Milestones Achieved!</Text>
      <View style={styles.milestonesContainer}>
        <Text style={styles.milestone}>🎉 Weight dropped by 2kg last month</Text>
        <Text style={styles.milestone}>🎉 Blood pressure improved!</Text>
      </View>

      <TouchableOpacity style={styles.logButton} onPress={() => navigation.navigate('LogProgress')}>
        <Text style={styles.logButtonText}>Log Progress</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#f5f5f5',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  toggle: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedToggle: {
    backgroundColor: '#ffa726',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  toggleText: {
    fontSize: 16,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 20,
    borderRadius: 16,
  },
  goalCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginVertical: 15,
  },
  goalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  milestonesContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginVertical: 15,
  },
  milestone: {
    fontSize: 16,
    marginBottom: 10,
  },
  logButton: {
    backgroundColor: '#ffa726',
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 20,
  },
  logButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noData: {
    textAlign: 'center',
    fontSize: 18,
  },
});

export default ProgressTrackingScreen;
