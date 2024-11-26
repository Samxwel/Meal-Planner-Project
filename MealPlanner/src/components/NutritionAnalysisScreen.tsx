import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const NutritionAnalysisScreen = ({ navigation }) => {
  const [timeFrame, setTimeFrame] = useState('daily');
  const [loading, setLoading] = useState(false);

  const testChartData = {
    daily: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{ data: [2000, 2200, 2100, 2300, 2400, 2200, 2100], color: () => 'orange', label: 'Calories' }],
    },
    monthly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{ data: [9000, 9200, 9100, 9400], color: () => 'orange', label: 'Calories' }],
    },
    yearly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{ data: [8000, 8500, 8700, 8900, 9000, 8800, 8700, 8600, 8700, 8800, 9000, 9200], color: () => 'orange', label: 'Calories' }],
    },
  };

  const testTargets = {
    calories: '2000 kcal',
    protein: '50 g',
    carbs: '300 g',
    fats: '70 g',
    fiber: '25 g',
  };

  const currentData = testChartData[timeFrame];

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
      ) : (
        <>
          <LineChart
            data={currentData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
          <View style={styles.targetsContainer}>
            <Text style={styles.targetsTitle}>Nutritional Targets:</Text>
            {Object.entries(testTargets).map(([key, value]) => (
              <Text key={key} style={styles.targetText}>
                {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
              </Text>
            ))}
          </View>
        </>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Food Logging</Text>
        <Button title="Log Food" onPress={() => navigation.navigate('FoodLog')} />
      </View>
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
  card: { backgroundColor: '#f5f5f5', padding: 20, marginVertical: 10, borderRadius: 8 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});

export default NutritionAnalysisScreen;
