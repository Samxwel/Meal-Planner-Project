from ..db import db

class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('patient', 'nutritionist'), nullable=False)
    age = db.Column(db.Integer)
    gender = db.Column(db.Enum('male', 'female', 'other'))
    height_cm = db.Column(db.Numeric(4, 1))
    weight_kg = db.Column(db.Numeric(5, 2))
    activity_level = db.Column(db.Enum('low', 'moderate', 'high'))
    disease_id = db.Column(db.Integer, db.ForeignKey('diseases.disease_id'))  # Foreign key to diseases table
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    disease = db.relationship("Disease", back_populates="users")
    foodlog = db.relationship("FoodLog", back_populates="users")
    nutritionalanalysis = db.relationship("NutritionAnalysis", back_populates="users")
    user_meal_plan = db.relationship("UserMealPlan", back_populates="users")
    
    def serialize(self):
        return {
            'user_id': self.user_id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'age': self.age,
            'gender': self.gender,
            'height_cm': str(self.height_cm) if self.height_cm is not None else None,
            'weight_kg': str(self.weight_kg) if self.weight_kg is not None else None,
            'activity_level': self.activity_level,
            'disease_id': self.disease_id,
            'disease_name': self.disease.disease_name if self.disease else None,  # Get the disease name from the relationship
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
