from datetime import datetime

from ..db import db

class FoodLog(db.Model):
    __tablename__ = 'foodlog'

    log_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    meal_name = db.Column(db.String(255), nullable=False)
    meal_type = db.Column(db.String(50), nullable=False)  # e.g., breakfast, lunch, etc.
    calories = db.Column(db.Numeric(10, 2), nullable=False)
    protein = db.Column(db.Numeric(10, 2), nullable=False)
    carbs = db.Column(db.Numeric(10, 2), nullable=False)
    fats = db.Column(db.Numeric(10, 2), nullable=False)
    fiber = db.Column(db.Numeric(10, 2), nullable=True)
    sat_fat = db.Column(db.Numeric(10, 2), nullable=True)
    grams = db.Column(db.Numeric(10, 2), nullable=False)
    measure = db.Column(db.String(50), nullable=False)  # e.g., grams, cups, etc.
    log_date = db.Column(db.Date, default=datetime.utcnow, nullable=False)

    # Relationship back to the user
    users = db.relationship("User", back_populates="foodlog")

    def serialise(self):
        """Serialize data for API response."""
        return {
            "log_id": self.log_id,
            "user_id": self.user_id,
            "meal_name": self.meal_name,
            "meal_type": self.meal_type,
            "calories": float(self.calories),
            "protein": float(self.protein),
            "carbs": float(self.carbs),
            "fats": float(self.fats),
            "fiber": float(self.fiber) if self.fiber else None,
            "sat_fat": float(self.sat_fat) if self.sat_fat else None,
            "grams": float(self.grams),
            "measure": self.measure,
            "log_date": self.log_date.isoformat()
        }
