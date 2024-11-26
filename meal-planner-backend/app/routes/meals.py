from flask import Blueprint, request, jsonify
from app.models.meals import Meal
from app.models.food_items import FoodItem  # Assuming you have a FoodItem model
from app.models.meal_plans import MealPlan  # Assuming you have a MealPlan model
from app.models.meal_generation import generate_weekly_meals
from app.models.Diseases import Disease
from app.db import db
import random


bp = Blueprint('meals', __name__)

@bp.route('/', methods=['POST'])
def create_meals():
    # Call the meal generation function
    generate_weekly_meals(1)
    
    # Optionally, you can return a success message or the generated meals
    # Assuming meals are generated and committed to the database
    generated_meals = Meal.query.all()  # Fetch all meals if needed
    
    # Prepare the response data
    meals_data = [
        {
            'meal_id': meal.meal_id,
            'meal_name': meal.meal_name,
            'meal_type': meal.meal_type,
            'calories': str(meal.calories),
            'protein': str(meal.protein),
            'carbs': str(meal.carbs),
            'fats': str(meal.fats),
            'measure': meal.measure,
            'grams': str(meal.grams),
            'fiber': str(meal.fiber),
            'sat_fat': str(meal.sat_fat),
            'day': meal.day,
            'created_at': meal.created_at.isoformat()
        }
        for meal in generated_meals
    ]
    
    return jsonify({'status': 'success', 'meals': meals_data}), 201

# Get all meals
@bp.route('/<int:stage_name_id>', methods=['GET'])
def get_meal_plan(stage_name_id):
    # Step 1: Retrieve disease and meal plan info based on stage_name_id
    disease = Disease.query.filter_by(stage_name_id=stage_name_id).first()
    
    if not disease:
        return jsonify({'error': 'Disease not found for the provided stage_name_id'}), 404
    
    # Fetch related meal plan using disease_id and stage_name
    meal_plan = MealPlan.query.filter_by(disease_id=disease.disease_id, stage_name=disease.stage_name).first()
    if not meal_plan:
        return jsonify({'error': 'Meal plan not found for the disease stage'}), 404

    # Nutritional goals from meal plan
    daily_nutrition_limits = {
        'calories': meal_plan.caloric_goal,
        'protein': meal_plan.protein_goal,
        'carbs': meal_plan.carbs_goal,
        'fats': meal_plan.fats_goal,
        'fiber': meal_plan.fiber_goal,
        'sat_fat': meal_plan.sat_fat_goal
    }

    # Step 2: Generate meals for each day of the week
    generated_meals = {}
    days_of_week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    meal_types = ['breakfast', 'lunch', 'Supper', 'Snack']

    for day in days_of_week:  # Loop for days of the week
        daily_meals = {}

        # Initialize remaining nutritional limits for the day
        remaining_nutrition = daily_nutrition_limits.copy()

        for meal_type in meal_types:
            # Query food items for this meal type
            food_items = FoodItem.query.filter_by(food_type=meal_type).all()

            if not food_items:
                # No available food items for this meal type
                daily_meals[meal_type] = []
                continue

            # Shuffle to randomize selection
            random.shuffle(food_items)

            # Attempt to find at least one suitable food item
            selected_foods = []
            for food in food_items:
                if (remaining_nutrition['calories'] >= food.calories and
                    remaining_nutrition['protein'] >= food.protein and
                    remaining_nutrition['carbs'] >= food.carbs and
                    remaining_nutrition['fats'] >= food.fat and
                    remaining_nutrition['fiber'] >= food.fiber and
                    remaining_nutrition['sat_fat'] >= food.sat_fat):
                    # Suitable food found
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

                    # Update remaining nutritional limits
                    remaining_nutrition['calories'] -= food.calories
                    remaining_nutrition['protein'] -= food.protein
                    remaining_nutrition['carbs'] -= food.carbs
                    remaining_nutrition['fats'] -= food.fat
                    remaining_nutrition['fiber'] -= food.fiber
                    remaining_nutrition['sat_fat'] -= food.sat_fat
                    break  # Ensure at least one item is selected

            # If no suitable item was found, fallback to the closest match
            if not selected_foods:
                closest_food = min(
                    food_items,
                    key=lambda food: abs(food.calories - remaining_nutrition['calories'])
                )
                selected_foods.append({
                    'name': closest_food.name,
                    'measure': closest_food.measure,
                    'grams': float(closest_food.grams),
                    'calories': float(closest_food.calories),
                    'protein': float(closest_food.protein),
                    'carbs': float(closest_food.carbs),
                    'fiber': float(closest_food.fiber),
                    'fat': float(closest_food.fat),
                    'sat_fat': float(closest_food.sat_fat),
                })

            # Add the selected food(s) to the daily meals for this meal type
            daily_meals[meal_type] = selected_foods

        # Add daily meals to the week's meal plan
        generated_meals[day] = daily_meals

    # Step 3: Return the generated meals as JSON
    return jsonify(generated_meals)



# Get a specific meal by ID
@bp.route('/meals/<int:id>', methods=['GET'])
def get_meal(id):
    meal = Meal.query.get_or_404(id)
    return jsonify(meal.serialize()), 200

# Update a meal
@bp.route('/meals/<int:id>', methods=['PUT'])
def update_meal(id):
    meal = Meal.query.get_or_404(id)
    data = request.get_json()

    # Update the meal with new data
    for key, value in data.items():
        setattr(meal, key, value)
    
    db.session.commit()
    return jsonify(meal.serialize()), 200

# Delete a meal
@bp.route('/meals/<int:id>', methods=['DELETE'])
def delete_meal(id):
    meal = Meal.query.get_or_404(id)
    db.session.delete(meal)
    db.session.commit()
    return '', 204
