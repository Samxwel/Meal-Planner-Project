from flask import Blueprint, request, jsonify
from ..models.foodlog import FoodLog
from ..db import db

bp = Blueprint('foodlog', __name__)

from flask import Blueprint, request, jsonify
from ..models.foodlog import FoodLog
from ..db import db

bp = Blueprint('foodlog', __name__)

@bp.route('/get_logs', methods=['GET'])
def get_food_logs():
    try:
        # Extract user_id from query parameters
        user_id = request.args.get('user_id', type=int)

        if not user_id:
            return jsonify({"error": "User ID is required."}), 400

        # Query food logs for the specified user
        food_logs = FoodLog.query.filter_by(user_id=user_id).order_by(FoodLog.log_date.desc()).all()

        if not food_logs:
            return jsonify({"message": "No food logs found for the specified user."}), 404

        # Serialize food logs
        serialized_logs = [log.serialise() for log in food_logs]

        return jsonify(serialized_logs), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
