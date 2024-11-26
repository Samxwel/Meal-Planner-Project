from flask import Blueprint, request, jsonify
from ..models.foodlog import FoodLog
from ..db import db

bp = Blueprint('foodlog', __name__)