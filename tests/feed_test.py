import unittest
import os

# Set enviornment before importing any database classes
os.environ["CONFIG_PATH"] = "database.TestingConfig"
from iris.feed import Feed

class TestFeed(unittest.TestCase):
    def test_from_feed(self):
        # # Commented out because search doesn't always have 10 things to return
    	# q="flight"
    	# url="http://api.feedzilla.com/v1/categories/27/articles/search.atom?q="+q+"&count=10"
        url = "http://api.feedzilla.com/v1/categories/16/articles.atom?count=10"
        feed = Feed(url)
        self.assertEqual(len(feed.articles),10)

    def test_from_file(self):
        feed = Feed('tests/data/2014-04-05_16-54.atom')
        self.assertEqual(len(feed.articles),89)

    def test_duplicate_articles(self):
        feed = Feed('tests/data/2014-04-05_16-54.atom')
        feed.add_feed('tests/data/2014-04-05_16-54.atom')
        self.assertEqual(len(feed.articles),89)

    def test_cray(self):
        url = "http://api.feedzilla.com/v1/categories/16/articles.atom?count=10"
        feed = Feed('tests/data/2014-04-05_16-54.atom')
        feed.add_feed(url)
        self.assertEqual(len(feed.articles),99)
