from flask import Blueprint, request, jsonify
from ..models.Messages import Message
from ..db import db

bp = Blueprint('messages', __name__)

@bp.route('/send_message', methods=['POST'])
def send_message():
    data = request.get_json()

    sender_id = data.get('sender_id')
    receiver_id = data.get('receiver_id')
    message_text = data.get('message_text')

    if not sender_id or not receiver_id or not message_text:
        return jsonify({'error': 'Missing required data'}), 400

    try:
        # Create and store the new message
        message = Message(sender_id=sender_id, receiver_id=receiver_id, message_text=message_text)
        db.session.add(message)
        db.session.commit()

        return jsonify({'message': 'Message sent successfully', 'message_id': message.message_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@bp.route('/get_messages', methods=['GET'])
def get_messages():
    user_id = request.args.get('user_id')  # Get the user ID from query parameters

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    try:
        # Fetch all messages for a user (both sent and received)
        messages = Message.query.filter(
            (Message.sender_id == user_id) | (Message.receiver_id == user_id)
        ).order_by(Message.timestamp.desc()).all()

        return jsonify([message.serialize() for message in messages]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/update_message_status', methods=['PUT'])
def update_message_status():
    data = request.get_json()
    message_id = data.get('message_id')

    if not message_id:
        return jsonify({'error': 'Message ID is required'}), 400

    try:
        message = Message.query.filter_by(message_id=message_id).first()
        if message:
            message.status = 'read'
            db.session.commit()
            return jsonify({'message': 'Message status updated to read'}), 200
        else:
            return jsonify({'error': 'Message not found'}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
