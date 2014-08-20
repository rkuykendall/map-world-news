import sys
import os
import logging

from flask import Flask
from flask.ext.cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

iris = Flask(__name__)

# Set enviornment variables from the database file
config_path = os.environ.get("CONFIG_PATH", "iris.config.DevelopmentConfig")
iris.config.from_object(config_path)
cors = CORS(iris)

# SQLAlchemy
engine = create_engine(iris.config["DATABASE_URI"])
Base = declarative_base()
Session = sessionmaker(bind=engine)
session = Session()

# Logging
log = logging.getLogger('iris_logger')
log.setLevel(logging.DEBUG)
out_hdlr = logging.StreamHandler(sys.stdout)
out_hdlr.setLevel(logging.INFO)
log.addHandler(out_hdlr)
