from flask import Blueprint, request, jsonify
from ..models.NutritionAnalysis import NutritionAnalysis
from ..db import db
from ..models.users import User
from ..models.meal_plans import MealPlan
from ..models.foodlog import FoodLog
from ..models.User_Meal_Plan import UserMealPlan
from datetime import date, timedelta
from sqlalchemy import func

bp = Blueprint('nutritionalanalysis', __name__)

@bp.route('/generate', methods=['POST'])
def generate_nutritional_analysis():
    try:
        # Get user_id from the request
        user_id = request.json.get('user_id')

        # Validate input
        if not user_id:
            return jsonify({'error': 'Missing user_id'}), 400

        # Fetch the latest stage_name for the user from UserMealPlan
        user_meal_plan = UserMealPlan.query.filter_by(user_id=user_id).first()
        if not user_meal_plan:
            return jsonify({'error': 'User meal plan not found'}), 404

        stage_name = user_meal_plan.stage_name

        # Fetch user's disease ID
        user = User.query.filter_by(user_id=user_id).first()
        if not user or not user.disease_id:
            return jsonify({'error': 'User or associated disease not found'}), 404

        disease_id = user.disease_id

        # Fetch meal plan targets for the user's disease and stage
        meal_plan = MealPlan.query.filter_by(disease_id=disease_id, stage_name=stage_name).first()
        if not meal_plan:
            return jsonify({'error': 'Meal plan for the specified stage not found'}), 404

        # Current date
        today = date.today()

        # Aggregate daily logs
        daily_logs = db.session.query(
            func.sum(FoodLog.calories).label('daily_calories'),
            func.sum(FoodLog.protein).label('daily_protein'),
            func.sum(FoodLog.carbs).label('daily_carbs'),
            func.sum(FoodLog.fats).label('daily_fats'),
            func.sum(FoodLog.fiber).label('daily_fiber'),
            func.sum(FoodLog.sat_fat).label('daily_sat_fat')
        ).filter(FoodLog.user_id == user_id, FoodLog.log_date == today).first()

        if not any(daily_logs):
            return jsonify({'error': 'No food logs for today found'}), 404

        # Calculate monthly and yearly aggregates
        start_of_month = today.replace(day=1)
        start_of_year = today.replace(month=1, day=1)

        monthly_logs = db.session.query(
            func.sum(FoodLog.calories).label('monthly_calories'),
            func.sum(FoodLog.protein).label('monthly_protein'),
            func.sum(FoodLog.carbs).label('monthly_carbs'),
            func.sum(FoodLog.fats).label('monthly_fats'),
            func.sum(FoodLog.fiber).label('monthly_fiber'),
            func.sum(FoodLog.sat_fat).label('monthly_sat_fat')
        ).filter(
            FoodLog.user_id == user_id,
            FoodLog.log_date >= start_of_month,
            FoodLog.log_date <= today
        ).first()

        yearly_logs = db.session.query(
            func.sum(FoodLog.calories).label('yearly_calories'),
            func.sum(FoodLog.protein).label('yearly_protein'),
            func.sum(FoodLog.carbs).label('yearly_carbs'),
            func.sum(FoodLog.fats).label('yearly_fats'),
            func.sum(FoodLog.fiber).label('yearly_fiber'),
            func.sum(FoodLog.sat_fat).label('yearly_sat_fat')
        ).filter(
            FoodLog.user_id == user_id,
            FoodLog.log_date >= start_of_year,
            FoodLog.log_date <= today
        ).first()

        # Insert data into the NutritionAnalysis table
        analysis_entry = NutritionAnalysis(
            user_id=user_id,
            log_date=today,
            daily_calories=daily_logs.daily_calories,
            daily_protein=daily_logs.daily_protein,
            daily_carbs=daily_logs.daily_carbs,
            daily_fats=daily_logs.daily_fats,
            daily_fiber=daily_logs.daily_fiber,
            daily_sat_fat=daily_logs.daily_sat_fat,
            monthly_calories=monthly_logs.monthly_calories,
            monthly_protein=monthly_logs.monthly_protein,
            monthly_carbs=monthly_logs.monthly_carbs,
            monthly_fats=monthly_logs.monthly_fats,
            monthly_fiber=monthly_logs.monthly_fiber,
            monthly_sat_fat=monthly_logs.monthly_sat_fat,
            yearly_calories=yearly_logs.yearly_calories,
            yearly_protein=yearly_logs.yearly_protein,
            yearly_carbs=yearly_logs.yearly_carbs,
            yearly_fats=yearly_logs.yearly_fats,
            yearly_fiber=yearly_logs.yearly_fiber,
            yearly_sat_fat=yearly_logs.yearly_sat_fat
        )

        db.session.add(analysis_entry)
        db.session.commit()

        return jsonify({'message': 'Nutritional analysis generated successfully'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'An error occurred', 'details': str(e)}), 500
    

@bp.route('/', methods=['POST'])
def get_nutrition_analysis():
    try:
        # Get the user_id from the request
        user_id = request.json.get('user_id')
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400

        # Fetch user details
        user = User.query.filter_by(user_id=user_id).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Fetch user's disease and stage information
        user_meal_plan = UserMealPlan.query.filter_by(user_id=user_id).first()
        if not user_meal_plan:
            return jsonify({'error': 'UserMealPlan not found for this user'}), 404

        stage_name = user_meal_plan.stage_name
        disease_id = user.disease_id

        # Get meal plan targets
        meal_plan = MealPlan.query.filter_by(disease_id=disease_id, stage_name=stage_name).first()
        if not meal_plan:
            return jsonify({'error': 'MealPlan not found for the user\'s stage and disease'}), 404

        daily_targets = {
            'calories': float(meal_plan.caloric_goal),
            'protein': float(meal_plan.protein_goal),
            'carbs': float(meal_plan.carbs_goal),
            'fats': float(meal_plan.fats_goal),
            'fiber': float(meal_plan.fiber_goal),
            'sat_fat': float(meal_plan.sat_fat_goal),
        }
        monthly_targets = {key: value * 30 for key, value in daily_targets.items()}
        yearly_targets = {key: value * 365 for key, value in daily_targets.items()}

        # Fetch nutrition analysis data
        nutrition_analysis = (
            NutritionAnalysis.query
            .filter_by(user_id=user_id)
            .filter(NutritionAnalysis.log_date <= date.today())
            .order_by(NutritionAnalysis.log_date.desc())
            .all()
        )

        if not nutrition_analysis:
            return jsonify({'error': 'No nutrition analysis data found for the user'}), 404

        # Serialize the data
        serialized_data = [
            {
                'log_date': str(na.log_date),
                'calories': na.daily_calories,
                'protein': na.daily_protein,
                'carbs': na.daily_carbs,
                'fats': na.daily_fats,
                'fiber': na.daily_fiber,
                'sat_fat': na.daily_sat_fat,
            }
            for na in nutrition_analysis
        ]

        # Split data based on timeframes
        daily_data = [entry for entry in serialized_data if entry['log_date'] == str(date.today())] or []
        monthly_data = [entry for entry in serialized_data if entry['log_date'] >= str(date.today().replace(day=1))] or []
        yearly_data = [entry for entry in serialized_data if entry['log_date'].startswith(str(date.today().year))] or []

        # Build response
        response = {
            'daily': {'data': daily_data, 'targets': daily_targets},
            'monthly': {'data': monthly_data, 'targets': monthly_targets},
            'yearly': {'data': yearly_data, 'targets': yearly_targets},
        }
        return jsonify(response), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
