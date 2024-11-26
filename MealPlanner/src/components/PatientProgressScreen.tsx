import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PatientProgressScreen = ({ route }) => {
    const { patientId } = route.params;
    const [progress, setProgress] = useState([]);

    useEffect(() => {
        // Fetch progress data from API for the specific patient
    }, [patientId]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Patient Progress</Text>
            {progress.map((entry, index) => (
                <View key={index} style={styles.entry}>
                    <Text>Date: {entry.date}</Text>
                    <Text>Weight: {entry.weight_kg} kg</Text>
                    <Text>Blood Pressure: {entry.blood_pressure}</Text>
                    <Text>Glucose Level: {entry.glucose_level}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    entry: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});

export default PatientProgressScreen;
