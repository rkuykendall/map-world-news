import feedparser
import datetime
import pytz

from article import Article
from logger import log


class Feed:
    """
    Feed stores a list of articles and cleans up junk.
    """

    def __init__(self, feed=None, disableFilter=False):
        self.articles = []
        self.disableFilter = disableFilter

        if feed:
            self.add_feed(feed)

    def add_feed(self, feed):
        """
        add_feed takes the URL, file path, or data of a feed, cleans it up,
        and adds the articles this Feed object's list.
        """
        f = feedparser.parse(feed)
        ago24h = pytz.utc.localize(
            datetime.datetime.utcnow().replace(tzinfo=pytz.utc)
            - datetime.timedelta(hours=24))

        ignore_total = 0
        for item in f['entries']:
            a = Article(item)
            published = pytz.utc.localize(a.published)

            try:
                if self.disableFilter or published > ago24h:
                    self.articles.append(Article(item))
                else:
                    ignore_total += 1
            except TypeError:
                log.info(published)
                log.info(ago24h)

        if ignore_total > 0:
            print "Ignored {} from more than 24h ago".format(ignore_total)

    def extract(self):
        log.info("Extracing location and sentiment from articles in feed.")
        for article in self.articles:
            article.extract()

    def serializable(self):
        return [
            a.serializable() for a in self.articles]
