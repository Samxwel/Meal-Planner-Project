import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../services/api';

interface RegistrationFormValues {
  name: string;
  email: string;
  password: string;
  role: string;
  age: string;
  gender: string;
  height_cm: string;
  weight_kg: string;
  activity_level: string;
  disease_id: string;
}

const RegistrationScreen = ({ navigation }) => {
  const initialValues: RegistrationFormValues = {
    name: '',
    email: '',
    password: '',
    role: '',
    age: '',
    gender: '',
    height_cm: '',
    weight_kg: '',
    activity_level: '',
    disease_id: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
    role: Yup.string().oneOf(['patient', 'nutritionist']).required('Required'),
    age: Yup.number().positive().integer(),
    gender: Yup.string().oneOf(['male', 'female', 'other']),
    height_cm: Yup.number().positive(),
    weight_kg: Yup.number().positive(),
    activity_level: Yup.string().oneOf(['low', 'moderate', 'high']),
    disease_id: Yup.number().positive().integer(),
  });

  const handleRegister = async (
    values: RegistrationFormValues,
    { resetForm }: FormikHelpers<RegistrationFormValues>
  ) => {
    try {
      const response = await registerUser(values);
      if (response.status === 201) {
        Alert.alert('Success', 'Registration successful!', [
          { text: 'OK', onPress: () => navigation.navigate('LoginScreen') },
        ]);
        resetForm();
      }
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleRegister}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Register</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
          />
          {errors.name && touched.name && <Text style={styles.error}>{errors.name}</Text>}

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

          <TextInput
            style={styles.input}
            placeholder="Role (patient/nutritionist)"
            onChangeText={handleChange('role')}
            onBlur={handleBlur('role')}
            value={values.role}
          />
          {errors.role && touched.role && <Text style={styles.error}>{errors.role}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Age"
            onChangeText={handleChange('age')}
            onBlur={handleBlur('age')}
            value={values.age}
            keyboardType="numeric"
          />
          {errors.age && touched.age && <Text style={styles.error}>{errors.age}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Gender (male/female/other)"
            onChangeText={handleChange('gender')}
            onBlur={handleBlur('gender')}
            value={values.gender}
          />
          {errors.gender && touched.gender && <Text style={styles.error}>{errors.gender}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Height (cm)"
            onChangeText={handleChange('height_cm')}
            onBlur={handleBlur('height_cm')}
            value={values.height_cm}
            keyboardType="numeric"
          />
          {errors.height_cm && touched.height_cm && <Text style={styles.error}>{errors.height_cm}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Weight (kg)"
            onChangeText={handleChange('weight_kg')}
            onBlur={handleBlur('weight_kg')}
            value={values.weight_kg}
            keyboardType="numeric"
          />
          {errors.weight_kg && touched.weight_kg && <Text style={styles.error}>{errors.weight_kg}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Activity Level (low/moderate/high)"
            onChangeText={handleChange('activity_level')}
            onBlur={handleBlur('activity_level')}
            value={values.activity_level}
          />
          {errors.activity_level && touched.activity_level && (
            <Text style={styles.error}>{errors.activity_level}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Disease id"
            onChangeText={handleChange('disease_id')}
            onBlur={handleBlur('disease_id')}
            value={values.disease_id}
          />

          <Button title="Register" onPress={handleSubmit as any} />
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

export default RegistrationScreen;
