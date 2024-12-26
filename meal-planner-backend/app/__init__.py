from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Configure the MySQL Database URI
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:@localhost/Meal planner'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    # Import routes and register blueprints
    from .routes import users, meal_plans, meals, food_items, progress_tracking, feedback, provider_interactions, foodlog, nutritionalanalysis, User_meal_plan, diseases, Messages
    
    app.register_blueprint(users.bp, url_prefix='/api/users')
    app.register_blueprint(meal_plans.bp, url_prefix='/api/meal_plans')
    app.register_blueprint(meals.bp, url_prefix='/api/meals')
    app.register_blueprint(food_items.bp, url_prefix='/api/food_items')
    app.register_blueprint(progress_tracking.bp, url_prefix='/api/progress_tracking')
    app.register_blueprint(feedback.bp, url_prefix='/api/feedback')
    app.register_blueprint(provider_interactions.bp, url_prefix='/api/provider_interactions')
    app.register_blueprint(foodlog.bp, url_prefix='/api/foodlog')
    app.register_blueprint(nutritionalanalysis.bp, url_prefix='/api/nutritionalanalysis')
    app.register_blueprint(User_meal_plan.bp, url_prefix='/api/user_meal_plan')
    app.register_blueprint(diseases.bp, url_prefix='/api/diseases')
    app.register_blueprint(Messages.bp, url_prefix='/api/messages')
    

    return app
