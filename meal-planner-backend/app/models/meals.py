from app.db import db

class Meal(db.Model):
    __tablename__ = 'meals'

    meal_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    plan_id = db.Column(db.Integer, db.ForeignKey('meal_plans.plan_id'), nullable=False)  # Foreign key to meal plans
    meal_name = db.Column(db.String(255), nullable=False)  # Name of the meal
    meal_type = db.Column(db.Enum('breakfast', 'lunch', 'Supper', 'snack'), nullable=False)  # Type of meal
    calories = db.Column(db.Numeric(6, 2), nullable=False)  # Calories per meal
    protein = db.Column(db.Numeric(6, 2), nullable=False)  # Protein per meal
    carbs = db.Column(db.Numeric(6, 2), nullable=False)  # Carbs per meal
    fats = db.Column(db.Numeric(6, 2), nullable=False)  # Fats per meal
    measure = db.Column(db.String(255), nullable=False)  # Serving measure (e.g., "1 cup")
    grams = db.Column(db.Numeric(6, 2), nullable=False)  # Weight in grams
    fiber = db.Column(db.Numeric(6, 2), nullable=False)  # Fiber per meal
    sat_fat = db.Column(db.Numeric(6, 2), nullable=False)  # Saturated fat per meal
    day = db.Column(db.Enum('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), nullable=False)  # Day of the meal
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def serialize(self):
        return {
            'meal_id': self.meal_id,
            'plan_id': self.plan_id,
            'meal_name': self.meal_name,
            'meal_type': self.meal_type,
            'calories': str(self.calories),
            'protein': str(self.protein),
            'carbs': str(self.carbs),
            'fats': str(self.fats),
            'measure': self.measure,
            'grams': str(self.grams),
            'fiber': str(self.fiber),
            'sat_fat': str(self.sat_fat),
            'created_at': self.created_at.isoformat(),
        }
