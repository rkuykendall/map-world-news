from web.views import web as web_blueprint
from iris import iris

iris.register_blueprint(web_blueprint)

if __name__ == '__main__':
    iris.run()
