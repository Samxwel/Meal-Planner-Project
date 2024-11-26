import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchPatients } from '../services/api'; // Update the path as needed

const PatientListScreen = ({ navigation }) => {
    const [patients, setPatients] = useState([]);

    const loadPatients = async () => {
        try {
            const data = await fetchPatients();
            setPatients(data);
        } catch (error) {
            console.error('Error loading patients:', error);
        }
    };

    useEffect(() => {
        loadPatients();
    }, []);

    const handleMealPlan = (userId) => {
        navigation.navigate('UserMealPlanScreen', { userId });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Patient List</Text>
            <FlatList
                data={patients}
                keyExtractor={(item) => item.user_id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.patientContainer}>
                        <Text style={styles.patientName}>{item.name}</Text>
                        <Text style={styles.diseaseDetails}>
                            {item.disease_name}: {item.disease_description}
                        </Text>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.mealPlanButton]}
                                onPress={() => handleMealPlan(item.user_id)}
                            >
                                <Text style={styles.buttonText}>Meal Plan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    patientContainer: { marginBottom: 15, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 5 },
    patientName: { fontSize: 18, fontWeight: 'bold' },
    diseaseDetails: { fontSize: 14, color: '#555', marginVertical: 5 },
    actionButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    button: { padding: 10, borderRadius: 5 },
    mealPlanButton: { backgroundColor: '#2196F3' },
    buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default PatientListScreen;
