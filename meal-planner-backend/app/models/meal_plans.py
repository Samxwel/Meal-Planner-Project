from ..db import db

class MealPlan(db.Model):
    __tablename__ = 'meal_plans'

    plan_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    disease_id = db.Column(db.Integer, db.ForeignKey('diseases.disease_id'), nullable=False)  # Part of composite key
    stage_name = db.Column(db.String(255),  nullable=False)  # Part of composite key
    caloric_goal = db.Column(db.Integer, nullable=False)            # Daily caloric goal
    protein_goal = db.Column(db.Numeric(5, 2), nullable=False)      # Daily protein goal (grams)
    carbs_goal = db.Column(db.Numeric(5, 2), nullable=False)        # Daily carbohydrates goal (grams)
    fats_goal = db.Column(db.Numeric(5, 2), nullable=False)         # Daily fats goal (grams)
    fiber_goal = db.Column(db.Numeric(5, 2), nullable=False)        # Daily fiber goal (grams)
    sat_fat_goal = db.Column(db.Numeric(5, 2), nullable=False)      # Daily saturated fat goal (grams)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    # Relationships
    
    disease = db.relationship(
        'Disease',
        back_populates='meal_plans',
        foreign_keys=[disease_id, stage_name],  # Explicitly list foreign keys
        primaryjoin="and_(MealPlan.disease_id == Disease.disease_id, MealPlan.stage_name == Disease.stage_name)"
    ) # One MealPlan to one Disease

    def serialize(self):
        return {
            'plan_id': self.plan_id,
            'stage_name': self.stage_name,
            'disease_id': self.disease_id,
            'caloric_goal': str(self.caloric_goal),
            'protein_goal': str(self.protein_goal),
            'carbs_goal': str(self.carbs_goal),
            'fats_goal': str(self.fats_goal),
            'fiber_goal': str(self.fiber_goal),
            'sat_fat_goal': str(self.sat_fat_goal),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
