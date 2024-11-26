import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const EditMealPlanScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Meal Plan</Text>
      <TextInput placeholder="Meal Plan Name" style={styles.input} />
      {/* Other input fields for serving sizes, etc. */}
      <Button title="Save Changes" onPress={() => {/* Save logic here */}} />
      <Button title="Cancel" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});

export default EditMealPlanScreen;
