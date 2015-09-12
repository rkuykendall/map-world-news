import os


class DefaultConfig(object):
    DEBUG = True


class HerokuConfig(DefaultConfig):
    NAME = "Heroku"
    DATABASE_URI = os.getenv("DATABASE_URL")


class DevelopmentConfig(DefaultConfig):
    NAME = "Developent"
    DATABASE_URI = "sqlite:///development.db"


class TestingConfig(DefaultConfig):
    NAME = "Testing"
    DATABASE_URI = "sqlite:///:memory:"
