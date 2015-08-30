class DefaultConfig(object):
    DEBUG = True


class HerokuConfig(DefaultConfig):
    NAME = "Heroku"


class DevelopmentConfig(DefaultConfig):
    NAME = "Developent"


class TestingConfig(DefaultConfig):
    NAME = "Testing"
