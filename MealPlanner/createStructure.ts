import * as fs from 'fs';
import * as path from 'path';

const components = [
  'RegistrationScreen.tsx',
  'LoginScreen.tsx',
  'ProfileScreen.tsx',
  'EditProfileScreen.tsx',
  'MealPlanListScreen.tsx',
  'MealPlanDetailScreen.tsx',
  'EditMealPlanScreen.tsx',
  'FeedbackScreen.tsx',
  'FoodLogScreen.tsx',
  'NutritionAnalysisScreen.tsx',
  'ProgressTrackingScreen.tsx',
  'PatientListScreen.tsx',
  'PatientProgressScreen.tsx',
  'MessagingScreen.tsx',
  'ReminderSettingsScreen.tsx',
  'NotificationScreen.tsx'
];

const services = ['api.js'];

// Function to create directory if it doesn't exist
function createDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);
  } else {
    console.log(`Directory already exists: ${dirPath}`);
  }
}

// Function to create files in the specified directory
function createFiles(dirPath: string, files: string[]) {
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, `// ${file} content will go here\n`);
      console.log(`File created: ${filePath}`);
    } else {
      console.log(`File already exists: ${filePath}`);
    }
  });
}

// Main function to create the structure
function createProjectStructure() {
  // Create components directory
  const componentsDir = path.join(__dirname, 'src', 'components');
  createDir(componentsDir);
  createFiles(componentsDir, components);

  // Create services directory
  const servicesDir = path.join(__dirname, 'src', 'services');
  createDir(servicesDir);
  createFiles(servicesDir, services);
}

createProjectStructure();
