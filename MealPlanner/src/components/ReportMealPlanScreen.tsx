import React from "react";
import { View, Text, ScrollView, Button, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { generatePDF } from "../services/pdf"; // PDF generator utility
import { patientData } from "../services/patient";
const ReportMealPlanScreen = () => {
  const { name, disease, stage, personalDetails, nutritionalAnalysis, foodLogs, progressTracking, feedback } = patientData;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Report Plan</Text>
      <View style={styles.section}>
        <Text style={styles.title}>Patient Details</Text>
        <Text>Name: {name}</Text>
        <Text>Disease: {disease}</Text>
        <Text>Stage: {stage.name}</Text>
        <Text>Description: {stage.description}</Text>
      </View>

      {/* Nutritional Analysis */}
      {/* <View style={styles.section}>
        <Text style={styles.title}>Nutritional Analysis</Text>
        <LineChart
          data={{
            labels: nutritionalAnalysis.map((data) => data.day),
            datasets: [
              { data: nutritionalAnalysis.map((data) => data.calories), label: "Calories" },
              { data: nutritionalAnalysis.map((data) => data.protein), label: "Protein" },
            ],
          }}
          width={300}
          height={200}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
        />
      </View> */}

      {/* Food Logs */}
      <View style={styles.section}>
        <Text style={styles.title}>Food Logs</Text>
        {foodLogs.map((log, index) => (
          <Text key={index}>
            {log.meal}: {log.item} ({log.portion}) - {log.calories} kcal
          </Text>
        ))}
      </View>

      {/* Progress Tracking */}
      {/* <View style={styles.section}>
        <Text style={styles.title}>Progress Tracking</Text>
        <LineChart
          data={{
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            datasets: [
              { data: progressTracking.weight, label: "Weight (kg)" },
              { data: progressTracking.bloodPressure, label: "Blood Pressure (mmHg)" },
              { data: progressTracking.sugarLevel, label: "Sugar Level (mg/dL)" },
            ],
          }}
          width={300}
          height={200}
          chartConfig={{
            backgroundColor: "#022173",
            backgroundGradientFrom: "#1e3c72",
            backgroundGradientTo: "#2a5298",
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
        />
      </View> */}

      {/* Feedback */}
      <View style={styles.section}>
        <Text style={styles.title}>User Feedback</Text>
        <Text>{feedback}</Text>
      </View>

      {/* Export to PDF */}
      <Button title="Export to PDF" onPress={() => generatePDF(patientData)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  section: { marginBottom: 24 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
});

export default ReportMealPlanScreen;
