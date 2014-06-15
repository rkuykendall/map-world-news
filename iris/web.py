import os

from flask import Flask, render_template, render_template_string, url_for

from feed import Feed


app = Flask(__name__)
app.debug = True


@app.route('/')
def homepage():
    return app.send_static_file('index.html')

@app.route('/articles.json')
def articles():
    feed = Feed()
    feed.load()
    return feed.to_json()


@app.route('/<country>_articles.json')
def country_articles(country=None):
    from feed import Feed
    country=country.encode('ascii', 'ignore')
    country=country.replace("Dem.", "Democratic")
    country=country.replace("Rep.", "Republic")
    country=country.replace("W.", "West")
    country=country.replace("Lao PDR", "Laos")
    country=country.replace("Bosnia and Herz.", "Bosnia and Herzegovina")
    country=country.replace("Eq. Guinea", "Equatorial Guinea")
    country=country.replace("Cte d'Ivoire", "Ivory Coast")
    country=country.replace("Fr. S. Antarctic Lands", "French Southern and Antarctic Lands")
    country=country.replace("Is.", "Islands")
    country=country.replace("S. Sudan", "South Sudan")

    country=country.replace(" ", "_")
    print country

    url1="http://api.feedzilla.com/v1/categories/19/articles/search.atom?q="+country+"&count=50"
    feed = Feed(url1)

    # url2="http://api.feedzilla.com/v1/categories/26/articles/search.atom?q="+country+"&count=10"
    # feed.add_feed(url2)

    # feed = Feed()
    # feed.load()
    # feed.filter_country(country)

    feed.extract()
    return feed.to_json()


@app.route('/admin/count_cache')
def count_cache():
    from article import Article
    from database import session
    return str(session.query(Article.id).count())
