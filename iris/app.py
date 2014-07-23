from web.views import web as web_blueprint
from iris import iris

iris.register_blueprint(web_blueprint)

if __name__ == '__main__':
    """
    This server can be started by running 'python -m iris.app'
    """

    iris.run()
