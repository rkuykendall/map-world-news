import os

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

from flask import Flask
from flask_cors import CORS
from .views import api_blueprint


app = Flask(__name__)
app.register_blueprint(api_blueprint)


# Set environment variables from the database file
config_path = os.environ.get("CONFIG_PATH", "api.config.DevelopmentConfig")
app.config.from_object(config_path)
cors = CORS(app)


# SQLAlchemy
db_uri = app.config["DATABASE_URI"]
if db_uri and db_uri.startswith("postgres://"):
	db_uri = db_uri.replace("postgres://", "postgresql://", 1)
engine = create_engine(db_uri)
Base = declarative_base()
Session = sessionmaker(bind=engine)
session = Session()
