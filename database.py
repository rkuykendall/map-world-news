from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from web import app
import os

class DevelopmentConfig(object):
    NAME = "Developent"
    # DATABASE_URI = "sqlite:///development.db"
    DATABASE_URI = "sqlite:///:memory:"    
    DEBUG = True

class TestingConfig(object):
    NAME = "Testing"
    DATABASE_URI = "sqlite:///:memory:"    
    DEBUG = True

# Set enviornment variables from the database file
config_path = os.environ.get("CONFIG_PATH", "database.DevelopmentConfig")
app.config.from_object(config_path)

engine = create_engine(app.config["DATABASE_URI"])
Base = declarative_base()
Session = sessionmaker(bind=engine)
session = Session()