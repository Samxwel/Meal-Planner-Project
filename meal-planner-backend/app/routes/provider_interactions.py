from flask import Blueprint, request, jsonify
from app.models.provider_interactions import ProviderInteraction
from app.db import db

bp = Blueprint('provider_interactions', __name__)

# Create provider interaction
@bp.route('/provider_interactions', methods=['POST'])
def create_provider_interaction():
    data = request.get_json()
    new_interaction = ProviderInteraction(**data)
    db.session.add(new_interaction)
    db.session.commit()
    return jsonify(new_interaction.serialize()), 201

# Get all provider interactions
@bp.route('/provider_interactions', methods=['GET'])
def get_provider_interactions():
    interactions = ProviderInteraction.query.all()
    return jsonify([interaction.serialize() for interaction in interactions]), 200

# Get specific provider interaction by id
@bp.route('/provider_interactions/<int:id>', methods=['GET'])
def get_provider_interaction_by_id(id):
    interaction = ProviderInteraction.query.get_or_404(id)
    return jsonify(interaction.serialize()), 200

# Update provider interaction
@bp.route('/provider_interactions/<int:id>', methods=['PUT'])
def update_provider_interaction(id):
    interaction = ProviderInteraction.query.get_or_404(id)
    data = request.get_json()
    interaction.update(data)
    db.session.commit()
    return jsonify(interaction.serialize()), 200

# Delete provider interaction
@bp.route('/provider_interactions/<int:id>', methods=['DELETE'])
def delete_provider_interaction(id):
    interaction = ProviderInteraction.query.get_or_404(id)
    db.session.delete(interaction)
    db.session.commit()
    return '', 204
