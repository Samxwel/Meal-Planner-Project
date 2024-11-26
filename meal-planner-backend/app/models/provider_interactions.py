from ..db import db

class ProviderInteraction(db.Model):
    __tablename__ = 'provider_interactions'

    interaction_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    provider_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    interaction_type = db.Column(db.Enum('message', 'plan_review'), nullable=False)
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    patient = db.relationship('User', foreign_keys=[patient_id], backref='patient_interactions')  # Relationship with Patient
    provider = db.relationship('User', foreign_keys=[provider_id], backref='provider_interactions')  # Relationship with Provider

    def __init__(self, patient_id, provider_id, interaction_type, message=None):
        self.patient_id = patient_id
        self.provider_id = provider_id
        self.interaction_type = interaction_type
        self.message = message

    def serialize(self):
        return {
            'interaction_id': self.interaction_id,
            'patient_id': self.patient_id,
            'provider_id': self.provider_id,
            'interaction_type': self.interaction_type,
            'message': self.message,
            'created_at': self.created_at.isoformat()
        }
