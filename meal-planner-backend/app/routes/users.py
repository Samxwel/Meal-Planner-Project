from flask import Blueprint, request, jsonify
from ..models.users import User
from ..models.Diseases import Disease
from ..db import db
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import IntegrityError

bp = Blueprint('users', __name__)

# User login route
@bp.route('/login', methods=['POST'])
def login_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Validate the input
    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    # Retrieve user from the database
    user = User.query.filter_by(email=email).first()
    
    if not user :
        return jsonify({'error': 'Invalid credentials'}), 401

    # Successful login, return user data
    return jsonify({
        'userId': user.user_id,
        'name': user.name,
        'email': user.email,
        'role': user.role  # Assuming 'role' is a field in your User model
    }), 200

# Get all users
@bp.route('/', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users])

# Get a specific user
@bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify({
            'user_id': user.user_id,
            'name': user.name,
            'email': user.email,
            'role': user.role,
            'age': user.age,
            'gender': user.gender,
            'height_cm': str(user.height_cm) if user.height_cm else None,
            'weight_kg': str(user.weight_kg) if user.weight_kg else None,
            'activity_level': user.activity_level,
            'disease_id': user.disease_id,
            'created_at': user.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        })
    else:
        return jsonify({'message': 'User not found'}), 404

# Create a new user
@bp.route('/', methods=['POST'])
def create_user():
    data = request.json
    try:
        new_user = User(
            name=data['name'],
            email=data['email'],
            password=data['password'],  # Ensure password hashing in production
            role=data['role'],  # Should be 'patient' or 'nutritionist'
            age=data.get('age'),
            gender=data.get('gender'),
            height_cm=data.get('height_cm'),
            weight_kg=data.get('weight_kg'),
            activity_level=data.get('activity_level'),
            health_conditions=data.get('health_conditions')  # Should match enumerated conditions in the table
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully', 'user_id': new_user.user_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# Update a user
@bp.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if user:
        data = request.get_json()

        # Update fields based on the provided data, using existing values if data is not provided
        user.name = data.get('name', user.name)
        user.email = data.get('email', user.email)  # Email is required, ensure it's updated correctly
        user.password = data.get('password', user.password)  # Be cautious with password changes
        user.role = data.get('role', user.role)
        user.age = data.get('age', user.age)
        user.gender = data.get('gender', user.gender)
        user.height_cm = data.get('height_cm', user.height_cm)
        user.weight_kg = data.get('weight_kg', user.weight_kg)
        user.activity_level = data.get('activity_level', user.activity_level)
        user.disease_id = data.get('disease_id', user.disease_id)

        db.session.commit()
        return jsonify({'message': 'User profile updated successfully'}), 200
    else:
        return jsonify({'message': 'User not found'}), 404

# Delete a user
@bp.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'})

@bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()

    # Validate required fields
    required_fields = ["name", "email", "password", "role"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    # Optional fields
    age = data.get("age")
    gender = data.get("gender")
    height_cm = data.get("height_cm")
    weight_kg = data.get("weight_kg")
    activity_level = data.get("activity_level")
    disease_id = data.get("disease_id")

    try:
        # Create a new User instance
        new_user = User(
            name=data["name"],
            email=data["email"],
            password=generate_password_hash(data["password"]),  # Hash the password
            role=data["role"],
            age=int(age) if age else None,
            gender=gender if gender in ["male", "female", "other"] else None,
            height_cm=float(height_cm) if height_cm else None,
            weight_kg=float(weight_kg) if weight_kg else None,
            activity_level=activity_level if activity_level in ["low", "moderate", "high"] else None,
            disease_id=int(disease_id) if disease_id else None
        )

        # Add and commit the new user
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "Registration successful!"}), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Email already exists"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
# Fetch all patients with their disease details
@bp.route('/patients', methods=['GET'])
def get_patients():
    # Query to fetch patients with their disease details
    patients = (
        db.session.query(User.user_id, User.name, Disease.disease_name, Disease.description)
        .join(Disease, User.disease_id == Disease.disease_id)
        .filter(User.role == 'patient')  # Ensure we only fetch patients
        .all()
    )
    
    # Prepare the result to send back as JSON
    result = [
        {
            "user_id": user_id,
            "name": name,
            "disease_name": disease_name,
            "disease_description": description,
        }
        for user_id, name, disease_name, description in patients  # Unpacking correctly
    ]
    
    return jsonify(result)

@bp.route('/nutritionists', methods=['GET'])
def get_nutritionists():
    # Query to fetch patients with their disease details
    patients = (
        db.session.query(User.user_id, User.name)
        .filter(User.role == 'nutritionist')  # Ensure we only fetch patients
        .all()
    )
    
    # Prepare the result to send back as JSON
    result = [
        {
            "user_id": user_id,
            "name": name,
            
        }
        for user_id, name in patients  # Unpacking correctly
    ]
    
    return jsonify(result)

# Update a patient
@bp.route('/patients/<int:user_id>', methods=['PUT'])
def update_patient(user_id):
    # Fetch the patient with a role of "patient"
    patient = User.query.filter_by(user_id=user_id, role='patient').first()

    if not patient:
        return jsonify({"error": "Patient not found or is not a patient"}), 404

    data = request.json
    patient.name = data.get("name", patient.name)
    patient.disease_id = data.get("disease_id", patient.disease_id)

    db.session.commit()
    return jsonify({"message": "Patient updated successfully"})

# Delete a patient
@bp.route('/patients/<int:user_id>', methods=['DELETE'])
def delete_patient(user_id):
    # Fetch the patient with a role of "patient"
    patient = User.query.filter_by(user_id=user_id, role='patient').first()

    if not patient:
        return jsonify({"error": "Patient not found or is not a patient"}), 404

    db.session.delete(patient)
    db.session.commit()
    return jsonify({"message": "Patient deleted successfully"})

@bp.route('/reportsuser', methods=['GET'])
def get_patient_data():
    try:
        # Retrieve user_id and stage_name_id from the request args
        user_id = request.args.get('user_id', type=int)
        stage_name_id = request.args.get('stage_name_id', type=int)

        if not user_id or not stage_name_id:
            return jsonify({"error": "user_id and stage_name_id are required."}), 400

        # Query the User and related Disease data
        user = User.query.filter_by(user_id=user_id).first()
        if not user:
            return jsonify({"error": "User not found."}), 404

        disease = Disease.query.filter_by(disease_id=user.disease_id, stage_name_id=stage_name_id).first()
        if not disease:
            return jsonify({"error": "Disease or stage not found."}), 404

        # Construct the response data
        patient_data = {
            "name": user.name,
            "disease": disease.disease_name,
            "stage": {
                "name": disease.stage_name,
                "description": disease.stage_description
            },
            "personalDetails": {
                "email": user.email,
                "age": user.age,
                "gender": user.gender
            }
        }

        return jsonify(patient_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
