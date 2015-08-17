import json
import re

import feedparser

from article import Article
from iris import log


class Feed:
    """
    Feed stores a list of articles and cleans up junk.
    """

    def __init__(self, feed=None):
        self.articles = {}

        if feed:
            self.add_feed(feed)

    def add_feed(self, feed):
        """
        add_feed takes the URL or file path of a feed, cleans it up,
        and adds the articles this Feed object's list.
        """

        log.info("Retrieving feed: " + feed)

        f = feedparser.parse(feed)

        log.info("Processing feed")
        for item in f['entries']:
            a = Article()

            # Set ID as integer, without feedzilla at beginning
            a.source = item['links'][0]['href']

            if a.source not in self.articles.keys():
                # Set source, author and title
                a.title = item['title']

                # Set summary, get rid of all the junk at the end
                summary = item['summary']
                summary = summary[:summary.find("\n\n")]
                summary = summary[:summary.find("<")]
                a.summary = summary

                # Add the article if it doesn't already exist
                self.articles[a.source] = a

    def extract(self):
        """
        Extract location and sentiment data from the articles contained within
        this feed.
        """

        log.info("Extracing all articles in feed.")
        for key in self.articles:
            self.articles[key].extract()

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
