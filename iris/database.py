from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from iris.web import app
import os

class HerokuConfig(object):
    NAME = "Heroku"
    DATABASE_URI = os.getenv("DATABASE_URL")
    DEBUG = True

class DevelopmentConfig(object):
    NAME = "Developent"
    DATABASE_URI = "sqlite:///development.db"
    DEBUG = True

class TestingConfig(object):
    NAME = "Testing"
    DATABASE_URI = "sqlite:///:memory:"
    DEBUG = True

# Set enviornment variables from the database file
config_path = os.environ.get("CONFIG_PATH", "iris.database.DevelopmentConfig")
app.config.from_object(config_path)

engine = create_engine(app.config["DATABASE_URI"])
# engine = create_engine('sqlite:///:memory:')
Base = declarative_base()
Session = sessionmaker(bind=engine)
session = Session()
