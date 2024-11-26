import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NutritionistHomeScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome, Nutritionist</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PatientList')}>
                <Text style={styles.buttonText}>View Patients</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Messaging')}>
                <Text style={styles.buttonText}>Messages</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MealPlanTarget')}>
                <Text style={styles.buttonText}>Review Meal Plan Targets</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
    button: { padding: 15, marginVertical: 10, backgroundColor: '#4CAF50', borderRadius: 8 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default NutritionistHomeScreen;
