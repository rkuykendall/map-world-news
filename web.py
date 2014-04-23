import os
from flask import Flask, render_template, render_template_string, url_for
from feed import Feed

app = Flask(__name__)
app.debug = True

@app.route('/')
def homepage():
    #return render_template('index.html')
    return app.send_static_file('index.html')

@app.route('/css/<file>')
def css(file=None):
    return app.send_static_file('css/'+file)

@app.route('/js/<file>')
def js(file=None):
    return app.send_static_file('js/'+file)

@app.route('/json/<file>')
def json(file=None):
    return app.send_static_file('json/'+file)



# Hack so people can work on the HTML/JS without python
@app.route('/world-50m.json')
def data():
    return render_template('world-50m.json')

@app.route('/articles.json')
def articles():
    feed = Feed('data/2014-04-05_16-54.atom')
    return feed.to_json()

@app.route('/<country>_articles.json')
def country_articles(country=None):
    feed = Feed('data/2014-04-05_16-54.atom')
    feed.filter_country(country)
    return feed.to_json()
