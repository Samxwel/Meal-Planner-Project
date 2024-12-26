import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons'; // Icons for stars
import { submitFeedback } from '../services/api'; // Import submitFeedback function

const FeedbackScreen = () => {
  const [feedback, setFeedback] = useState('');
  const [mealSatisfaction, setMealSatisfaction] = useState(0);
  const [appExperience, setAppExperience] = useState(0);
  const [recommendation, setRecommendation] = useState(0);
  const [userId, setUserId] = useState(null); // State for userId

  // Handle star rating
  const handleRating = (setter: React.Dispatch<React.SetStateAction<number>>, rate: number) => {
    setter(rate);
  };

  // Fetch user ID from AsyncStorage when the component mounts
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId); // Set the userId state if found
        } else {
          console.error('User ID not found');
        }
      } catch (error) {
        console.error('Error fetching user ID from AsyncStorage:', error);
      }
    };
    fetchUserId();
  }, []);

  // Function to submit feedback
  const handleSubmitFeedback = async () => {
    if (!userId) {
      alert('User not authenticated. Please log in.');
      return;
    }

    const feedbackData = {
      user_id: userId,
      meal_satisfaction: mealSatisfaction,
      app_experience: appExperience,
      recommendation: recommendation,
      feedback_text: feedback,
    };

    try {
      const response = await submitFeedback(feedbackData);
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error.response.data);
      alert('Failed to submit feedback');
    }
  };

  return (
    <ImageBackground 
      source={{uri: 'https://i.imgur.com/qkdpN.jpg'}}  // Background image for more visual appeal
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>We Value Your Feedback</Text>

        {/* Question 1: Satisfaction with the Meal Plan */}
        <View style={styles.card}>
          <Text style={styles.questionText}>How satisfied are you with your meal plan?</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleRating(setMealSatisfaction, star)}>
                <FontAwesome
                  name={star <= mealSatisfaction ? 'star' : 'star-o'}
                  size={32}
                  color="#ffa726"
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Question 2: App Experience */}
        <View style={styles.card}>
          <Text style={styles.questionText}>How would you rate your overall app experience?</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleRating(setAppExperience, star)}>
                <FontAwesome
                  name={star <= appExperience ? 'star' : 'star-o'}
                  size={32}
                  color="#ffa726"
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Question 3: Likelihood of Recommending */}
        <View style={styles.card}>
          <Text style={styles.questionText}>How likely are you to recommend this app to others?</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleRating(setRecommendation, star)}>
                <FontAwesome
                  name={star <= recommendation ? 'star' : 'star-o'}
                  size={32}
                  color="#ffa726"
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Text Input for Detailed Feedback */}
        <View style={styles.card}>
          <Text style={styles.questionText}>Tell us more about your experience</Text>
          <TextInput
            style={styles.input}
            placeholder="Write your feedback here (e.g., suggestions, problems, what you liked)..."
            value={feedback}
            onChangeText={(text) => setFeedback(text)}
            multiline={true}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitFeedback}>
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  star: {
    marginHorizontal: 5,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#ffa726',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default FeedbackScreen;
