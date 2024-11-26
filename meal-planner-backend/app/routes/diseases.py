from flask import Blueprint, request, jsonify
from app.models.Diseases import Disease
from app.db import db

bp = Blueprint('diseases', __name__)
@bp.route('', methods=['GET'])
def get_diseases():
    diseases = Disease.query.all()
    return jsonify([{
        'disease_id': d.disease_id,
        'disease_name': d.disease_name,
        'description': d.description,
        'stage_name': d.stage_name,
        'stage_description': d.stage_description,
        'stage_name_id': d.stage_name_id
    } for d in diseases])

@bp.route('/', methods=['POST'])
def create_disease():
    data = request.json
    disease = Disease(
        disease_name=data['disease_name'],
        description=data.get('description'),
        stage_name=data['stage_name'],
        stage_description=data['stage_description'],
        stage_name_id=data['stage_name_id']
    )
    db.session.add(disease)
    db.session.commit()
    return jsonify({'message': 'Disease created successfully', 'disease_id': disease.disease_id}), 201

@bp.route('/<int:disease_id>', methods=['PUT'])
def update_disease(disease_id):
    data = request.json
    disease = Disease.query.get_or_404(disease_id)
    disease.disease_name = data.get('disease_name', disease.disease_name)
    disease.description = data.get('description', disease.description)
    disease.stage_name = data.get('stage_name', disease.stage_name)
    disease.stage_description = data.get('stage_description', disease.stage_description)
    disease.stage_name_id = data.get('stage_name_id', disease.stage_name_id)
    db.session.commit()
    return jsonify({'message': 'Disease updated successfully'})

@bp.route('/<int:disease_id>', methods=['DELETE'])
def delete_disease(disease_id):
    disease = Disease.query.get_or_404(disease_id)
    db.session.delete(disease)
    db.session.commit()
    return jsonify({'message': 'Disease deleted successfully'})



