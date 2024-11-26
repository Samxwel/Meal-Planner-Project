from ..db import db

class Disease(db.Model):
    __tablename__ = 'diseases'

    disease_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    disease_name = db.Column(db.String(255), nullable=False)   # Name of the disease
    description = db.Column(db.Text)                           # Description of the disease
    stage_name = db.Column(db.String(255), nullable=False)     # Name of the stage
    stage_description = db.Column(db.Text, nullable=False)     # Description of the stage
    stage_name_id = db.Column(db.Integer, nullable=False)       # ID for the stage name

    # Relationship to MealPlan (One-to-Many)
    meal_plans = db.relationship('MealPlan', back_populates='disease')
    users = db.relationship('User', back_populates='disease')
    user_meal_plan = db.relationship("UserMealPlan", back_populates="disease")
    
    def serialize(self):
        return {
            'disease_id': self.disease_id,
            'disease_name': self.disease_name,
            'description': self.description,
            'stage_name': self.stage_name,
            'stage_description': self.stage_description,
            'stage_name_id': self.stage_name_id,
        }
