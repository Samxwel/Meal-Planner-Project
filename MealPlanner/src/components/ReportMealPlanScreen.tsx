import React from "react";
import { View, Text, ScrollView, Button, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { generatePDF } from "../services/pdf"; // PDF generator utility
import { patientData } from "../services/patient";

const screenWidth = Dimensions.get("window").width;

const ReportMealPlanScreen = () => {
  const { name, disease, stage, nutritionalAnalysis, foodLogs, progressTracking, feedback } = patientData;

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
      <View style={styles.section}>
        <Text style={styles.title}>Nutritional Analysis</Text>
        <Text style={styles.subtitle}>Calories and Protein</Text>
        <LineChart
          data={{
            labels: nutritionalAnalysis.map((data) => data.day),
            datasets: [
              { data: nutritionalAnalysis.map((data) => data.calories), color: () => "#ff6384" }, // Red line for calories
              { data: nutritionalAnalysis.map((data) => data.protein), color: () => "#36a2eb" }, // Blue line for protein
            ],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          yAxisSuffix="kcal"
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#f7f7f7",
            backgroundGradientTo: "#e8e8e8",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={styles.chart}
        />
        <View style={styles.legend}>
          <View style={[styles.legendItem, { backgroundColor: "#ff6384" }]} />
          <Text>Calories</Text>
          <View style={[styles.legendItem, { backgroundColor: "#36a2eb" }]} />
          <Text>Protein</Text>
        </View>
      </View>

      {/* Progress Tracking */}
      <View style={styles.section}>
        <Text style={styles.title}>Progress Tracking</Text>
        <Text style={styles.subtitle}>Weight, Blood Pressure, and Sugar Levels</Text>
        <LineChart
          data={{
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            datasets: [
              { data: progressTracking.weight, color: () => "#f39c12" }, // Orange line for weight
              { data: progressTracking.bloodPressure, color: () => "#27ae60" }, // Green line for BP
              { data: progressTracking.sugarLevel, color: () => "#e74c3c" }, // Red line for sugar
            ],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#f7f7f7",
            backgroundGradientTo: "#e8e8e8",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={styles.chart}
        />
        <View style={styles.legend}>
          <View style={[styles.legendItem, { backgroundColor: "#f39c12" }]} />
          <Text>Weight</Text>
          <View style={[styles.legendItem, { backgroundColor: "#27ae60" }]} />
          <Text>Blood Pressure</Text>
          <View style={[styles.legendItem, { backgroundColor: "#e74c3c" }]} />
          <Text>Sugar Level</Text>
        </View>
      </View>

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
  subtitle: { fontSize: 14, marginBottom: 8 },
  chart: { marginVertical: 8, borderRadius: 16 },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  legendItem: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default ReportMealPlanScreen;
