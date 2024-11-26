"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var components = [
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
var services = ['api.js'];
// Function to create directory if it doesn't exist
function createDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log("Directory created: ".concat(dirPath));
    }
    else {
        console.log("Directory already exists: ".concat(dirPath));
    }
}
// Function to create files in the specified directory
function createFiles(dirPath, files) {
    files.forEach(function (file) {
        var filePath = path.join(dirPath, file);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, "// ".concat(file, " content will go here\n"));
            console.log("File created: ".concat(filePath));
        }
        else {
            console.log("File already exists: ".concat(filePath));
        }
    });
}
// Main function to create the structure
function createProjectStructure() {
    // Create components directory
    var componentsDir = path.join(__dirname, 'src', 'components');
    createDir(componentsDir);
    createFiles(componentsDir, components);
    // Create services directory
    var servicesDir = path.join(__dirname, 'src', 'services');
    createDir(servicesDir);
    createFiles(servicesDir, services);
}
createProjectStructure();
