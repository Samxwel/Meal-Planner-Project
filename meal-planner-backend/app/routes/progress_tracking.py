from flask import Blueprint, request, jsonify
from app.models.progress_tracking import ProgressTracking
from app.db import db

bp = Blueprint('progress_tracking', __name__)



@bp.route('/log', methods=['POST'])
def log_progress():
    """
    API endpoint to log user progress data.
    """
    data = request.get_json()

    # Extract fields from the incoming request
    user_id = data.get('user_id')
    weight_kg = data.get('weight_kg')
    blood_pressure = data.get('blood_pressure')
    glucose_level = data.get('glucose_level')
    notes = data.get('notes')

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    # Create a new progress tracking record
    progress = ProgressTracking(
        user_id=user_id,
        weight_kg=weight_kg,
        blood_pressure=blood_pressure,
        glucose_level=glucose_level,
        notes=notes
    )

    # Save the record to the database
    db.session.add(progress)
    db.session.commit()

    return jsonify({"message": "Progress logged successfully", "progress_id": progress.progress_id}), 201

# Get all progress tracking records
@bp.route('/<int:user_id>', methods=['GET'])
def get_progress(user_id):
    progress_entries = (
        ProgressTracking.query.filter_by(user_id=user_id)
        .order_by(ProgressTracking.progress_id.asc())
        .all()
    )
    result = [
        {
            "progress_id": entry.progress_id,
            "recorded_at": entry.recorded_at.strftime('%Y-%m-%d %H:%M:%S'),
            "weight_kg": str(entry.weight_kg),
            "blood_pressure": entry.blood_pressure,
            "glucose_level": str(entry.glucose_level),
            "notes": entry.notes,
        }
        for entry in progress_entries
    ]
    return jsonify(result)

# Get a specific progress tracking record by id
@bp.route('/progress_tracking/<int:id>', methods=['GET'])
def get_progress_tracking_record(id):
    record = ProgressTracking.query.get_or_404(id)
    return jsonify(record.serialize()), 200

# Update progress tracking record
@bp.route('/progress_tracking/<int:id>', methods=['PUT'])
def update_progress_tracking(id):
    record = ProgressTracking.query.get_or_404(id)
    data = request.get_json()
    record.update(data)
    db.session.commit()
    return jsonify(record.serialize()), 200

# Delete a progress tracking record
@bp.route('/progress_tracking/<int:id>', methods=['DELETE'])
def delete_progress_tracking(id):
    record = ProgressTracking.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return '', 204
