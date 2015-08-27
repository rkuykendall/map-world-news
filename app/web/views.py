from flask import Blueprint

from app.feed import Feed
from app.article import Article
from app.iris import iris, log

web = Blueprint('web', __name__, template_folder='')


@iris.route('/')
def homepage():
    """ Serve up static homepage. This is the only user-facing route. """

    return iris.send_static_file('index.html')


@iris.route('/articles.json')
def articles():
    feed = Feed()
    feed.load()
    return feed.to_json()


@iris.route('/feed/<slug>.json')
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


@iris.route('/<country>_articles.json')
def country_articles(country):
    """
    Returns a JSON just of articles that come up when doing a search for the
    name of the country clicked.
    """

    country = country.encode('ascii', 'ignore')
    country = country.replace("Dem.", "Democratic")
    country = country.replace("Rep.", "Republic")
    country = country.replace("W.", "West")
    country = country.replace("Lao PDR", "Laos")
    country = country.replace("Bosnia and Herz.", "Bosnia and Herzegovina")
    country = country.replace("Eq. Guinea", "Equatorial Guinea")
    country = country.replace("Cte d'Ivoire", "Ivory Coast")
    country = country.replace(
        "Fr. S. Antarctic Lands",
        "French Southern and Antarctic Lands")
    country = country.replace("Is.", "Islands")
    country = country.replace("S. Sudan", "South Sudan")

    country = country.replace(" ", "_")

    log.info("User requested feed for '{}'".format(country))

    # url1 = "http://api.feedzilla.com/v1/categories/19/articles/search.atom"
    # url1 += "?q={}&count=50".format(country)
    # feed = Feed(url1)

    # url2 = "http://api.feedzilla.com/v1/categories/26/articles/search.atom"
    # url2 += "?q={}&count=10".format(country)
    # feed.add_feed(url2)

    # feed = Feed()
    # feed.load()
    # feed.filter_country(country)

    # feed.extract()

    log.info("Returning JSON results.")
    feed = Feed()
    return feed.to_json()


@iris.route('/count_cache')
def count_cache():
    """
    Extreamly simple view of number of currently cached articles, just so I
    can see how the system is doing.
    """

    return str(session.query(Article.id).count())
