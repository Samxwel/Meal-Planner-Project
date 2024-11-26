from flask_sqlalchemy import SQLAlchemy
from ..db import db

class UserMealPlan(db.Model):
    __tablename__ = 'user_meal_plan'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    stage_name = db.Column(db.String(255), db.ForeignKey('diseases.stage_name'), nullable=False)  # New column
    day = db.Column(db.Enum('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), nullable=False)  # New column
    meal_name = db.Column(db.String(255), nullable=False)
    meal_type = db.Column(db.Enum('breakfast', 'lunch', 'Supper', 'Snack'), nullable=False)
    calories = db.Column(db.Float, nullable=False)
    protein = db.Column(db.Float, nullable=False)
    carbs = db.Column(db.Float, nullable=False)
    fats = db.Column(db.Float, nullable=False)
    fiber = db.Column(db.Float, nullable=False)
    sat_fat = db.Column(db.Float, nullable=False)
    grams = db.Column(db.Float, nullable=False)
    measure = db.Column(db.String(50), nullable=False)
    log_date = db.Column(db.Date, nullable=False)
    disease=db.relationship("Disease", back_populates="user_meal_plan")
    users = db.relationship("User", back_populates="user_meal_plan")
    def serialize(self):
        """Converts the UserMealPlan instance into a dictionary."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'meal_name': self.meal_name,
            'meal_type': self.meal_type,
            'calories': self.calories,
            'protein': self.protein,
            'carbs': self.carbs,
            'fats': self.fats,
            'fiber': self.fiber,
            'sat_fat': self.sat_fat,
            'grams': self.grams,
            'measure': self.measure,
            'log_date': self.log_date.isoformat() if self.log_date else None,  # Ensure proper JSON format for dates
            'stage_name': self.stage_name,  # Include stage_name if it is part of the model
            'day': self.day  # Include the day of the week (e.g., Monday, Tuesday, etc.)
        }

