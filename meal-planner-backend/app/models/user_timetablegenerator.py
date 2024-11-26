from flask import jsonify
from sqlalchemy.sql import func
from models import Disease, MealPlan, FoodItem  # Import your models

def generate_meal_plan(stagenameid):
    # Step 1: Retrieve disease and meal plan info based on stagenameid
    disease = Disease.query.filter_by(stage_name_id=stagenameid).first()
    if not disease:
        return jsonify({'error': 'Disease not found for the provided stagenameid'}), 404
    
    # Fetch related meal plan using disease_id and stage_name
    meal_plan = MealPlan.query.filter_by(disease_id=disease.disease_id, stage_name=disease.stage_name).first()
    if not meal_plan:
        return jsonify({'error': 'Meal plan not found for the disease stage'}), 404

    # Nutritional goals from meal plan
    caloric_goal = meal_plan.caloric_goal
    protein_goal = meal_plan.protein_goal
    carbs_goal = meal_plan.carbs_goal
    fats_goal = meal_plan.fats_goal
    fiber_goal = meal_plan.fiber_goal
    sat_fat_goal = meal_plan.sat_fat_goal

    # Step 2: Select food items for each meal type (breakfast, lunch, dinner, snacks)
    days_of_week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    generated_meals = {}
    for day in days_of_week:  # Loop through each day of the week
        daily_meals = {}
        
        # Calculate for each meal type
        for meal_type in ['breakfast', 'lunch', 'dinner', 'snacks']:
            # Query food items for this meal type (add any meal type logic or categorization here)
            food_items = FoodItem.query.filter_by(food_type=meal_type).all()

            selected_foods = []
            daily_nutrients = {
                'calories': 0,
                'protein': 0,
                'carbs': 0,
                'fats': 0,
                'fiber': 0,
                'sat_fat': 0,
            }

            # Select foods while checking nutritional values
            for food in food_items:
                if (daily_nutrients['calories'] + food.calories <= caloric_goal and
                    daily_nutrients['protein'] + food.protein <= protein_goal and
                    daily_nutrients['carbs'] + food.carbs <= carbs_goal and
                    daily_nutrients['fats'] + food.fat <= fats_goal and
                    daily_nutrients['fiber'] + food.fiber <= fiber_goal and
                    daily_nutrients['sat_fat'] + food.sat_fat <= sat_fat_goal):
                    
                    selected_foods.append({
                        'name': food.name,
                        'measure': food.measure,
                        'grams': float(food.grams),
                        'calories': float(food.calories),
                        'protein': float(food.protein),
                        'carbs': float(food.carbs),
                        'fiber': float(food.fiber),
                        'fat': float(food.fat),
                        'sat_fat': float(food.sat_fat),
                    })

                    # Update daily nutrient totals
                    daily_nutrients['calories'] += food.calories
                    daily_nutrients['protein'] += food.protein
                    daily_nutrients['carbs'] += food.carbs
                    daily_nutrients['fats'] += food.fat
                    daily_nutrients['fiber'] += food.fiber
                    daily_nutrients['sat_fat'] += food.sat_fat

            daily_meals[meal_type] = selected_foods

        # Add daily meals to the week
        generated_meals[day] = daily_meals

    # Step 3: Return the generated meals as JSON
    return jsonify(generated_meals)

 