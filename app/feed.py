import json

import feedparser

from article import Article
from app import log


class Feed:
    """
    Feed stores a list of articles and cleans up junk.
    """

    def __init__(self, feed=None):
        self.articles = []

        if feed:
            self.add_feed(feed)

    def add_feed(self, feed):
        """
        add_feed takes the URL, file path, or data of a feed, cleans it up,
        and adds the articles this Feed object's list.
        """
        log.info("Retrieving feed: " + feed[:30])
        f = feedparser.parse(feed)

        log.info("Processing feed")
        for item in f['entries']:
            self.articles.append(Article(item))

    def extract(self):
        log.info("Extracing location and sentiment from articles in feed.")
        for article in self.articles:
            article.extract()

    def to_json(self):
        log.info("Rendering feed to JSON.")
        return json.dumps([a.to_json() for a in self.articles]), 200
