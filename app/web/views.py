from flask import Blueprint, request

from app.feed import Feed
from app import app, log

web = Blueprint('web', __name__, template_folder='')


@app.route('/feeds', methods=['POST'])
def feeds():
    log.info("New feed process requested: ")

    feed_data = request.json.get('feed')
    feed = Feed(feed=feed_data)
    log.info("Extracting from data: {}".format(feed_data[:50]))
    feed.extract()

    feed_json = feed.to_json()
    log.info("Returning processed JSON: {}".format(feed_json[:50]))
    return feed.to_json(feed_json)
