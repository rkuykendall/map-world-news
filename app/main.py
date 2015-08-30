from web.views import web as web_blueprint
from api import app

app.register_blueprint(web_blueprint)

if __name__ == '__main__':
    app.run()
