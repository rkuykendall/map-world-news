import os

from flask import Flask
from flask.ext.cors import CORS

from views import api_blueprint

app = Flask(__name__)
app.register_blueprint(api_blueprint)


# Set enviornment variables from the database file
config_path = os.environ.get("CONFIG_PATH", "api.config.DevelopmentConfig")
app.config.from_object(config_path)
cors = CORS(app)
