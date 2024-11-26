from datetime import datetime
from sqlalchemy import func
from ..db import db
from app.models.meals import Meal
from app.models.food_items import FoodItem
from app.models.meal_plans import MealPlan
from decimal import Decimal
import random

def generate_weekly_meals(plan_id):
    # Retrieve the meal plan for the given plan_id
    meal_plan = MealPlan.query.get(plan_id)
    if not meal_plan:
        raise ValueError("Meal plan not found.")

    # Delete existing meals for this plan_id to avoid duplicates
    Meal.query.filter_by(plan_id=plan_id).delete()
    db.session.commit()

    # Define meal types, proportions, and days of the week
    meal_types = ['breakfast', 'lunch', 'Supper', 'snack']
    days_of_week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    meal_proportions = {
        'breakfast': Decimal('0.25'),
        'lunch': Decimal('0.30'),
        'Supper': Decimal('0.30'),
        'snack': Decimal('0.15')
    }

    for day in days_of_week:
        for meal_type in meal_types:
            # Calculate nutrient targets for this meal type based on proportions
            target_calories = meal_plan.caloric_goal * meal_proportions[meal_type]
            target_protein = meal_plan.protein_goal * meal_proportions[meal_type]
            target_carbs = meal_plan.carbs_goal * meal_proportions[meal_type]
            target_fats = meal_plan.fats_goal * meal_proportions[meal_type]
            target_fiber = meal_plan.fiber_goal * meal_proportions[meal_type]
            target_sat_fat = meal_plan.sat_fat_goal * meal_proportions[meal_type]

            # Retrieve food items specific to the current meal type
            meal_specific_food_items = FoodItem.query.filter_by(food_type=meal_type).all()
            if not meal_specific_food_items:
                continue  # Skip if no items for this meal type

            # Randomly shuffle items to provide variation across days
            random.shuffle(meal_specific_food_items)

            # Select a food item that best meets the nutrient goals
            for food_item in meal_specific_food_items:
                # Check if adding the item would exceed meal goals
                if (Decimal(food_item.calories) <= target_calories and
                    Decimal(food_item.protein) <= target_protein and
                    Decimal(food_item.carbs) <= target_carbs and
                    Decimal(food_item.fat) <= target_fats and
                    Decimal(food_item.fiber) <= target_fiber and
                    Decimal(food_item.sat_fat) <= target_sat_fat):

                    # Create and save a Meal entry for the current meal type and day
                    meal = Meal(
                        plan_id=plan_id,
                        meal_name=food_item.name,
                        meal_type=meal_type,
                        calories=float(food_item.calories),
                        protein=float(food_item.protein),
                        carbs=float(food_item.carbs),
                        fats=float(food_item.fat),
                        fiber=float(food_item.fiber),
                        sat_fat=float(food_item.sat_fat),
                        measure=food_item.measure,
                        grams=float(food_item.grams),
                        day=day,
                        created_at=datetime.now()
                    )
                    db.session.add(meal)
                    break  # Only one meal of each type per day

    # Commit the session to save all meals
    db.session.commit()

# Example of calling the function
# generate_weekly_meals(plan_id=1)  # Replace with actual plan_id
