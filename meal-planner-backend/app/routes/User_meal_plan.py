from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from ..models.User_Meal_Plan import UserMealPlan
from app.db import db



bp = Blueprint('user_meal_plan', __name__)

from sqlalchemy.sql import func

@bp.route('/save', methods=['POST'])
def save_user_meal_plan():
    data = request.json
    user_id = data.get('user_id')
    stage_name = data.get('stage_name')  # Retrieve stage_name from the request
    meal_plan = data.get('meal_plan')  # JSON for the week
    start_date = datetime.strptime(data.get('start_date'), '%Y-%m-%d').date()

    if not user_id or not meal_plan or not start_date or not stage_name:
        return jsonify({'error': 'Missing required data'}), 400

    try:
        # Delete existing meals for the user and stage_name from the given start_date
        existing_meals = UserMealPlan.query.filter_by(user_id=user_id, stage_name=stage_name).filter(UserMealPlan.log_date >= start_date).all()
        for meal in existing_meals:
            db.session.delete(meal)
        db.session.commit()

        # Save the new meal plan
        for day_index, (day_key, daily_meals) in enumerate(meal_plan.items()):
            log_date = start_date + timedelta(days=day_index)

            for meal_type, meals in daily_meals.items():
                for meal in meals:
                    user_meal = UserMealPlan(
                        user_id=user_id,
                        stage_name=stage_name,  # Save the stage_name
                        day=day_key,  # Save the day
                        meal_name=meal['name'],
                        meal_type=meal_type,
                        calories=meal['calories'],
                        protein=meal['protein'],
                        carbs=meal['carbs'],
                        fats=meal['fat'],
                        fiber=meal['fiber'],
                        sat_fat=meal['sat_fat'],
                        grams=meal['grams'],
                        measure=meal['measure'],
                        log_date=log_date
                    )
                    db.session.add(user_meal)

        db.session.commit()
        return jsonify({'message': 'Meal plan saved successfully'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/check_stage', methods=['GET'])
def check_stage():
    # Retrieve the user_id and stage_name from the request
    user_id = request.args.get('user_id')
    stage_name = request.args.get('stage_name')
    
    if not user_id or not stage_name:
        return jsonify({'error': 'User ID and Stage Name are required'}), 400
    
    # Check if there's an existing meal plan for the user and stage
    existing_stage = UserMealPlan.query.filter_by(user_id=user_id, stage_name=stage_name).first()
    
    if existing_stage:
        return jsonify({'stage_exists': True, 'message': f'Meal plan for stage {stage_name} already exists'}), 200
    else:
        return jsonify({'stage_exists': False, 'message': f'No meal plan found for stage {stage_name}'}), 200
    
@bp.route('/exist_mealplan', methods=['GET'])
def get_user_meal_plan():
    user_id = request.args.get('user_id')
    stage_name = request.args.get('stage_name')

    if not user_id or not stage_name:
        return jsonify({"error": "Missing user_id or stage_name"}), 400

    try:
        # Fetch meal plan for the user and stage
        meal_plan = UserMealPlan.query.filter_by(user_id=user_id, stage_name=stage_name).all()
        if not meal_plan:
            return jsonify({"error": "No meal plan found for the given stage"}), 404

        # Initialize a dictionary for all days
        days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        formatted_plan = {day: {} for day in days_of_week}

        # Format response
        for meal in meal_plan:
            day = meal.day
            if day not in formatted_plan:
                formatted_plan[day] = {}
            if meal.meal_type not in formatted_plan[day]:
                formatted_plan[day][meal.meal_type] = []
            formatted_plan[day][meal.meal_type].append({
                "meal_name": meal.meal_name,
                "calories": meal.calories,
                "protein": meal.protein,
                "carbs": meal.carbs,
                "fats": meal.fats,
                "fiber": meal.fiber,
                "sat_fat": meal.sat_fat,
                "grams": meal.grams,
                "measure": meal.measure
            })

        return jsonify(formatted_plan), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@bp.route('/<int:user_id>', methods=['GET'])
def get_user_meal_plan_Nutritionist(user_id):
    try:
        user_meal_plans = UserMealPlan.query.filter_by(user_id=user_id).all()
        if not user_meal_plans:
            return jsonify({'message': 'No meal plans found for this user'}), 200

        results = [
            {
                'id': plan.id,
                'stage_name': plan.stage_name,
                'day': plan.day,
                'meal_name': plan.meal_name,
                'meal_type': plan.meal_type,
                'calories': plan.calories,
                'protein': plan.protein,
                'carbs': plan.carbs,
                'fats': plan.fats,
                'fiber': plan.fiber,
                'sat_fat': plan.sat_fat,
                'grams': plan.grams,
                'measure': plan.measure,
                'log_date': plan.log_date.strftime('%Y-%m-%d'),
            }
            for plan in user_meal_plans
        ]

        return jsonify(results), 200
    except Exception as e:
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500
