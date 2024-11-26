export const patientData = {
    name: "John Doe",
    disease: "Diabetes",
    stage: { name: "Stage 2", description: "Moderate symptoms with controlled medication" },
    personalDetails: {
      email: "johndoe@example.com",
      age: 45,
      gender: "Male",
    },
    nutritionalAnalysis: [
      { day: "Monday", calories: 1800, protein: 60, carbs: 250, fats: 50 },
      { day: "Tuesday", calories: 1700, protein: 65, carbs: 230, fats: 55 },
      // Mock data for other days
    ],
    foodLogs: [
      { meal: "Breakfast", item: "Oats", portion: "50g", calories: 150 },
      { meal: "Lunch", item: "Grilled Chicken", portion: "200g", calories: 400 },
      // More logs...
    ],
    progressTracking: {
      weight: [75, 74.5, 74, 73.5],
      bloodPressure: [120, 122, 118, 115],
      sugarLevel: [140, 135, 130, 128],
    },
    feedback: "The meal plan has been effective in controlling my sugar levels.",
  };
  