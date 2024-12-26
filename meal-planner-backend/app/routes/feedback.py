from flask import Blueprint, request, jsonify
from app.models.feedback import Feedback
from app.db import db

bp = Blueprint('feedback', __name__)

# Create feedback
@bp.route('/submit', methods=['POST'])
def submit_feedback():
    # Extracting data from the incoming request
    data = request.get_json()
    
    # Validate the input data
    user_id = data.get('user_id')
    meal_satisfaction = data.get('meal_satisfaction')
    app_experience = data.get('app_experience')
    recommendation = data.get('recommendation')
    feedback_text = data.get('feedback_text')
    
    if not all([user_id, meal_satisfaction, app_experience, recommendation, feedback_text]):
        return jsonify({"error": "Missing required data"}), 400
    
    # Ensure ratings are integers between 1 and 5
    if not (1 <= meal_satisfaction <= 5):
        return jsonify({"error": "Meal satisfaction must be between 1 and 5"}), 400
    if not (1 <= app_experience <= 5):
        return jsonify({"error": "App experience must be between 1 and 5"}), 400
    if not (1 <= recommendation <= 5):
        return jsonify({"error": "Recommendation must be between 1 and 5"}), 400
    
    try:
        # Create a new feedback entry in the database
        feedback = Feedback(
            user_id=user_id,
            meal_satisfaction=meal_satisfaction,
            app_experience=app_experience,
            recommendation=recommendation,
            feedback_text=feedback_text
        )
        
        # Add feedback to the session and commit to the database
        db.session.add(feedback)
        db.session.commit()
        
        # Return a success response with the feedback ID
        return jsonify({"message": "Feedback submitted successfully", "feedback_id": feedback.feedback_id}), 201
    
    except Exception as e:
        # Rollback in case of error
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

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
