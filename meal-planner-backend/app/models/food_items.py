from ..db import db

class FoodItem(db.Model):
    __tablename__ = 'food_items'

    food_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    measure = db.Column(db.String(255))  # Serving measure (e.g., "1 cup")
    grams = db.Column(db.Numeric(6, 2) )  # Weight in grams
    calories = db.Column(db.Numeric(6, 2))  # Calories per serving
    protein = db.Column(db.Numeric(6, 2))  # Protein per serving
    carbs = db.Column(db.Numeric(6, 2))    # Carbohydrates per serving
    fiber = db.Column(db.Numeric(6, 2))    # Fiber per serving
    fat = db.Column(db.Numeric(6, 2))      # Total fat per serving
    sat_fat = db.Column(db.Numeric(6, 2))  # Saturated fat per serving
    micronutrients = db.Column(db.Text)     # Micronutrients (e.g., vitamins)
    food_type = db.Column(db.String(255))   # Type of food (e.g., "vegetable", "meat")
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def serialize(self):
        return {
            'food_id': self.food_id,
            'name': self.name,
            'measure': self.measure,
            'grams': str(self.grams),
            'calories': str(self.calories),
            'protein': str(self.protein),
            'carbs': str(self.carbs),
            'fiber': str(self.fiber),
            'fat': str(self.fat),
            'sat_fat': str(self.sat_fat),
            'micronutrients': self.micronutrients,
            'food_type': self.food_type,
            'created_at': self.created_at.isoformat()
        }
