import os
from flask import Flask, render_template, url_for
from feed import Feed

app = Flask(__name__)
app.debug = True

@app.route('/')
def homepage():
    return render_template('index.html')

# Hack so people can work on the HTML/JS without python
@app.route('/world-50m.json')
def data():
    return render_template('world-50m.json')
    
@app.route('/articles.json')
def articles():
    feed = Feed(file='data/2014-04-05_16-54.atom')
    json_string = ""
    
    for article in feed.articles:
        json_string += article.to_json()
    return json_string