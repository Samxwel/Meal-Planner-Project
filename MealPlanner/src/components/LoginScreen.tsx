import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginScreen = ({ navigation }) => {
  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });

  const handleLogin = async (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    try {
      const response = await loginUser(values);
      if (response.status === 200) {
        const { userId, role } = response.data; // Adjust based on your API response
        console.log('User ID:', userId); // Log the user ID

        // Store the userId in AsyncStorage
        await AsyncStorage.setItem('userId', JSON.stringify(userId)); // Assuming userId is a string

        // Navigate based on the role
        navigation.navigate(role === 'nutritionist' ? 'NutritionistHomeScreen' : 'Home');
      } else {
        Alert.alert('Login failed', 'Invalid credentials, please try again.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred during login.';
      Alert.alert('Error', errorMessage);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleLogin}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            keyboardType="email-address"
          />
          {errors.email && touched.email && <Text style={styles.error}>{errors.email}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            secureTextEntry
          />
          {errors.password && touched.password && <Text style={styles.error}>{errors.password}</Text>}

          <Button title="Login" onPress={handleSubmit as any} disabled={isSubmitting} />

          {/* Register Button */}
          <Button
            title="Register"
            onPress={() => navigation.navigate('RegistrationScreen')} // Replace with your actual register screen route
            color="#007BFF" // Optional: Change the button color
          />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#f9f9f9' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#333' },
  input: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 12, backgroundColor: '#fff' },
  error: { fontSize: 12, color: 'red', marginBottom: 8 },
});

export default LoginScreen;
