import json
import re

import feedparser

from article import Article
from iris import session, log

class Feed:
    """
    Feed stores a list of articles and cleans up Feedzilla junk.
    """

    def __init__(self, feed=None):
        self.articles = {}

        if feed:
            self.add_feed(feed)

    def add_feed(self, feed):
        log.info("Adding feed =>")

        f = feedparser.parse(feed)
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
                a.source=item['source']['links'][0]['href']
                a.trueSource="http://news.feedzilla.com/en_us/stories/world-news/"+str(a.id)

                # Set summary, get rid of all the junk at the end
                summary = item['summary']
                summary = summary[:summary.find("\n\n")]
                summary = summary[:summary.find("<")]
                a.summary = summary

                # Add the article if it doesn't already exist
                self.articles[a.id] = a

        log.info("Done")

    def prune(self):
        """
        Prune the cached extractions database to keep below 10,000 records,
        the free limit on Heroku.
        """

        num = session.query(Article.id).count()
        if(num > 9950):
            for article in session.query(Article
                ).order_by(Article.last_referenced.asc()
                ).limit(500):

                session.delete(article)

    def extract(self):
        """
        Extract location and sentiment data from the articles contained within
        this feed.
        """

        allowance = 200
        iterate = self.articles.keys()

        for a_id in iterate:
            result = self.articles[a_id].extract(allowance)

            if (result == "Extracted"):
                allowance = allowance - 1
            elif (result == "Remove"):
                del self.articles[a_id]

        self.prune()
        session.commit()

    def to_json(self):
        """ Format this feed as single JSON response. """

        response = []
        for a_id in self.articles:
            a = self.articles[a_id]
            response.append(a.to_json())
        return json.dumps(response)
