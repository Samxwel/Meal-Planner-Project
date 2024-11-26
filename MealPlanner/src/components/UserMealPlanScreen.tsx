import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getUserMealPlan } from '../services/api'; // Update the path as needed

const UserMealPlanScreen = ({ route }) => {
    const { userId } = route.params;
    const [mealPlans, setMealPlans] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMealPlans = async () => {
            setLoading(true);
            try {
                const data = await getUserMealPlan(userId);

                if (data.data.message) {
                    Alert.alert('No Meal Plans', data.data.message);
                    setMealPlans([]); // Ensure the list is empty if no meal plans are found
                } else {
                    setMealPlans(data.data || []); // Fallback to empty array if data is not an array
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch meal plans.');
                console.error('Error fetching meal plans:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMealPlans();
    }, [userId]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Meal Plans</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#2196F3" />
            ) : mealPlans.length === 0 ? (
                <Text style={styles.noMealPlansText}>No meal plans available for this user.</Text>
            ) : (
                <FlatList
                    data={mealPlans}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.mealPlanContainer}>
                            <Text style={styles.mealName}>{item.meal_name} ({item.meal_type})</Text>
                            <Text>Day: {item.day}</Text>
                            <Text>Calories: {item.calories}</Text>
                            <Text>Protein: {item.protein}</Text>
                            <Text>Carbs: {item.carbs}</Text>
                            <Text>Fats: {item.fats}</Text>
                            <Text>Fiber: {item.fiber}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    mealPlanContainer: { padding: 10, marginBottom: 10, backgroundColor: '#f9f9f9', borderRadius: 5 },
    mealName: { fontSize: 18, fontWeight: 'bold' },
    noMealPlansText: { fontSize: 16, color: '#999', textAlign: 'center', marginTop: 20 },
});

export default UserMealPlanScreen;
