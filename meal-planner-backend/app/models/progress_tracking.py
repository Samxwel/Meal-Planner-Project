from ..db import db

class ProgressTracking(db.Model):
    __tablename__ = 'progress_tracking'

    progress_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    recorded_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    weight_kg = db.Column(db.Numeric(5, 2))
    blood_pressure = db.Column(db.String(20))
    glucose_level = db.Column(db.Numeric(5, 2))
    notes = db.Column(db.Text)

    user = db.relationship('User', backref='progress_tracking')  # Establish relationship with User

    def __init__(self, user_id, weight_kg=None, blood_pressure=None, glucose_level=None, notes=None):
        self.user_id = user_id
        self.weight_kg = weight_kg
        self.blood_pressure = blood_pressure
        self.glucose_level = glucose_level
        self.notes = notes

    def serialize(self):
        return {
            'progress_id': self.progress_id,
            'user_id': self.user_id,
            'recorded_at': self.recorded_at.isoformat(),
            'weight_kg': str(self.weight_kg) if self.weight_kg is not None else None,
            'blood_pressure': self.blood_pressure,
            'glucose_level': str(self.glucose_level) if self.glucose_level is not None else None,
            'notes': self.notes
        }
