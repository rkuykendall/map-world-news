import pytz
import json
from dateutil import parser

from afinn import Afinn

from country import extract_countries
from logger import log


class Article():
    '''Stores received and computed article data.'''

    def __init__(self, item=None):
        self.sentiment = 0
        self.countries = []
        self.title = ""
        self.summary = ""
        self.link = ""
        self.publushed = None

        if item:
            try:
                # Set source, author and title
                self.link = item['links'][0]['href']
                self.title = item.get('title')
                self.published = parser.parse(item.get('published'))

                if self.published.tzinfo is None:
                    self.published = pytz.utc.localize(self.published)

                # Set summary, get rid of all the junk at the end
                summary = item.get('summary')
                summary = summary[:summary.find("\n\n")]
                summary = summary[:summary.find("<")]
                self.summary = summary
            except:
                log.error("Problem processing article: {}".format(
                    str(item)))

    def extract(self):
        """
        Extracts location and sentiment from an article.
        """

        afinn = Afinn()
        target = self.title + ' ' + self.summary
        target = target.encode('ascii', 'ignore')

        self.sentiment = afinn.score(target)
        self.countries = extract_countries(target)

    def serializable(self):
        attributes = (
            'title', 'summary', 'sentiment', 'link', 'countries')

        article = {
            key: getattr(self, key) for key in attributes
        }
        article['published'] = self.published.isoformat()

        return article
