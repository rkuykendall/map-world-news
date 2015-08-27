from web.views import web as web_blueprint
from app import app

app.register_blueprint(web_blueprint)

if __name__ == '__main__':
    """
    This server can be started by running 'python -m iris.app'
    """

    app.run()
