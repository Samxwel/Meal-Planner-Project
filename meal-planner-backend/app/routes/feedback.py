from flask import Blueprint, request, jsonify
from app.models.feedback import Feedback
from app.db import db

bp = Blueprint('feedback', __name__)

# Create feedback
@bp.route('/feedback', methods=['POST'])
def create_feedback():
    data = request.get_json()
    new_feedback = Feedback(**data)
    db.session.add(new_feedback)
    db.session.commit()
    return jsonify(new_feedback.serialize()), 201

# Get all feedback
bp.route('/feedback', methods=['GET'])
def get_feedback():
    feedback = Feedback.query.all()
    return jsonify([fb.serialize() for fb in feedback]), 200

# Get specific feedback by id
bp.route('/feedback/<int:id>', methods=['GET'])
def get_feedback_by_id(id):
    fb = Feedback.query.get_or_404(id)
    return jsonify(fb.serialize()), 200

# Update feedback
bp.route('/feedback/<int:id>', methods=['PUT'])
def update_feedback(id):
    fb = Feedback.query.get_or_404(id)
    data = request.get_json()
    fb.update(data)
    db.session.commit()
    return jsonify(fb.serialize()), 200

# Delete feedback
bp.route('/feedback/<int:id>', methods=['DELETE'])
def delete_feedback(id):
    fb = Feedback.query.get_or_404(id)
    db.session.delete(fb)
    db.session.commit()
    return '', 204
