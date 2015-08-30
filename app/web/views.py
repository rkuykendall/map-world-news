from flask import Blueprint, request

from app.feed import Feed
from app import app, log

web = Blueprint('web', __name__, template_folder='')


@app.route('/')
def homepage():
    return app.send_static_file('index.html')


@app.route('/feeds', methods=['POST'])
def feeds():
    data = request.json
    feed = Feed(feed=data.get('feed'))
    feed.extract()
    return feed.to_json()


@app.route('/feed/<slug>.json')
def category_articles(slug):
    """
    Returns JSON of 100 most recent articles from the category requested.
    """
    slugs = {
        'world': 'http://feeds.reuters.com/Reuters/worldNews',
        'domestic': 'http://feeds.reuters.com/Reuters/domesticNews',
        'top': 'http://feeds.reuters.com/reuters/MostRead',
        'politics': 'http://feeds.reuters.com/Reuters/PoliticsNews'
    }

    url = slugs[slug]
    feed = Feed(url)
    feed.extract()

    log.info("Returning JSON results.")
    return feed.to_json()
