from ..db import db

class Feedback(db.Model):
    __tablename__ = 'feedback'

    feedback_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    meal_satisfaction = db.Column(db.Integer, nullable=False)  # Rating for meal satisfaction
    app_experience = db.Column(db.Integer, nullable=False)     # Rating for app experience
    recommendation = db.Column(db.Integer, nullable=False)     # Rating for recommendation likelihood
    feedback_text = db.Column(db.Text, nullable=False)          # Detailed feedback text
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    user = db.relationship('User', backref='feedbacks')  # Establish relationship with User

    def __init__(self, user_id, meal_satisfaction, app_experience, recommendation, feedback_text):
        self.user_id = user_id
        self.meal_satisfaction = meal_satisfaction
        self.app_experience = app_experience
        self.recommendation = recommendation
        self.feedback_text = feedback_text

    def serialize(self):
        return {
            'feedback_id': self.feedback_id,
            'user_id': self.user_id,
            'meal_satisfaction': self.meal_satisfaction,
            'app_experience': self.app_experience,
            'recommendation': self.recommendation,
            'feedback_text': self.feedback_text,
            'created_at': self.created_at.isoformat()
        }
