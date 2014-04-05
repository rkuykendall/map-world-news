import os
from flask import Flask, render_template, url_for

app = Flask(__name__)
app.debug = True

@app.route('/')
def homepage():
    return render_template('index.html')

# Hack so people can work on the HTML/JS without python
@app.route('/world-50m.json')
def data():
    return render_template('world-50m.json')
