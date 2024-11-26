from flask import Blueprint, request, jsonify
from ..models.NutritionAnalysis import NutritionAnalysis
from ..db import db
from ..models.users import User
from ..models.meal_plans import MealPlan
from ..models.foodlog import FoodLog
from ..models.User_Meal_Plan import UserMealPlan
from datetime import date, timedelta
from sqlalchemy import func
from datetime import timedelta
from sqlalchemy import extract

bp = Blueprint('nutritionalanalysis', __name__)



@bp.route('/generate', methods=['POST'])
def generate_nutritional_analysis():
    try:
        # Get user_id from the request
        user_id = request.json.get('user_id')

        # Validate input
        if not user_id:
            return jsonify({'error': 'Missing user_id'}), 400

        # Fetch all food logs for the user
        food_logs = FoodLog.query.filter_by(user_id=user_id).order_by(FoodLog.log_date).all()
        if not food_logs:
            return jsonify({'error': 'No food logs found for the user'}), 404

        # Group logs by daily, weekly, and monthly timeframes
        daily_data = []
        weekly_data = {}
        monthly_data = {}

        start_date = food_logs[0].log_date
        current_date = date.today()
        total_days = (current_date - start_date).days + 1

        # Initialize week and month tracking
        week_num = 1
        last_week_start = start_date
        current_month = start_date.month

        # Iterate through logs to group by week and month
        for log in food_logs:
            day_of_week = log.log_date.strftime('%A')  # Get day name (e.g., "Monday")
            daily_data.append({
                'log_date': log.log_date,
                'day_variant': day_of_week,
                'calories': log.calories,
                'protein': log.protein,
                'carbs': log.carbs,
                'fats': log.fats,
                'fiber': log.fiber,
                'sat_fat': log.sat_fat
            })

            # Weekly grouping
            if (log.log_date - last_week_start).days >= 7:
                week_num += 1
                last_week_start = log.log_date
            if week_num not in weekly_data:
                weekly_data[week_num] = {'calories': [], 'protein': [], 'carbs': [], 'fats': [], 'fiber': [], 'sat_fat': []}
            weekly_data[week_num]['calories'].append(log.calories)
            weekly_data[week_num]['protein'].append(log.protein)
            weekly_data[week_num]['carbs'].append(log.carbs)
            weekly_data[week_num]['fats'].append(log.fats)
            weekly_data[week_num]['fiber'].append(log.fiber)
            weekly_data[week_num]['sat_fat'].append(log.sat_fat)

            # Monthly grouping
            if log.log_date.month != current_month:
                current_month = log.log_date.month
            if current_month not in monthly_data:
                monthly_data[current_month] = {'calories': [], 'protein': [], 'carbs': [], 'fats': [], 'fiber': [], 'sat_fat': []}
            monthly_data[current_month]['calories'].append(log.calories)
            monthly_data[current_month]['protein'].append(log.protein)
            monthly_data[current_month]['carbs'].append(log.carbs)
            monthly_data[current_month]['fats'].append(log.fats)
            monthly_data[current_month]['fiber'].append(log.fiber)
            monthly_data[current_month]['sat_fat'].append(log.sat_fat)

        # Calculate weekly averages
        weekly_averages = [
            {
                'week': f'Week {week}',
                'calories': sum(data['calories']) / len(data['calories']),
                'protein': sum(data['protein']) / len(data['protein']),
                'carbs': sum(data['carbs']) / len(data['carbs']),
                'fats': sum(data['fats']) / len(data['fats']),
                'fiber': sum(data['fiber']) / len(data['fiber']),
                'sat_fat': sum(data['sat_fat']) / len(data['sat_fat'])
            }
            for week, data in weekly_data.items()
        ]

        # Calculate monthly averages
        monthly_averages = [
            {
                'month': current_date.replace(month=month).strftime('%B'),
                'calories': sum(data['calories']) / len(data['calories']),
                'protein': sum(data['protein']) / len(data['protein']),
                'carbs': sum(data['carbs']) / len(data['carbs']),
                'fats': sum(data['fats']) / len(data['fats']),
                'fiber': sum(data['fiber']) / len(data['fiber']),
                'sat_fat': sum(data['sat_fat']) / len(data['sat_fat'])
            }
            for month, data in monthly_data.items()
        ]

        # Insert into NutritionAnalysis
        analysis_entries = []

        # Insert daily entries
        for daily_entry in daily_data:
            analysis_entries.append(
                NutritionAnalysis(
                    user_id=user_id,
                    log_date=daily_entry['log_date'],
                    timeframe='daily',
                    day_variant=daily_entry['day_variant'],
                    calories=daily_entry['calories'],
                    protein=daily_entry['protein'],
                    carbs=daily_entry['carbs'],
                    fats=daily_entry['fats'],
                    fiber=daily_entry['fiber'],
                    sat_fat=daily_entry['sat_fat']
                )
            )

        # Insert weekly entries
        for weekly_entry in weekly_averages:
            analysis_entries.append(
                NutritionAnalysis(
                    user_id=user_id,
                    log_date=current_date,  # Assign the current date for weekly summary
                    timeframe='weekly',
                    day_variant=weekly_entry['week'],  # "Week 1", "Week 2"
                    calories=weekly_entry['calories'],
                    protein=weekly_entry['protein'],
                    carbs=weekly_entry['carbs'],
                    fats=weekly_entry['fats'],
                    fiber=weekly_entry['fiber'],
                    sat_fat=weekly_entry['sat_fat']
                )
            )

        # Insert monthly entries
        for monthly_entry in monthly_averages:
            analysis_entries.append(
                NutritionAnalysis(
                    user_id=user_id,
                    log_date=current_date,  # Assign the current date for monthly summary
                    timeframe='monthly',
                    day_variant=monthly_entry['month'],  # "January", "February"
                    calories=monthly_entry['calories'],
                    protein=monthly_entry['protein'],
                    carbs=monthly_entry['carbs'],
                    fats=monthly_entry['fats'],
                    fiber=monthly_entry['fiber'],
                    sat_fat=monthly_entry['sat_fat']
                )
            )

        db.session.bulk_save_objects(analysis_entries)
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
        today = date.today()
        nutrition_analysis = (
            NutritionAnalysis.query
            .filter_by(user_id=user_id)
            .filter(NutritionAnalysis.log_date <= today)
            .order_by(NutritionAnalysis.log_date.desc())
            .all()
        )

        if not nutrition_analysis:
            return jsonify({'error': 'No nutrition analysis data found for the user'}), 404

        # Organize data into timeframes
        daily_data = [
            na.serialize() for na in nutrition_analysis if na.timeframe == 'daily'
        ]
        weekly_data = [
            na.serialize() for na in nutrition_analysis if na.timeframe == 'weekly'
        ]
        monthly_data = [
            na.serialize() for na in nutrition_analysis if na.timeframe == 'monthly'
        ]

        # Extract data for the current day, month, and year
        current_month = today.month
        current_year = today.year

        filtered_daily_data = [
            entry for entry in daily_data if entry['log_date'] == today.isoformat()
        ]
        filtered_monthly_data = [
            entry for entry in monthly_data if entry['log_date'][:7] == f"{current_year}-{current_month:02d}"
        ]
        filtered_yearly_data = [
            entry for entry in monthly_data if entry['log_date'][:4] == str(current_year)
        ]

        # Build response
        response = {
            'daily': {'data': filtered_daily_data, 'targets': daily_targets},
            'weekly': {'data': weekly_data},
            'monthly': {'data': filtered_monthly_data, 'targets': monthly_targets},
            'yearly': {'data': filtered_yearly_data, 'targets': yearly_targets},
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

