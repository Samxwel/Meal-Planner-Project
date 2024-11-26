import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, Button, ActivityIndicator } from 'react-native';
import { fetchDiseases, fetchMealPlans, createDisease, createMealPlan, updateDisease, updateMealPlan, deleteDisease, deleteMealPlan } from '../services/api'; // Replace with actual paths

const MealPlanTarget = () => {
    const [diseases, setDiseases] = useState([]);
    const [mealPlans, setMealPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false); 
    const [selectedDisease, setSelectedDisease] = useState(null);
    const [selectedMealPlan, setSelectedMealPlan] = useState(null);

    // States for Create/Update
    const [diseaseName, setDiseaseName] = useState('');
    const [diseaseDescription, setDiseaseDescription] = useState('');
    const [stageName, setStageName] = useState('');
    const [stageDescription, setStageDescription] = useState('');
    const [stageNameId, setStageNameId] = useState('');
    const [mealPlanData, setMealPlanData] = useState({
        diseaseId: '',
        stageName: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        fiber: '',
        satFat: ''
    });

    // Fetch diseases and meal plans
    const loadData = async () => {
        setLoading(true);
        try {
            const diseaseData = await fetchDiseases();
            const mealPlanData = await fetchMealPlans();
            setDiseases(diseaseData?.data || []);
            setMealPlans(mealPlanData?.data || []);
        } catch (error) {
            console.error('Error loading data:', error);
            Alert.alert('Error', 'Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Create Disease
    const handleCreateDisease = async () => {
        if (!diseaseName || !diseaseDescription || !stageName || !stageDescription || !stageNameId) {
            Alert.alert('Invalid Input', 'Please enter all required fields.');
            return;
        }

        try {
            await createDisease({ disease_name: diseaseName, description: diseaseDescription, stage_name: stageName, stage_description: stageDescription, stage_name_id: stageNameId });
            loadData();
            setModalVisible(false);
            setDiseaseName('');
            setDiseaseDescription('');
            setStageName('');
            setStageDescription('');
            setStageNameId('');
        } catch (error) {
            console.error('Error creating disease:', error);
            Alert.alert('Error', 'Failed to create disease.');
        }
    };

    // Update Disease
    const handleUpdateDisease = async () => {
        if (!diseaseName || !diseaseDescription || !stageName || !stageDescription || !stageNameId) {
            Alert.alert('Invalid Input', 'Please enter all required fields.');
            return;
        }

        try {
            await updateDisease(selectedDisease.disease_id, { disease_name: diseaseName, description: diseaseDescription, stage_name: stageName, stage_description: stageDescription, stage_name_id: stageNameId });
            loadData();
            setModalVisible(false);
            setDiseaseName('');
            setDiseaseDescription('');
            setStageName('');
            setStageDescription('');
            setStageNameId('');
        } catch (error) {
            console.error('Error updating disease:', error);
            Alert.alert('Error', 'Failed to update disease.');
        }
    };

    // Create Meal Plan
    const handleCreateMealPlan = async () => {
        const { diseaseId, stageName, calories, protein, carbs, fats, fiber, satFat } = mealPlanData;

        if (!diseaseId || !stageName || !calories || !protein) {
            Alert.alert('Invalid Input', 'Please fill all required fields (Disease ID, Stage Name, and Goals).');
            return;
        }

        try {
            await createMealPlan({
                disease_id: parseInt(diseaseId),
                stage_name: stageName,
                caloric_goal: parseFloat(calories),
                protein_goal: parseFloat(protein),
                carbs_goal: parseFloat(carbs),
                fats_goal: parseFloat(fats),
                fiber_goal: parseFloat(fiber),
                sat_fat_goal: parseFloat(satFat)
            });
            loadData();
            setModalVisible(false);
            setMealPlanData({
                diseaseId: '',
                stageName: '',
                calories: '',
                protein: '',
                carbs: '',
                fats: '',
                fiber: '',
                satFat: ''
            });
        } catch (error) {
            console.error('Error creating meal plan:', error);
            Alert.alert('Error', 'Failed to create meal plan.');
        }
    };

    // Update Meal Plan
    const handleUpdateMealPlan = async () => {
        const { calories, protein, carbs, fats, fiber, satFat } = mealPlanData;

        if (!calories || !protein) {
            Alert.alert('Invalid Input', 'Please provide valid input for calories and protein.');
            return;
        }

        try {
            await updateMealPlan(selectedMealPlan.plan_id, {
                caloric_goal: parseFloat(calories),
                protein_goal: parseFloat(protein),
                carbs_goal: parseFloat(carbs),
                fats_goal: parseFloat(fats),
                fiber_goal: parseFloat(fiber),
                sat_fat_goal: parseFloat(satFat)
            });
            loadData();
            setModalVisible(false);
            setMealPlanData({
                diseaseId: '',
                stageName: '',
                calories: '',
                protein: '',
                carbs: '',
                fats: '',
                fiber: '',
                satFat: ''
            });
        } catch (error) {
            console.error('Error updating meal plan:', error);
            Alert.alert('Error', 'Failed to update meal plan.');
        }
    };

    // Delete Disease
    const handleDeleteDisease = async (diseaseId) => {
        try {
            await deleteDisease(diseaseId); // Assuming deleteDiseaseApi handles the API request to delete
            loadData();
        } catch (error) {
            console.error('Error deleting disease:', error);
            Alert.alert('Error', 'Failed to delete disease.');
        }
    };

    // Delete Meal Plan
    const handleDeleteMealPlan = async (mealPlanId) => {
        try {
            await deleteMealPlan(mealPlanId); // Assuming deleteMealPlanApi handles the API request to delete
            loadData();
        } catch (error) {
            console.error('Error deleting meal plan:', error);
            Alert.alert('Error', 'Failed to delete meal plan.');
        }
    };

    // Modal for Create/Update
    const openModalForCreateDisease = () => {
        setIsEditMode(false);
        setModalVisible(true);
    };

    const openModalForUpdateDisease = (disease) => {
        setIsEditMode(true);
        setSelectedDisease(disease);
        setDiseaseName(disease.disease_name);
        setDiseaseDescription(disease.description);
        setStageName(disease.stage_name);
        setStageDescription(disease.stage_description);
        setStageNameId(disease.stage_name_id);
        setModalVisible(true);
    };

    const openModalForCreateMealPlan = () => {
        setIsEditMode(false);
        setModalVisible(true);
    };

    const openModalForUpdateMealPlan = (mealPlan) => {
        setIsEditMode(true);
        setSelectedMealPlan(mealPlan);
        setMealPlanData({
            diseaseId: mealPlan.disease_id.toString(),
            stageName: mealPlan.stage_name,
            calories: mealPlan.caloric_goal.toString(),
            protein: mealPlan.protein_goal.toString(),
            carbs: mealPlan.carbs_goal.toString(),
            fats: mealPlan.fats_goal.toString(),
            fiber: mealPlan.fiber_goal.toString(),
            satFat: mealPlan.sat_fat_goal.toString()
        });
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meal Plan Management</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#2196F3" />
            ) : (
                <>
                    {/* Diseases Section */}
                    <Text style={styles.subtitle}>Diseases</Text>
                    <FlatList
                        data={diseases}
                        keyExtractor={(item) => item.disease_id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <Text style={styles.itemTitle}>{item.disease_name}</Text>
                                <Text>{item.description}</Text>
                                <TouchableOpacity onPress={() => openModalForUpdateDisease(item)} style={styles.updateButton}>
                                    <Text style={styles.buttonText}>Update</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDeleteDisease(item.disease_id)} style={styles.deleteButton}>
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    <TouchableOpacity onPress={openModalForCreateDisease} style={styles.addButton}>
                        <Text style={styles.buttonText}>Add Disease</Text>
                    </TouchableOpacity>

                    {/* Meal Plans Section */}
                    <Text style={styles.subtitle}>Meal Plans</Text>
                    <FlatList
                        data={mealPlans}
                        keyExtractor={(item) => item.plan_id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <Text style={styles.itemTitle}>{item.stage_name}</Text>
                                <Text>Caloric Goal: {item.caloric_goal}</Text>
                                <Text>Protein Goal: {item.protein_goal}</Text>
                                <TouchableOpacity onPress={() => openModalForUpdateMealPlan(item)} style={styles.updateButton}>
                                    <Text style={styles.buttonText}>Update</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDeleteMealPlan(item.plan_id)} style={styles.deleteButton}>
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    <TouchableOpacity onPress={openModalForCreateMealPlan} style={styles.addButton}>
                        <Text style={styles.buttonText}>Add Meal Plan</Text>
                    </TouchableOpacity>
                </>
            )}

            {/* Modal */}
            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{isEditMode ? 'Update' : 'Create'} Disease</Text>
                    <TextInput
                        placeholder="Disease Name"
                        value={diseaseName}
                        onChangeText={setDiseaseName}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Disease Description"
                        value={diseaseDescription}
                        onChangeText={setDiseaseDescription}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Stage Name"
                        value={stageName}
                        onChangeText={setStageName}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Stage Description"
                        value={stageDescription}
                        onChangeText={setStageDescription}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Stage Name ID"
                        value={stageNameId}
                        onChangeText={setStageNameId}
                        style={styles.input}
                    />

                    <Button
                        title={isEditMode ? 'Update Disease' : 'Create Disease'}
                        onPress={isEditMode ? handleUpdateDisease : handleCreateDisease}
                    />
                    <Button title="Close" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 20,
        marginTop: 16,
    },
    item: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
    },
    itemTitle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    updateButton: {
        backgroundColor: '#4CAF50',
        padding: 8,
        borderRadius: 4,
        marginTop: 8,
    },
    deleteButton: {
        backgroundColor: '#F44336',
        padding: 8,
        borderRadius: 4,
        marginTop: 8,
    },
    addButton: {
        backgroundColor: '#2196F3',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        width: '100%',
        padding: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#ddd',
    },
});

export default MealPlanTarget;
