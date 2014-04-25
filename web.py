import os
from flask import Flask, render_template, render_template_string, url_for

app = Flask(__name__)
app.debug = True

@app.route('/')
def homepage():
    return app.send_static_file('index.html')


# Hack so people can work on the HTML/JS without python
@app.route('/css/<file>')
def css(file=None):
    return app.send_static_file('css/'+file)

@app.route('/js/<file>')
def js(file=None):
    return app.send_static_file('js/'+file)

@app.route('/json/<file>')
def json(file=None):
    return app.send_static_file('json/'+file)


# Actual code
@app.route('/articles.json')
def articles():
    from feed import Feed
    
    # feed = Feed('data/2014-04-05_16-54.atom')
    feed = Feed()
    feed.load()
    return feed.to_json()

@app.route('/<country>_articles.json')
def country_articles(country=None):
    from feed import Feed
    
    # feed = Feed('data/2014-04-05_16-54.atom')
    feed = Feed()
    feed.load()
    feed.filter_country(country)
    return feed.to_json()



# I get the feeling this is REALLY bad practice,
# but for now, it works.

@app.route('/admin/files_to_db')
def files_to_db():
    from feed import Feed
    feed = Feed()
    feed.load()
    feed.add_feed('data/2014-04-05_16-54.atom')
    feed.save()
    return "Success!"


@app.route('/admin/init_db')
def init_db():
    from article import Article
    from database import Base, engine
    Base.metadata.create_all(engine)
    return "Success!"


@app.route('/admin/analyze10')
def analyze():
    from feed import Feed
    feed = Feed()
    feed.load()
    
    # for a_id in feed.articles:
    #     if feed.articles[a_id]
    # return "Success!"


