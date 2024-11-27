
from datetime import date

from ..db import db

class NutritionAnalysis(db.Model):
    __tablename__ = 'nutritionalanalysis'
    
    analysis_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    log_date = db.Column(db.Date, nullable=False, default=date.today)
    timeframe = db.Column(db.String(10), nullable=False)  # Can be 'daily', 'monthly', or 'yearly'
    day_variant = db.Column(db.String(20), nullable=True)  # Stores contextual info (e.g., "Monday" or "Week 1")
    calories = db.Column(db.Numeric(10, 2))
    protein = db.Column(db.Numeric(10, 2))
    carbs = db.Column(db.Numeric(10, 2))
    fats = db.Column(db.Numeric(10, 2))
    fiber = db.Column(db.Numeric(10, 2))
    sat_fat = db.Column(db.Numeric(10, 2))
    
    users = db.relationship('User', back_populates='nutritionalanalysis')

    def serialize(self):
        return {
            'analysis_id': self.analysis_id,
            'user_id': self.user_id,
            'log_date': self.log_date.isoformat(),
            'timeframe': self.timeframe,
            'day_variant': self.day_variant,
            'calories': float(self.calories) if self.calories is not None else None,
            'protein': float(self.protein) if self.protein is not None else None,
            'carbs': float(self.carbs) if self.carbs is not None else None,
            'fats': float(self.fats) if self.fats is not None else None,
            'fiber': float(self.fiber) if self.fiber is not None else None,
            'sat_fat': float(self.sat_fat) if self.sat_fat is not None else None,
        }
