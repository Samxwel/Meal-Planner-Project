from flask import Blueprint, request, jsonify
from ..models.meal_plans import MealPlan
from ..db import db
from ..models.Diseases import Disease
from ..models.users import User
from sqlalchemy import select

bp = Blueprint('meal_plans', __name__)

# Create a meal plan
@bp.route('/', methods=['POST'])
def create_meal_plan():
    data = request.json
    meal_plan = MealPlan(
        disease_id=data['disease_id'],
        stage_name=data['stage_name'],
        caloric_goal=data['caloric_goal'],
        protein_goal=data['protein_goal'],
        carbs_goal=data['carbs_goal'],
        fats_goal=data['fats_goal'],
        fiber_goal=data['fiber_goal'],
        sat_fat_goal=data['sat_fat_goal']
    )
    db.session.add(meal_plan)
    db.session.commit()
    return jsonify({'message': 'Meal plan created successfully', 'plan_id': meal_plan.plan_id}), 201


#get


@bp.route('meal-plans/<int:user_id>', methods=['GET'])
def get_meal_plans_user(user_id):
    try:
        # Fetch the user by user_id
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Fetch disease name using user's disease_id
        disease_id = user.disease_id
        disease = Disease.query.get(disease_id)
        if not disease:
            return jsonify({'error': 'Disease not assigned to this user'}), 404

        # Disease name associated with the user
        disease_name = disease.disease_name

        # Query distinct stages based on stage_name_id for this disease name
        stages_query = db.session.execute(
            select(Disease.stage_name_id, Disease.stage_name, Disease.stage_description, Disease.disease_name)
            .filter(Disease.disease_name == disease_name)
            .distinct(Disease.stage_name_id)
        )
        
        # Format results into a list
        stages = [
            {
                'stage_name_id': stage.stage_name_id,
                'stage_name': stage.stage_name,
                'stage_description': stage.stage_description,
                'disease_name': stage.disease_name
            }
            for stage in stages_query
        ]

        # Return the response
        return jsonify({
            'disease_name': disease_name,
            'stages': stages
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500





@bp.route('/targets/<int:user_id>', methods=['GET'])
def get_mealplan_targets(user_id):
    # Fetch the user’s selected meal plan based on `user_id`
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Retrieve the user’s associated meal plan targets
    mealplan = MealPlan.query.filter_by(user_id=user_id).first()
    if not mealplan:
        return jsonify({"error": "Meal plan not found"}), 404

    # Construct the target values to return
    targets = {
        "daily_calories": mealplan.daily_calories,
        "daily_protein": mealplan.daily_protein,
        "daily_carbs": mealplan.daily_carbs,
        "daily_fats": mealplan.daily_fats,
        "daily_fiber": mealplan.daily_fiber,
        # Include monthly and yearly targets as well if needed
    }
    return jsonify(targets), 200




@bp.route('/', methods=['GET'])
def get_meal_plans():
    meal_plans = MealPlan.query.all()
    return jsonify([{
        'plan_id': m.plan_id,
        'disease_id': m.disease_id,
        'stage_name': m.stage_name,
        'caloric_goal': m.caloric_goal,
        'protein_goal': float(m.protein_goal),
        'carbs_goal': float(m.carbs_goal),
        'fats_goal': float(m.fats_goal),
        'fiber_goal': float(m.fiber_goal),
        'sat_fat_goal': float(m.sat_fat_goal),
        'created_at': m.created_at,
        'updated_at': m.updated_at
    } for m in meal_plans])


# Update a meal plan
@bp.route('/<int:plan_id>', methods=['PUT'])
def update_meal_plan(plan_id):
    data = request.json
    meal_plan = MealPlan.query.get_or_404(plan_id)
    meal_plan.caloric_goal = data.get('caloric_goal', meal_plan.caloric_goal)
    meal_plan.protein_goal = data.get('protein_goal', meal_plan.protein_goal)
    meal_plan.carbs_goal = data.get('carbs_goal', meal_plan.carbs_goal)
    meal_plan.fats_goal = data.get('fats_goal', meal_plan.fats_goal)
    meal_plan.fiber_goal = data.get('fiber_goal', meal_plan.fiber_goal)
    meal_plan.sat_fat_goal = data.get('sat_fat_goal', meal_plan.sat_fat_goal)
    db.session.commit()
    return jsonify({'message': 'Meal plan updated successfully'})


# Delete a meal plan
@bp.route('/<int:plan_id>', methods=['DELETE'])
def delete_meal_plan(plan_id):
    meal_plan = MealPlan.query.get_or_404(plan_id)
    db.session.delete(meal_plan)
    db.session.commit()
    return jsonify({'message': 'Meal plan deleted successfully'})



