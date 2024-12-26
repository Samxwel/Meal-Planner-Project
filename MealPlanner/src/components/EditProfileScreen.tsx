import React, { useEffect, useState } from 'react';
import { 
  View, 
  TextInput, 
  Button, 
  StyleSheet, 
  Text, 
  ScrollView, 
  Alert, 
  Modal, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getUser, updateUser } from '../services/api';

const EditProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const diseaseOptions = [
    { id: 1, name: 'Diabetes' },
    { id: 2, name: 'Heart Disease' },
    { id: 3, name: 'Obesity' },
    { id: 4, name: 'Hypertension' },
    { id: 5, name: 'Chronic Kidney Disease' },
    { id: 6, name: 'Celiac Disease' },
    { id: 7, name: 'Irritable Bowel Syndrome' },
    { id: 8, name: 'Hyperlipidemia' },
    { id: 9, name: 'Cancer' },
    { id: 10, name: 'Liver Disease' }
  ];

  const initialFormValues = {
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    height_cm: '',
    weight_kg: '',
    activity_level: '',
    disease_id: ''
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          throw new Error('No user ID found');
        }
        const fetchedUser = await getUser(userId);
        setUser({
          ...initialFormValues,
          ...fetchedUser,
          password: '',
        });
      } catch (error) {
        console.error('Error loading user data:', error);
        Alert.alert('Error', 'Failed to load user data');
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    age: Yup.number().positive('Age must be a positive number').integer('Age must be an integer').nullable(),
    gender: Yup.string().oneOf(['male', 'female', 'other'], 'Invalid gender'),
    height_cm: Yup.number().positive('Height must be a positive number').nullable(),
    weight_kg: Yup.number().positive('Weight must be a positive number').nullable(),
    activity_level: Yup.string().oneOf(['low', 'moderate', 'high'], 'Invalid activity level'),
    disease_id: Yup.number().required('Please select a disease')
  });

  const handleUpdate = async (values, { setSubmitting, setErrors }) => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('User ID not found');
      await updateUser(userId, values);
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Update Error:', error);
      if (error.name === 'ValidationError') {
        const errorMap = {};
        error.inner.forEach(err => {
          errorMap[err.path] = err.message;
        });
        setErrors(errorMap);
      }
      Alert.alert('Update Failed', error.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Formik
        initialValues={user || initialFormValues}
        validationSchema={validationSchema}
        onSubmit={handleUpdate}
        enableReinitialize
      >
        {({ 
          handleChange, 
          handleSubmit, 
          values, 
          errors, 
          touched,
          isSubmitting,
          setFieldValue 
        }) => (
          <View>
            <TextInput
              style={[styles.input, touched.name && errors.name && styles.errorInput]}
              placeholder="Name"
              onChangeText={handleChange('name')}
              value={values.name}
            />
            {touched.name && errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}

            <TextInput
              style={[styles.input, touched.email && errors.email && styles.errorInput]}
              placeholder="Email"
              onChangeText={handleChange('email')}
              value={values.email}
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <TextInput
              style={[styles.input, touched.password && errors.password && styles.errorInput]}
              placeholder="Password"
              secureTextEntry
              onChangeText={handleChange('password')}
              value={values.password}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TextInput
              style={[styles.input, touched.age && errors.age && styles.errorInput]}
              placeholder="Age"
              keyboardType="numeric"
              onChangeText={handleChange('age')}
              value={values.age}
            />
            {touched.age && errors.age && (
              <Text style={styles.errorText}>{errors.age}</Text>
            )}

            <TextInput
              style={[styles.input, touched.gender && errors.gender && styles.errorInput]}
              placeholder="Gender (male, female, other)"
              onChangeText={handleChange('gender')}
              value={values.gender}
            />
            {touched.gender && errors.gender && (
              <Text style={styles.errorText}>{errors.gender}</Text>
            )}

            <TextInput
              style={[styles.input, touched.height_cm && errors.height_cm && styles.errorInput]}
              placeholder="Height (cm)"
              keyboardType="numeric"
              onChangeText={handleChange('height_cm')}
              value={values.height_cm}
            />
            {touched.height_cm && errors.height_cm && (
              <Text style={styles.errorText}>{errors.height_cm}</Text>
            )}

            <TextInput
              style={[styles.input, touched.weight_kg && errors.weight_kg && styles.errorInput]}
              placeholder="Weight (kg)"
              keyboardType="numeric"
              onChangeText={handleChange('weight_kg')}
              value={values.weight_kg}
            />
            {touched.weight_kg && errors.weight_kg && (
              <Text style={styles.errorText}>{errors.weight_kg}</Text>
            )}

            <TextInput
              style={[styles.input, touched.activity_level && errors.activity_level && styles.errorInput]}
              placeholder="Activity Level (low, moderate, high)"
              onChangeText={handleChange('activity_level')}
              value={values.activity_level}
            />
            {touched.activity_level && errors.activity_level && (
              <Text style={styles.errorText}>{errors.activity_level}</Text>
            )}

            {/* Custom Dropdown for Disease */}
            <TouchableOpacity
              style={[styles.input, styles.dropdown]}
              onPress={() => setDropdownVisible(true)}
            >
              <Text>
                {values.disease_id 
                  ? diseaseOptions.find((d) => d.id === values.disease_id)?.name 
                  : 'Select a Disease'}
              </Text>
            </TouchableOpacity>
            {touched.disease_id && errors.disease_id && (
              <Text style={styles.errorText}>{errors.disease_id}</Text>
            )}

            {/* Modal for Dropdown */}
            <Modal
              visible={isDropdownVisible}
              transparent={true}
              animationType="slide"
            >
              <View style={styles.modalContainer}>
                <FlatList
                  data={diseaseOptions}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFieldValue('disease_id', item.id);
                        setDropdownVisible(false);
                      }}
                    >
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </Modal>

            <Button
              title="Save Changes"
              onPress={handleSubmit}
              disabled={isSubmitting}
            />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 16, backgroundColor: '#f9f9f9' },
  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  input: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: 'white' },
  errorInput: { borderColor: 'red' },
  errorText: { color: 'red', marginBottom: 10, marginLeft: 10 },
  dropdown: { justifyContent: 'center' },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  dropdownItem: { padding: 16, backgroundColor: 'white', marginBottom: 1 }
});

export default EditProfileScreen;