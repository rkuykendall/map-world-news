import json
import re

import feedparser

from article import Article
from iris import log


class Feed:
    """
    Feed stores a list of articles and cleans up Feedzilla junk.
    """

    def __init__(self, feed=None):
        self.articles = {}

        if feed:
            self.add_feed(feed)

    def add_feed(self, feed):
        """
        add_feed takes the URL or file path of a Feedzilla feed, cleans it up,
        and adds the articles this Feed object's list.
        """

        log.info("Retrieving feed: " + feed)

        f = feedparser.parse(feed)

        log.info("Processing feed")
        for item in f['entries']:
            a = Article()

            # Set ID as integer, without feedzilla at beginning
            a.id = item['id']
            a.id = re.sub(r'.*feedzilla\.com:(.*)', r'\1', a.id)
            a.id = int(a.id)

            if a.id not in self.articles.keys():
                # Set source, author and title
                a.author = item['author']
                a.title = item['title']
                a.source = item['source']['links'][0]['href']
                a.trueSource = (
                    "http://news.feedzilla.com/en_us/stories/"
                    "world-news/{}".format(a.id))

                # Set summary, get rid of all the junk at the end
                summary = item['summary']
                summary = summary[:summary.find("\n\n")]
                summary = summary[:summary.find("<")]
                a.summary = summary

                # Add the article if it doesn't already exist
                self.articles[a.id] = a

    def extract(self):
        """
        Extract location and sentiment data from the articles contained within
        this feed.
        """

        log.info("Extracing all articles in feed.")
        for article in self.articles:
            article.extract()

    def to_json(self):
        """
        Format this feed as single JSON response.
        """

        log.info("Rendering feed to JSON.")

        response = []
        for a_id in self.articles:
            a = self.articles[a_id]
            response.append(a.to_json())
        return json.dumps(response)
