from flask import Blueprint, request, jsonify
from ..models.food_items import FoodItem
from ..models.NutritionAnalysis import NutritionAnalysis
from ..models.foodlog import FoodLog
from ..db import db
import datetime

bp = Blueprint('food_items', __name__)

# Create a food item
@bp.route('/', methods=['POST'])
def create_food_item():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'measure', 'grams', 'calories', 'protein', 'carbs', 'fiber', 'fat', 'sat_fat', 'micronutrients', 'food_type']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    new_food_item = FoodItem(**data)
    db.session.add(new_food_item)
    db.session.commit()
    return jsonify(new_food_item.serialize()), 201

# Get all food items
@bp.route('/', methods=['GET'])
def get_food_items():
    food_items = FoodItem.query.all()
    return jsonify([item.serialize() for item in food_items]), 200

# Get a specific food item by ID
@bp.route('/<int:id>', methods=['GET'])
def get_food_item(id):
    food_item = FoodItem.query.get_or_404(id)
    return jsonify(food_item.serialize()), 200

# Update a food item
@bp.route('/nutrition/log-meal', methods=['POST'])
def log_meal():
    data = request.get_json()

    user_id = data.get('user_id')
    food_name = data.get('food_item')  # Food item name from frontend
    log_date = data.get('log_date')  # Date of the log entry

    # Fetch the food item nutrition details from the database
    food_item = FoodItem.query.filter_by(name=food_name).first()
    if not food_item:
        return jsonify({"error": "Food item not found"}), 404

    # Create a new FoodLog entry using the food item's serving size and nutrition info
    food_log = FoodLog(
        user_id=user_id,
        meal_name=food_name,
        meal_type=data.get('meal_time'),  # E.g., Breakfast, Lunch
        calories=food_item.calories,
        protein=food_item.protein,
        carbs=food_item.carbs,
        fats=food_item.fat,
        fiber=food_item.fiber,
        sat_fat=food_item.sat_fat,
        grams=food_item.grams,
        measure=food_item.measure,
        log_date=log_date
    )

    # Save the new entry to the database
    db.session.add(food_log)
    db.session.commit()

    return jsonify({"message": "Meal logged successfully", "food_log_id": food_log.log_id}), 201

# Delete a food item
@bp.route('/<int:id>', methods=['DELETE'])
def delete_food_item(id):
    food_item = FoodItem.query.get_or_404(id)
    db.session.delete(food_item)
    db.session.commit()
    return '', 204
