import sys
import os
import logging

from flask import Flask
from flask.ext.cors import CORS

iris = Flask(__name__)

# Set enviornment variables from the database file
config_path = os.environ.get("CONFIG_PATH", "iris.config.DevelopmentConfig")
iris.config.from_object(config_path)
cors = CORS(iris)

# Logging
log = logging.getLogger('iris_logger')
log.setLevel(logging.DEBUG)
out_hdlr = logging.StreamHandler(sys.stdout)
out_hdlr.setLevel(logging.INFO)
log.addHandler(out_hdlr)
