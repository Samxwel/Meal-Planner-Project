import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getUser, updateUser } from '../services/api'; // Import the API functions

const EditProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get userId from AsyncStorage
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          // Fetch user details using the userId
          const fetchedUser = await getUser(userId);
          setUser(fetchedUser); // Store user data in state
        } else {
          setError('User ID not found.');
        }
      } catch (error) {
        setError('Error fetching user data.');
      } finally {
        setLoading(false); // Done loading
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return <View><Text>Loading...</Text></View>;
  }

  if (error) {
    return <View><Text>{error}</Text></View>;
  }

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
    age: Yup.number().optional(),
    gender: Yup.string().oneOf(['male', 'female', 'other'], 'Invalid gender').optional(),
    height_cm: Yup.number().optional(),
    weight_kg: Yup.number().optional(),
    activity_level: Yup.string().oneOf(['low', 'moderate', 'high'], 'Invalid activity level').optional(),
  });

  const handleUpdate = async (values) => {
    try {
      // Call the updateUser API to update the user profile
      await updateUser(user.user_id, values);
      console.log('User profile updated:', values);
      navigation.goBack(); // Go back to the previous screen
    } catch (error) {
      setError('Error updating user profile.');
    }
  };

  return (
    <Formik initialValues={user} validationSchema={validationSchema} onSubmit={handleUpdate}>
      {({ handleChange, handleSubmit, values }) => (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            onChangeText={handleChange('name')}
            value={values.name}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={handleChange('email')}
            value={values.email}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={handleChange('password')}
            value={values.password}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            onChangeText={handleChange('age')}
            value={String(values.age)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Gender"
            onChangeText={handleChange('gender')}
            value={values.gender}
          />
          <TextInput
            style={styles.input}
            placeholder="Height (cm)"
            onChangeText={handleChange('height_cm')}
            value={String(values.height_cm)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Weight (kg)"
            onChangeText={handleChange('weight_kg')}
            value={String(values.weight_kg)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Activity Level"
            onChangeText={handleChange('activity_level')}
            value={values.activity_level}
          />
          <Button title="Save Changes" onPress={handleSubmit} />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#f9f9f9' },
  input: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 8, marginBottom: 12 },
});

export default EditProfileScreen;
