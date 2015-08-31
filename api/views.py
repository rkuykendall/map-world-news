import json
import requests

from flask import request, abort, Blueprint

from api.feed import Feed
from logger import log

api_blueprint = Blueprint('api_blueprint', __name__, template_folder='')


@api_blueprint.route('/feeds', methods=['POST'])
def feeds():
    log.info("New feed process requested: {}".format(
        json.dumps(request.form)[:70]))

    if 'url' in request.form:
        url = request.form.get('url')
        log.info("Proxying {}".format(url[:70]))
        r = requests.get(url)
        return r.text, r.status_code

    if 'data' in request.form:
        data = request.form.get('data')
        feed = Feed(feed=data)
        log.info("Extracting from data: {}".format(data[:70]))
        feed.extract()

        feed_json = json.dumps(feed.serializable())
        log.info("Returning processed JSON: {}".format(feed_json[:70]))
        return feed_json, 200

    abort(400)
