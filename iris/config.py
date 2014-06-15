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
