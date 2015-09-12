import json
import requests
from datetime import datetime

from flask import request, abort, Blueprint
from sqlalchemy.orm.exc import NoResultFound

from api.feed import Feed
from logger import log

api_blueprint = Blueprint('api_blueprint', __name__, template_folder='')


@api_blueprint.route('/feeds', methods=['POST'])
def feeds():
    from api.kv_store import KvStore, session

    now = datetime.now()
    key = "feeds_{}_{}".format(now.strftime('%Y-%m-%d'), now.month / 6)

    if 'url' in request.form:
        print "=== URL proxy requested: {}".format(
            json.dumps(request.form)[:70])

        url = request.form.get('url')

        try:
            cached = session.query(KvStore).filter_by(key=key).one()
            log.info("Returning from cache: {}".format(url[:100]))
            return cached.value[url], 200
        except NoResultFound:
            log.info("Proxying {}".format(url[:100]))
            r = requests.get(url)
            return r.text, r.status_code

    if 'data' in request.form:
        print "=== Data process requested: {}".format(
            json.dumps(request.form)[:70])
        data = request.form.get('data')
        feed = Feed(feed=data)
        log.info("Extracting from data: {}".format(data[:100].replace('\n', ' ')))
        feed.extract()

        feed_json = json.dumps(feed.serializable())
        log.info("Returning processed JSON: {}".format(feed_json[:100]))
        return feed_json, 200

    abort(400)
