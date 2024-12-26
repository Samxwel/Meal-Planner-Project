from ..db import db

class Message(db.Model):
    __tablename__ = 'messages'

    message_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    message_text = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())
    status = db.Column(db.Enum('unread', 'read', name='message_status'), default='unread')

    sender = db.relationship('User', foreign_keys=[sender_id], back_populates='sent_messages')
    receiver = db.relationship('User', foreign_keys=[receiver_id], back_populates='received_messages')

    def __init__(self, sender_id, receiver_id, message_text, status='unread'):
        self.sender_id = sender_id
        self.receiver_id = receiver_id
        self.message_text = message_text
        self.status = status

    def serialize(self):
        return {
            'message_id': self.message_id,
            'sender_id': self.sender_id,
            'receiver_id': self.receiver_id,
            'message_text': self.message_text,
            'timestamp': self.timestamp.isoformat(),
            'status': self.status
        }
