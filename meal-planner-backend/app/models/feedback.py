from ..db import db

class Feedback(db.Model):
    __tablename__ = 'feedback'

    feedback_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    feedback_text = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # Ensuring rating cannot be null
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    user = db.relationship('User', backref='feedbacks')  # Establish relationship with User

    def __init__(self, user_id, feedback_text, rating):
        self.user_id = user_id
        self.feedback_text = feedback_text
        self.rating = rating

    def serialize(self):
        return {
            'feedback_id': self.feedback_id,
            'user_id': self.user_id,
            'feedback_text': self.feedback_text,
            'rating': self.rating,
            'created_at': self.created_at.isoformat()
        }
